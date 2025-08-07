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
    // Initialize Supabase with service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { 
      event_type, 
      user_id, 
      user_email, 
      ip_address, 
      user_agent, 
      details, 
      risk_level = 'low' 
    } = await req.json();

    // Validate required fields
    if (!event_type) {
      throw new Error("event_type is required");
    }

    // Log the security event
    const { error } = await supabaseClient
      .from('security_audit_log')
      .insert([{
        event_type,
        user_id,
        user_email,
        ip_address,
        user_agent,
        details: details || {},
        risk_level,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error logging security event:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Security event logged successfully' }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Security logging error:', error);
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