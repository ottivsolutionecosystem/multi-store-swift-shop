
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

    // Generate OAuth authorization URL
    const clientId = Deno.env.get("STRIPE_CONNECT_CLIENT_ID");
    if (!clientId) {
      throw new Error("Stripe Connect Client ID not configured");
    }

    // Get the origin from request to determine return URL
    const origin = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000";
    
    // Fixed redirect URI - centralized callback
    const redirectUri = "https://plugashop.com/stripe/callback";
    
    // Create state parameter with store information and return URL
    const state = btoa(JSON.stringify({
      storeId: storeId,
      userId: user.id,
      returnTo: `${origin}/admin/store-settings`,
      timestamp: Date.now()
    }));

    const authUrl = new URL("https://connect.stripe.com/oauth/authorize");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("scope", "read_write");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);

    console.log(`Generated OAuth URL for store ${storeId}, return to: ${origin}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        auth_url: authUrl.toString(),
        store_id: storeId,
        return_to: origin
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("OAuth connect error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
