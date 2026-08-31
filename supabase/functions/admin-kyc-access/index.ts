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

  try {
    const body = await req.json();
    const { action, orderId, notes } = body;

    // Auth check
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin role check
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // VIEW: Get KYC record with signed URLs
    if (action === "view" && orderId) {
      const { data: kyc, error } = await serviceClient
        .from("kyc_verifications")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();

      if (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch KYC data" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!kyc) {
        return new Response(JSON.stringify({ kyc: null }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate signed URLs for documents (1 hour expiry)
      const signedUrls: Record<string, string | null> = {};
      for (const field of ["card_front_url", "card_back_url", "id_document_url", "selfie_url"] as const) {
        const path = kyc[field];
        if (path) {
          const { data } = await serviceClient.storage
            .from("kyc-documents")
            .createSignedUrl(path, 3600);
          signedUrls[field] = data?.signedUrl || null;
        } else {
          signedUrls[field] = null;
        }
      }

      return new Response(JSON.stringify({ kyc, signedUrls }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // APPROVE
    if (action === "approve" && orderId) {
      const { data: kyc } = await serviceClient
        .from("kyc_verifications")
        .update({ status: "approved", admin_notes: notes || null })
        .eq("order_id", orderId)
        .select("*")
        .single();

      // Update order to processing
      await serviceClient.from("orders").update({ status: "processing" }).eq("id", orderId);

      // Send approval email
      if (kyc) {
        const { data: order } = await serviceClient
          .from("orders").select("*").eq("id", orderId).single();

        if (order) {
          await supabaseClient.functions.invoke("send-transactional-email", {
            body: {
              templateName: "kyc-approved",
              recipientEmail: order.customer_email,
              idempotencyKey: `kyc-approved-${orderId}`,
              templateData: { customerName: order.customer_name, orderNumber: order.order_number },
            },
          });
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // REJECT
    if (action === "reject" && orderId) {
      const { data: kyc } = await serviceClient
        .from("kyc_verifications")
        .update({ status: "rejected", admin_notes: notes || null })
        .eq("order_id", orderId)
        .select("*")
        .single();

      await serviceClient.from("orders").update({ status: "cancelled" }).eq("id", orderId);

      if (kyc) {
        const { data: order } = await serviceClient
          .from("orders").select("*").eq("id", orderId).single();

        if (order) {
          await supabaseClient.functions.invoke("send-transactional-email", {
            body: {
              templateName: "kyc-rejected",
              recipientEmail: order.customer_email,
              idempotencyKey: `kyc-rejected-${orderId}`,
              templateData: { customerName: order.customer_name, orderNumber: order.order_number, reason: notes },
            },
          });
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Admin KYC access error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
