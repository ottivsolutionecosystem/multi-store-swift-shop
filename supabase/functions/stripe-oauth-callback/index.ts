
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, state } = await req.json();

    if (!code || !state) {
      throw new Error("Missing authorization code or state parameter");
    }

    // Decode state parameter
    let stateData;
    try {
      stateData = JSON.parse(atob(state));
    } catch (error) {
      throw new Error("Invalid state parameter");
    }

    const { storeId, userId, returnTo } = stateData;
    if (!storeId || !userId) {
      throw new Error("Invalid state data - missing store or user ID");
    }

    // Exchange authorization code for access token
    const clientSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!clientSecret) {
      throw new Error("Stripe secret key not configured");
    }

    const tokenResponse = await fetch("https://connect.stripe.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Stripe token exchange failed:", errorData);
      throw new Error("Failed to exchange authorization code");
    }

    const tokenData = await tokenResponse.json();
    const {
      stripe_user_id,
      access_token,
      refresh_token,
      scope
    } = tokenData;

    if (!stripe_user_id) {
      throw new Error("No stripe_user_id received from Stripe");
    }

    // Validate that the account is properly configured
    const accountResponse = await fetch(`https://api.stripe.com/v1/accounts/${stripe_user_id}`, {
      headers: {
        "Authorization": `Bearer ${clientSecret}`,
      },
    });

    if (!accountResponse.ok) {
      throw new Error("Failed to verify Stripe account");
    }

    const accountData = await accountResponse.json();
    const isFullyOnboarded = accountData.details_submitted && 
                            accountData.charges_enabled && 
                            accountData.payouts_enabled;

    // Update store settings with OAuth details
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: updateError } = await supabaseService
      .from("store_settings")
      .upsert({
        store_id: storeId,
        stripe_user_id: stripe_user_id,
        stripe_connected: isFullyOnboarded,
        stripe_connect_date: isFullyOnboarded ? new Date().toISOString() : null,
        // Store OAuth details for future use
        payment_settings: {
          stripe: {
            access_token: access_token,
            refresh_token: refresh_token,
            scope: scope,
            account_id: stripe_user_id,
            connection_status: isFullyOnboarded ? 'connected' : 'pending'
          }
        }
      });

    if (updateError) {
      console.error("Database update error:", updateError);
      throw new Error("Failed to update store settings");
    }

    console.log(`OAuth completed for store ${storeId}, account ${stripe_user_id}, onboarded: ${isFullyOnboarded}`);

    return new Response(
      JSON.stringify({
        success: true,
        stripe_user_id: stripe_user_id,
        store_id: storeId,
        return_to: returnTo,
        fully_onboarded: isFullyOnboarded,
        connection_status: isFullyOnboarded ? 'connected' : 'pending'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
