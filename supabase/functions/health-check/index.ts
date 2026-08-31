import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check database connectivity
    const { data: dbHealth, error: dbError } = await supabaseClient.rpc("get_db_health");

    // Check a simple table query
    const { count, error: tableError } = await supabaseClient
      .from("products")
      .select("id", { count: "exact", head: true });

    const responseTime = Date.now() - startTime;

    const status = !dbError && !tableError ? "healthy" : "degraded";

    const healthData = {
      status,
      timestamp: new Date().toISOString(),
      response_time_ms: responseTime,
      checks: {
        database: {
          status: dbError ? "down" : "up",
          details: dbError ? dbError.message : "Connected",
          postgres_version: dbHealth?.postgres_version || "unknown",
        },
        products_table: {
          status: tableError ? "down" : "up",
          record_count: count || 0,
        },
      },
      uptime_info: {
        region: Deno.env.get("DENO_REGION") || "unknown",
      },
    };

    return new Response(JSON.stringify(healthData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: status === "healthy" ? 200 : 503,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return new Response(
      JSON.stringify({
        status: "down",
        timestamp: new Date().toISOString(),
        response_time_ms: responseTime,
        error: "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 503,
      }
    );
  }
});
