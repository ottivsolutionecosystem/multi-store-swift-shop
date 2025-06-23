
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
    const {
      amount,
      currency,
      connectedAccountId,
      customerId,
      description,
      metadata
    } = await req.json();

    // Validate required parameters
    if (!amount || !currency || !connectedAccountId) {
      throw new Error("Missing required parameters: amount, currency, or connectedAccountId");
    }

    // Get Stripe secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured");
    }

    // Verify connected account exists and is valid
    const accountResponse = await fetch(`https://api.stripe.com/v1/accounts/${connectedAccountId}`, {
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
      },
    });

    if (!accountResponse.ok) {
      throw new Error("Invalid or inactive connected account");
    }

    const accountData = await accountResponse.json();
    if (!accountData.charges_enabled) {
      throw new Error("Connected account cannot accept charges");
    }

    // Create PaymentIntent on connected account
    const paymentIntentData = {
      amount: amount,
      currency: currency.toLowerCase(),
      description: description || "Payment via connected store",
      metadata: {
        ...metadata,
        connected_account_id: connectedAccountId,
        processed_at: new Date().toISOString()
      }
    };

    // Add customer if provided
    if (customerId) {
      paymentIntentData.customer = customerId;
    }

    const paymentResponse = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Account": connectedAccountId, // This is key for connected accounts
      },
      body: new URLSearchParams(paymentIntentData),
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.text();
      console.error("Payment creation failed:", errorData);
      throw new Error("Failed to create payment");
    }

    const paymentIntent = await paymentResponse.json();

    console.log(`Payment created: ${paymentIntent.id} for account ${connectedAccountId}`);

    return new Response(
      JSON.stringify({
        success: true,
        payment_intent_id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        connected_account_id: connectedAccountId
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Payment processing error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
