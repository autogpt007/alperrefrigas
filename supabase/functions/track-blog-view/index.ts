import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { blogPostId, userAgent, referrer } = await req.json();

    // Get client IP from headers
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Hash the IP for privacy
    const ipHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(clientIP + 'blog-salt')
    );
    const ipHashString = Array.from(new Uint8Array(ipHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Get geolocation data
    let countryCode = null;
    let countryName = null;

    try {
      if (clientIP !== 'unknown' && !clientIP.startsWith('127.') && !clientIP.startsWith('192.168.')) {
        const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,country,countryCode`);
        const geoData = await geoResponse.json();
        
        if (geoData.status === 'success') {
          countryCode = geoData.countryCode;
          countryName = geoData.country;
        }
      }
    } catch (error) {
      console.log('Geolocation lookup failed:', error);
      // Continue without geo data
    }

    // Check if blog post exists
    const { data: blogPost, error: blogError } = await supabaseClient
      .from('blog_posts')
      .select('id')
      .eq('id', blogPostId)
      .single();

    if (blogError || !blogPost) {
      console.log('Blog post not found:', blogPostId);
      return new Response(
        JSON.stringify({ error: 'Blog post not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert view record
    const { error: viewError } = await supabaseClient
      .from('blog_post_views')
      .insert({
        blog_post_id: blogPostId,
        viewer_ip_hash: ipHashString,
        country_code: countryCode,
        country_name: countryName,
        user_agent: userAgent || null,
        referrer: referrer || null,
        user_id: null // We could get this from auth if needed
      });

    if (viewError) {
      console.error('Error inserting view:', viewError);
      return new Response(
        JSON.stringify({ error: 'Failed to track view' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in track-blog-view function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});