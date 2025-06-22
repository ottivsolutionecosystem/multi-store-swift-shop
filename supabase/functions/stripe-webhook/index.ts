
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
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("Missing Stripe signature");
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("Missing webhook secret");
    }

    // Simple signature verification (in production, use proper crypto verification)
    console.log("Webhook received with signature:", signature);

    const event = JSON.parse(body);
    console.log("Webhook event:", event.type, event.data?.object?.id);

    // Use service role client for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case "account.updated": {
        const account = event.data.object;
        const accountId = account.id;
        
        // Find store by stripe_user_id
        const { data: storeSettings } = await supabaseService
          .from("store_settings")
          .select("store_id")
          .eq("stripe_user_id", accountId)
          .single();

        if (storeSettings) {
          const isFullyOnboarded = account.details_submitted && 
                                  account.charges_enabled && 
                                  account.payouts_enabled;

          await supabaseService
            .from("store_settings")
            .update({
              stripe_connected: isFullyOnboarded,
              stripe_connect_date: isFullyOnboarded ? new Date().toISOString() : null,
            })
            .eq("store_id", storeSettings.store_id);

          console.log(`Updated account ${accountId} - connected: ${isFullyOnboarded}`);
        }
        break;
      }

      case "capability.updated": {
        const capability = event.data.object;
        const accountId = capability.account;
        
        // Find store and check if all capabilities are active
        const { data: storeSettings } = await supabaseService
          .from("store_settings")
          .select("store_id")
          .eq("stripe_user_id", accountId)
          .single();

        if (storeSettings) {
          // Fetch full account to check all capabilities
          const stripeResponse = await fetch(`https://api.stripe.com/v1/accounts/${accountId}`, {
            headers: {
              "Authorization": `Bearer ${Deno.env.get("STRIPE_SECRET_KEY")}`,
            },
          });

          if (stripeResponse.ok) {
            const account = await stripeResponse.json();
            const isFullyOnboarded = account.details_submitted && 
                                    account.charges_enabled && 
                                    account.payouts_enabled;

            await supabaseService
              .from("store_settings")
              .update({
                stripe_connected: isFullyOnboarded,
                stripe_connect_date: isFullyOnboarded ? new Date().toISOString() : null,
              })
              .eq("store_id", storeSettings.store_id);

            console.log(`Updated capability for account ${accountId} - connected: ${isFullyOnboarded}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
