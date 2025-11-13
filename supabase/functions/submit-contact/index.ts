import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubmissionData {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  phone?: string;
  company_name?: string;
  whatsapp_phone?: string;
  shipping_address?: string;
  notes?: string;
  type: 'contact' | 'newsletter' | 'quote';
}

// Rate limiting storage (in-memory for demo - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (ip: string, maxRequests = 5, windowMs = 300000): boolean => {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
};

const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      console.error(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const submissionData: SubmissionData = await req.json();

    // Validate required fields
    if (!submissionData.type || !['contact', 'newsletter', 'quote'].includes(submissionData.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid submission type' }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (!submissionData.email || !validateEmail(submissionData.email)) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Sanitize all string inputs
    const sanitizedData = {
      ...submissionData,
      name: submissionData.name ? sanitizeInput(submissionData.name) : '',
      email: submissionData.email.toLowerCase().trim(),
      subject: submissionData.subject ? sanitizeInput(submissionData.subject) : null,
      message: submissionData.message ? sanitizeInput(submissionData.message) : null,
      phone: submissionData.phone ? sanitizeInput(submissionData.phone) : null,
      company_name: submissionData.company_name ? sanitizeInput(submissionData.company_name) : null,
      whatsapp_phone: submissionData.whatsapp_phone ? sanitizeInput(submissionData.whatsapp_phone) : null,
      shipping_address: submissionData.shipping_address ? sanitizeInput(submissionData.shipping_address) : null,
      notes: submissionData.notes ? sanitizeInput(submissionData.notes) : null,
    };

    // Initialize Supabase with service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let insertResult;

    // Insert based on submission type
    switch (sanitizedData.type) {
      case 'contact':
        if (!sanitizedData.name || !sanitizedData.message) {
          return new Response(
            JSON.stringify({ error: 'Name and message are required for contact submissions' }),
            { 
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }

        insertResult = await supabaseClient
          .from('contact_submissions')
          .insert({
            name: sanitizedData.name,
            email: sanitizedData.email,
            subject: sanitizedData.subject,
            message: sanitizedData.message,
            status: 'new'
          });
        break;

      case 'newsletter':
        insertResult = await supabaseClient
          .from('newsletter_subscribers')
          .insert({
            email: sanitizedData.email,
            name: sanitizedData.name || null,
            source: 'website',
            is_active: true
          });
        break;

      case 'quote':
        if (!sanitizedData.name) {
          return new Response(
            JSON.stringify({ error: 'Name is required for quote requests' }),
            { 
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }

        insertResult = await supabaseClient
          .from('quotes')
          .insert({
            customer_name: sanitizedData.name,
            customer_email: sanitizedData.email,
            phone: sanitizedData.phone,
            company_name: sanitizedData.company_name,
            shipping_address: sanitizedData.shipping_address,
            notes: sanitizedData.notes,
            status: 'pending',
            user_id: null // Anonymous submission
          });
        break;
    }

    if (insertResult?.error) {
      console.error(`Error inserting ${sanitizedData.type}:`, insertResult.error);
      
      // Handle duplicate email for newsletter
      if (sanitizedData.type === 'newsletter' && insertResult.error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'This email is already subscribed to our newsletter.' }),
          { 
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify({ error: `Failed to submit ${sanitizedData.type}` }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`${sanitizedData.type} submission successful for: ${sanitizedData.email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${sanitizedData.type} submitted successfully`,
        type: sanitizedData.type
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Submit contact error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});