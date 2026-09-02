import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
// Must stay in sync with supabase/functions/send-transactional-email/index.ts —
// the verified sender subdomain is what Resend authorises the send against.
const SENDER_DOMAIN = "notify.alperrefrigas.com";
const FROM_DOMAIN = "alperrefrigerants.com";
const FROM_EMAIL =
  Deno.env.get("INVOICE_FROM_EMAIL") || `Alper Refrigerants <invoices@${FROM_DOMAIN}>`;
const REPLY_TO = "sales@alperrefrigerants.com";
const BUCKET = "customer-invoices";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const money = (n: number, currency: string) =>
  `${currency} ${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function emailHtml(d: {
  buyerName: string;
  label: string;
  docNumber: string;
  total: string;
  paymentTerms?: string | null;
  notes?: string | null;
  fileName: string;
}) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#0f172a,#1e1b4b);padding:32px;text-align:center;">
      <h1 style="color:#22d3ee;margin:0;font-size:24px;">Your ${esc(d.label)} is attached</h1>
      <p style="color:#cbd5e1;margin:8px 0 0;">${esc(d.label)} #${esc(d.docNumber)}</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#334155;font-size:14px;">Dear ${esc(d.buyerName)},</p>
      <p style="color:#334155;font-size:14px;">
        Please find your ${esc(d.label.toLowerCase())} attached to this email as a PDF
        (<strong>${esc(d.fileName)}</strong>). No download link or login is required.
      </p>
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;color:#0369a1;font-weight:bold;">${esc(d.label)} #${esc(d.docNumber)}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:14px;">Amount: <strong style="color:#0f172a;">${esc(d.total)}</strong></p>
        ${d.paymentTerms ? `<p style="margin:4px 0 0;color:#64748b;font-size:14px;">Payment terms: ${esc(d.paymentTerms)}</p>` : ""}
      </div>
      ${d.notes ? `<p style="color:#475569;font-size:14px;white-space:pre-line;">${esc(d.notes)}</p>` : ""}
      <p style="color:#64748b;font-size:14px;">Questions? Reply to this email or contact ${REPLY_TO} · +1-682-215-2974.</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
    </div>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY || !RESEND_API_KEY || !supabaseUrl || !serviceKey) {
      return json({ error: "Server configuration error" }, 500);
    }

    // --- Auth: admin only ---
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    if (userError || !userData?.user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    // --- Input ---
    const body = await req.json().catch(() => ({}));
    const documentId = typeof body.documentId === "string" ? body.documentId : "";
    const recipientEmail = typeof body.recipientEmail === "string" ? body.recipientEmail.trim() : "";
    if (!documentId) return json({ error: "documentId is required" }, 400);
    if (!EMAIL_RE.test(recipientEmail)) return json({ error: "Valid recipientEmail is required" }, 400);

    const { data: doc, error: docError } = await admin
      .from("generated_documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();
    if (docError || !doc) return json({ error: "Document not found" }, 404);
    if (!doc.pdf_path) return json({ error: "No PDF stored for this document" }, 400);

    // --- Fetch the stored PDF and attach it ---
    const { data: file, error: dlError } = await admin.storage.from(BUCKET).download(doc.pdf_path);
    if (dlError || !file) return json({ error: "Could not read stored PDF" }, 400);

    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.byteLength > 18 * 1024 * 1024) {
      return json({ error: "PDF is too large to attach (max 18MB)" }, 400);
    }

    const label = doc.document_type === "quote" ? "Quotation" : "Invoice";
    const fileName = `${label}-${doc.document_number}.pdf`;

    const emailResponse = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        sender_domain: SENDER_DOMAIN,
        to: [recipientEmail],
        reply_to: REPLY_TO,
        subject: `${label} ${doc.document_number} from Alper Refrigerants`,
        html: emailHtml({
          buyerName: doc.buyer_name,
          label,
          docNumber: doc.document_number,
          total: money(Number(doc.total), doc.currency || "USD"),
          paymentTerms: doc.payment_terms,
          notes: doc.notes,
          fileName,
        }),
        attachments: [{ filename: fileName, content: toBase64(bytes) }],
      }),
    });

    const result = await emailResponse.json().catch(() => ({}));
    if (!emailResponse.ok) {
      console.error("Resend error", result);
      // Surface the provider's own wording so the admin sees the real cause
      // (unverified sender domain, suppressed recipient, invalid address...).
      const providerMessage =
        (result as { message?: string; error?: string })?.message ||
        (result as { error?: string })?.error ||
        `Email provider rejected the send (${emailResponse.status})`;
      return json({ error: providerMessage, stage: "provider", details: result }, 502);
    }

    console.log(`Invoice PDF emailed: ${doc.document_number} -> ${recipientEmail}`);

    // Audit trail — written with the service role so it cannot be tampered with client-side.
    await admin.from("admin_audit_log").insert({
      admin_id: userData.user.id,
      admin_email: userData.user.email,
      action: "invoice.email_sent",
      resource_type: "generated_document",
      resource_id: doc.id,
      resource_label: doc.document_number,
      new_value: { recipient: recipientEmail, from: FROM_EMAIL, file_name: fileName },
    });

    return json({ success: true, id: result.id, fileName });
  } catch (error) {
    console.error("send-invoice-document error", error);
    return json({ error: "Internal server error" }, 500);
  }
});
