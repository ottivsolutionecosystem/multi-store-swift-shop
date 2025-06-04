
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PromotionStatusUpdate {
  storeId: string;
  updatedCount: number;
  scheduledToActive: number;
  activeToExpired: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting promotion status update cron job...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const now = new Date().toISOString();
    console.log('Current time:', now);

    // Get all stores to update promotions for each store
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id');

    if (storesError) {
      throw new Error(`Failed to fetch stores: ${storesError.message}`);
    }

    const results: PromotionStatusUpdate[] = [];

    for (const store of stores || []) {
      let scheduledToActive = 0;
      let activeToExpired = 0;

      // Update scheduled promotions to active when start_date is reached
      const { data: activatedPromotions, error: activateError } = await supabase
        .from('promotions')
        .update({ status: 'active' })
        .eq('store_id', store.id)
        .eq('status', 'scheduled')
        .lte('start_date', now)
        .select('id');

      if (activateError) {
        console.error(`Error activating promotions for store ${store.id}:`, activateError);
      } else {
        scheduledToActive = activatedPromotions?.length || 0;
        console.log(`Activated ${scheduledToActive} promotions for store ${store.id}`);
      }

      // Update active promotions to expired when end_date is passed
      const { data: expiredPromotions, error: expireError } = await supabase
        .from('promotions')
        .update({ status: 'expired' })
        .eq('store_id', store.id)
        .eq('status', 'active')
        .lt('end_date', now)
        .select('id');

      if (expireError) {
        console.error(`Error expiring promotions for store ${store.id}:`, expireError);
      } else {
        activeToExpired = expiredPromotions?.length || 0;
        console.log(`Expired ${activeToExpired} promotions for store ${store.id}`);
      }

      results.push({
        storeId: store.id,
        updatedCount: scheduledToActive + activeToExpired,
        scheduledToActive,
        activeToExpired,
      });
    }

    const totalUpdated = results.reduce((sum, result) => sum + result.updatedCount, 0);
    
    console.log('Promotion status update completed:', {
      totalStores: stores?.length || 0,
      totalUpdated,
      timestamp: now,
      results
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Promotion status update completed successfully',
        totalStores: stores?.length || 0,
        totalUpdated,
        timestamp: now,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in promotion status update:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
