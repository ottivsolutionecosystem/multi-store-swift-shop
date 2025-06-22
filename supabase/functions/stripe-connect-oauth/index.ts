
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
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // This should contain storeId
    const error = url.searchParams.get("error");

    if (error) {
      console.error("Stripe OAuth error:", error);
      return new Response(
        `<html><script>window.opener.postMessage({type: 'stripe_error', error: '${error}'}, '*'); window.close();</script></html>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    if (!code || !state) {
      throw new Error("Missing authorization code or state parameter");
    }

    // Exchange the authorization code for access token and stripe_user_id
    const tokenResponse = await fetch("https://connect.stripe.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_secret: Deno.env.get("STRIPE_SECRET_KEY") || "",
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
    const stripeUserId = tokenData.stripe_user_id;

    if (!stripeUserId) {
      throw new Error("No stripe_user_id received from Stripe");
    }

    // Update store settings with Stripe Connect information
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: updateError } = await supabaseService
      .from("store_settings")
      .update({
        stripe_user_id: stripeUserId,
        stripe_connected: true,
        stripe_connect_date: new Date().toISOString(),
      })
      .eq("store_id", state);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw new Error("Failed to update store settings");
    }

    // Send success message to parent window and close popup
    return new Response(
      `<html>
        <script>
          window.opener.postMessage({
            type: 'stripe_success', 
            stripe_user_id: '${stripeUserId}'
          }, '*'); 
          window.close();
        </script>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );

  } catch (error) {
    console.error("Stripe Connect OAuth error:", error);
    return new Response(
      `<html><script>window.opener.postMessage({type: 'stripe_error', error: '${error.message}'}, '*'); window.close();</script></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
});
