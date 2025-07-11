import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'contact' | 'order' | 'quote';
  data: any;
}

const resend = new Resend('re_XnueqiFG_PsgTCqZwxFxkpVdJcXw7bD24');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get notification email from settings (default to your email)
    const { data: settingsData } = await supabase
      .from('notification_settings')
      .select('setting_value')
      .eq('setting_key', 'notification_email')
      .single();

    const notificationEmail = settingsData?.setting_value || 'eddy3597@gmail.com';

    const { type, data }: EmailRequest = await req.json();

    let emailContent = '';
    let subject = '';

    switch (type) {
      case 'contact':
        subject = `New Contact Form Submission from ${data.name}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">New Contact Form Submission</h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-left: 4px solid #0891b2; margin: 10px 0;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
              <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="color: #64748b; font-size: 12px;">Please respond to this inquiry within 24 hours.</p>
          </div>
        `;
        break;
      
      case 'order':
        subject = `🛒 New Order #${data.order_number} from ${data.customer_name}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">🛒 New Order Received</h2>
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order Number:</strong> <span style="font-family: monospace; background: #dcfce7; padding: 4px 8px; border-radius: 4px;">${data.order_number}</span></p>
              <p><strong>Customer:</strong> ${data.customer_name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.customer_email}">${data.customer_email}</a></p>
              <p><strong>Total Amount:</strong> <span style="font-size: 18px; color: #059669; font-weight: bold;">$${data.total_amount}</span></p>
              <p><strong>Order Date:</strong> ${new Date(data.created_at).toLocaleString()}</p>
            </div>
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0;"><strong>Action Required:</strong> Please check the admin panel for full order details and begin processing.</p>
            </div>
          </div>
        `;
        break;
      
      case 'quote':
        subject = `💼 New Quote Request from ${data.customer_name}`;
        emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">💼 New Quote Request</h2>
            <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Customer:</strong> ${data.customer_name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.customer_email}">${data.customer_email}</a></p>
              <p><strong>Company:</strong> ${data.company || 'Not specified'}</p>
              ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-left: 4px solid #7c3aed; margin: 10px 0;">
                ${data.message ? data.message.replace(/\n/g, '<br>') : 'No additional message provided'}
              </div>
              <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0;"><strong>Follow Up:</strong> Please review the quote request and respond within 2 business days.</p>
            </div>
          </div>
        `;
        break;
    }

    // Send email using Resend
    console.log('Sending email to:', notificationEmail);
    
    const emailResponse = await resend.emails.send({
      from: "FrigidFlow Notifications <notifications@resend.dev>",
      to: [notificationEmail],
      subject,
      html: emailContent,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
        emailId: emailResponse.data?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending notification email:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send notification email'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});