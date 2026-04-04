import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle JSON token verification requests
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body.action === "verify-token" && body.token) {
        const { data: kyc, error: kycError } = await serviceClient
          .from("kyc_verifications")
          .select("status, order_id")
          .eq("token", body.token)
          .maybeSingle();

        if (kycError || !kyc) {
          return new Response(
            JSON.stringify({ error: "Invalid or expired verification link" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (kyc.status !== "pending") {
          return new Response(
            JSON.stringify({ error: "This verification has already been submitted", status: kyc.status }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ valid: true, status: kyc.status }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const token = formData.get("token") as string;
    const billingName = formData.get("billing_name") as string;
    const billingStreet = formData.get("billing_street") as string;
    const billingCity = formData.get("billing_city") as string;
    const billingState = formData.get("billing_state") as string;
    const billingZip = formData.get("billing_zip") as string;
    const billingCountry = formData.get("billing_country") as string;
    const cardFront = formData.get("card_front") as File | null;
    const cardBack = formData.get("card_back") as File | null;
    const idDocument = formData.get("id_document") as File | null;
    const selfie = formData.get("selfie") as File | null;

    // Validate token
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate billing info
    if (!billingName || !billingStreet || !billingCity || !billingState || !billingZip || !billingCountry) {
      return new Response(
        JSON.stringify({ error: "All billing fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate files
    if (!cardFront || !cardBack || !idDocument || !selfie) {
      return new Response(
        JSON.stringify({ error: "All document uploads are required (card front, card back, ID, selfie)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const files = [
      { file: cardFront, name: "card_front" },
      { file: cardBack, name: "card_back" },
      { file: idDocument, name: "id_document" },
      { file: selfie, name: "selfie" },
    ];

    for (const { file, name } of files) {
      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: `${name} exceeds maximum file size of 10MB` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: `${name} must be JPEG, PNG, or WebP` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Look up KYC record by token
    const { data: kyc, error: kycError } = await serviceClient
      .from("kyc_verifications")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .maybeSingle();

    if (kycError || !kyc) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification link" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload files to kyc-documents bucket
    const uploadedUrls: Record<string, string> = {};
    for (const { file, name } of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${kyc.id}/${name}.${ext}`;
      const buffer = await file.arrayBuffer();

      const { error: uploadError } = await serviceClient.storage
        .from("kyc-documents")
        .upload(path, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error(`Upload error for ${name}:`, uploadError);
        return new Response(
          JSON.stringify({ error: `Failed to upload ${name}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      uploadedUrls[name] = path;
    }

    // Update KYC record
    const { error: updateError } = await serviceClient
      .from("kyc_verifications")
      .update({
        status: "submitted",
        billing_name: billingName,
        billing_address: {
          street: billingStreet,
          city: billingCity,
          state: billingState,
          zip: billingZip,
          country: billingCountry,
        },
        card_front_url: uploadedUrls.card_front,
        card_back_url: uploadedUrls.card_back,
        id_document_url: uploadedUrls.id_document,
        selfie_url: uploadedUrls.selfie,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", kyc.id);

    if (updateError) {
      console.error("KYC update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to save verification data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`KYC submitted for order ${kyc.order_id}, kyc_id=${kyc.id}`);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Submit KYC error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
