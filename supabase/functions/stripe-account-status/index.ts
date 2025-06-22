
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
    // Create Supabase client using the anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user's store settings
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("store_id")
      .eq("id", user.id)
      .single();

    if (!profile?.store_id) {
      throw new Error("User store not found");
    }

    const { data: storeSettings } = await supabaseClient
      .from("store_settings")
      .select("stripe_user_id, stripe_connected")
      .eq("store_id", profile.store_id)
      .single();

    if (!storeSettings?.stripe_user_id) {
      return new Response(
        JSON.stringify({ 
          connected: false, 
          message: "No Stripe account found" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Check account status with Stripe
    const stripeResponse = await fetch(`https://api.stripe.com/v1/accounts/${storeSettings.stripe_user_id}`, {
      headers: {
        "Authorization": `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
      },
    });

    if (!stripeResponse.ok) {
      console.error("Failed to fetch Stripe account status");
      throw new Error("Failed to check account status");
    }

    const account = await stripeResponse.json();

    const isFullyOnboarded = account.details_submitted && 
                            account.charges_enabled && 
                            account.payouts_enabled;

    // Update database if status changed
    if (isFullyOnboarded !== storeSettings.stripe_connected) {
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      await supabaseService
        .from("store_settings")
        .update({
          stripe_connected: isFullyOnboarded,
          stripe_connect_date: isFullyOnboarded ? new Date().toISOString() : null,
        })
        .eq("store_id", profile.store_id);
    }

    return new Response(
      JSON.stringify({
        connected: isFullyOnboarded,
        account_id: account.id,
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        requirements: account.requirements,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Account status check error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
