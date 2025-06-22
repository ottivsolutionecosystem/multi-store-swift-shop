
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

    // Get user's store_id
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("store_id")
      .eq("id", user.id)
      .single();

    if (!profile?.store_id) {
      throw new Error("User store not found");
    }

    const storeId = profile.store_id;

    // Get store information for account creation
    const { data: store } = await supabaseClient
      .from("stores")
      .select("name")
      .eq("id", storeId)
      .single();

    if (!store) {
      throw new Error("Store not found");
    }

    // Create Stripe Account
    const stripeResponse = await fetch("https://api.stripe.com/v1/accounts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        type: "standard",
        country: "BR",
        "business_profile[name]": store.name,
        "metadata[store_id]": storeId,
      }),
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text();
      console.error("Stripe account creation failed:", errorData);
      throw new Error("Failed to create Stripe account");
    }

    const stripeAccount = await stripeResponse.json();
    console.log("Stripe account created:", stripeAccount.id);

    // Create Account Link for onboarding
    const accountLinkResponse = await fetch("https://api.stripe.com/v1/account_links", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        account: stripeAccount.id,
        return_url: `${req.headers.get("origin")}/admin/store-settings?stripe_success=true`,
        refresh_url: `${req.headers.get("origin")}/admin/store-settings?stripe_refresh=true`,
        type: "account_onboarding",
      }),
    });

    if (!accountLinkResponse.ok) {
      const errorData = await accountLinkResponse.text();
      console.error("Account link creation failed:", errorData);
      throw new Error("Failed to create account link");
    }

    const accountLink = await accountLinkResponse.json();

    // Use service role client to update store settings
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error } = await supabaseService
      .from("store_settings")
      .upsert({
        store_id: storeId,
        stripe_user_id: stripeAccount.id,
        stripe_connected: false, // Will be updated via webhook when onboarding completes
        stripe_connect_date: null, // Will be updated via webhook
      });

    if (error) {
      console.error("Database update error:", error);
      throw new Error("Failed to update store settings");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        account_link_url: accountLink.url,
        account_id: stripeAccount.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Stripe account creation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
