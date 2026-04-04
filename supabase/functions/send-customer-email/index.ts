import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM_EMAIL = "Alper Refrigerants <noreply@alperrefrigas.com>";

function orderConfirmationHtml(data: any): string {
  const itemsHtml = (data.items || []).map((item: any) =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.product_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${(item.price || 0).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#0f172a,#1e1b4b);padding:32px;text-align:center;">
      <h1 style="color:#22d3ee;margin:0;font-size:24px;">Order Confirmed!</h1>
      <p style="color:#cbd5e1;margin:8px 0 0;">Thank you for your order, ${data.customerName}</p>
    </div>
    <div style="padding:24px;">
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin-bottom:20px;">
        <p style="margin:0;color:#0369a1;font-weight:bold;">Order #${data.orderNumber}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:14px;">Total: <strong style="color:#0f172a;">$${(data.totalAmount || 0).toFixed(2)}</strong></p>
      </div>
      ${itemsHtml ? `
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead><tr style="background:#f1f5f9;">
          <th style="padding:8px 12px;text-align:left;font-size:13px;color:#64748b;">Product</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;color:#64748b;">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b;">Price</th>
        </tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>` : ''}
      <p style="color:#64748b;font-size:14px;">We'll notify you when your order ships. For questions, reply to this email or contact sales@alperrefrigas.com.</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
    </div>
  </div>`;
}

function quoteConfirmationHtml(data: any): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#0f172a,#1e1b4b);padding:32px;text-align:center;">
      <h1 style="color:#22d3ee;margin:0;font-size:24px;">Quote Request Received</h1>
      <p style="color:#cbd5e1;margin:8px 0 0;">We'll get back to you shortly, ${data.customerName}</p>
    </div>
    <div style="padding:24px;">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:20px;">
        <p style="margin:0;color:#166534;font-weight:bold;">Quote #${data.quoteNumber}</p>
        <p style="margin:4px 0 0;color:#64748b;font-size:14px;">Status: Under Review</p>
      </div>
      <p style="color:#334155;font-size:14px;">Our team is reviewing your request and will provide competitive wholesale pricing within 4 business hours.</p>
      <p style="color:#64748b;font-size:14px;">For urgent inquiries, contact us at sales@alperrefrigas.com or +1-787-965-8975.</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
    </div>
  </div>`;
}

function contactConfirmationHtml(data: any): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#0f172a,#1e1b4b);padding:32px;text-align:center;">
      <h1 style="color:#22d3ee;margin:0;font-size:24px;">Message Received</h1>
      <p style="color:#cbd5e1;margin:8px 0 0;">Thank you for reaching out, ${data.name}</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#334155;font-size:14px;">We've received your message and our team will respond within 4 hours during business hours.</p>
      ${data.subject ? `<p style="color:#64748b;font-size:14px;"><strong>Subject:</strong> ${data.subject}</p>` : ''}
      <p style="color:#64748b;font-size:14px;">If your matter is urgent, please call us at +1-787-965-8975.</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
    </div>
  </div>`;
}

function kycRequestHtml(data: any): string {
  const itemsHtml = (data.items || []).map((item: any) =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.product_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${(item.price || 0).toFixed(2)}</td>
    </tr>`
  ).join('');

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#92400e,#b45309);padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">🔒 Identity Verification Required</h1>
      <p style="color:#fde68a;margin:8px 0 0;">Action required for Order #${data.orderNumber}</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#334155;font-size:14px;">Dear ${data.customerName},</p>
      <p style="color:#334155;font-size:14px;">To protect you and process your order securely, we require identity verification. This is a standard security measure for credit card transactions.</p>
      
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#92400e;font-weight:bold;">Order Summary</p>
        <p style="margin:0;color:#78350f;font-size:14px;">Order #${data.orderNumber} — Total: $${(data.totalAmount || 0).toFixed(2)}</p>
      </div>

      ${itemsHtml ? `
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead><tr style="background:#f1f5f9;">
          <th style="padding:8px 12px;text-align:left;font-size:13px;color:#64748b;">Product</th>
          <th style="padding:8px 12px;text-align:center;font-size:13px;color:#64748b;">Qty</th>
          <th style="padding:8px 12px;text-align:right;font-size:13px;color:#64748b;">Price</th>
        </tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>` : ''}

      <p style="color:#334155;font-size:14px;font-weight:bold;">What you'll need:</p>
      <ol style="color:#475569;font-size:14px;padding-left:20px;">
        <li style="margin-bottom:8px;">Name and billing address registered to your card</li>
        <li style="margin-bottom:8px;">Photo of your credit card (front and back)</li>
        <li style="margin-bottom:8px;">A valid government-issued ID</li>
        <li style="margin-bottom:8px;">A selfie holding your ID clearly visible</li>
      </ol>

      <div style="text-align:center;margin:24px 0;">
        <a href="${data.kycLink}" style="display:inline-block;background:#b45309;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:16px;">Complete Verification</a>
      </div>

      <p style="color:#94a3b8;font-size:12px;text-align:center;">This link expires in 72 hours. All documents are stored securely and encrypted.</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
    </div>
  </div>`;
}

function kycApprovedHtml(data: any): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#065f46,#047857);padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">✅ Verification Approved</h1>
      <p style="color:#a7f3d0;margin:8px 0 0;">Your order is being processed!</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#334155;font-size:14px;">Dear ${data.customerName},</p>
      <p style="color:#334155;font-size:14px;">Your identity verification for Order #${data.orderNumber} has been approved. We are now processing your order and will notify you when it ships.</p>
      <p style="color:#64748b;font-size:14px;">Thank you for your patience and for helping us keep transactions secure.</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
    </div>
  </div>`;
}

function kycRejectedHtml(data: any): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:linear-gradient(135deg,#991b1b,#b91c1c);padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;">❌ Verification Issue</h1>
      <p style="color:#fca5a5;margin:8px 0 0;">Additional action needed for Order #${data.orderNumber}</p>
    </div>
    <div style="padding:24px;">
      <p style="color:#334155;font-size:14px;">Dear ${data.customerName},</p>
      <p style="color:#334155;font-size:14px;">Unfortunately, we were unable to verify your identity for Order #${data.orderNumber}. ${data.reason || 'The documents provided did not meet our verification requirements.'}</p>
      <p style="color:#334155;font-size:14px;">Please contact us at sales@alperrefrigas.com or +1-787-965-8975 to resolve this issue.</p>
    </div>
    <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Alper Chemical Group | 382 NE 191st St, Miami, FL 33179</p>
    </div>
  </div>`;
}

const TEMPLATES: Record<string, { subject: (d: any) => string; html: (d: any) => string }> = {
  'order-confirmation': {
    subject: (d) => `Order Confirmed — #${d.orderNumber}`,
    html: orderConfirmationHtml,
  },
  'quote-confirmation': {
    subject: (d) => `Quote Request Received — #${d.quoteNumber}`,
    html: quoteConfirmationHtml,
  },
  'contact-confirmation': {
    subject: () => `We received your message — Alper Refrigerants`,
    html: contactConfirmationHtml,
  },
  'kyc-request': {
    subject: (d) => `Action Required: Verify Your Identity — Order #${d.orderNumber}`,
    html: kycRequestHtml,
  },
  'kyc-approved': {
    subject: (d) => `Verification Approved — Order #${d.orderNumber}`,
    html: kycApprovedHtml,
  },
  'kyc-rejected': {
    subject: (d) => `Verification Issue — Order #${d.orderNumber}`,
    html: kycRejectedHtml,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

    const body = await req.json();
    const { type, to, data } = body;

    if (!type || !to || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, to, data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const template = TEMPLATES[type];
    if (!template) {
      return new Response(
        JSON.stringify({ error: `Unknown email type: ${type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: template.subject(data),
        html: template.html(data),
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Email sent: type=${type}, to=${to}`);
    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send email error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
