
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'contact' | 'order' | 'quote';
  data: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get notification email from settings
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
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        `;
        break;
      
      case 'order':
        subject = `New Order #${data.order_number} from ${data.customer_name}`;
        emailContent = `
          <h2>New Order Received</h2>
          <p><strong>Order Number:</strong> ${data.order_number}</p>
          <p><strong>Customer:</strong> ${data.customer_name}</p>
          <p><strong>Email:</strong> ${data.customer_email}</p>
          <p><strong>Total Amount:</strong> $${data.total_amount}</p>
          <p><strong>Order Date:</strong> ${new Date(data.created_at).toLocaleString()}</p>
          <p>Please check the admin panel for full order details.</p>
        `;
        break;
      
      case 'quote':
        subject = `New Quote Request from ${data.customer_name}`;
        emailContent = `
          <h2>New Quote Request</h2>
          <p><strong>Customer:</strong> ${data.customer_name}</p>
          <p><strong>Email:</strong> ${data.customer_email}</p>
          <p><strong>Company:</strong> ${data.company || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        `;
        break;
    }

    // For now, we'll just log the email content
    // In a real implementation, you would integrate with an email service like Resend
    console.log('Email to send:', { to: notificationEmail, subject, content: emailContent });

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
