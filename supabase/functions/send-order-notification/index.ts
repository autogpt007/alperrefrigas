import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

interface OrderNotificationRequest {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    packaging?: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderNotificationRequest = await req.json();

    // Get notification email from settings
    const { data: settingsData } = await supabase
      .from('notification_settings')
      .select('setting_value')
      .eq('setting_key', 'notification_email')
      .single();

    const notificationEmail = settingsData?.setting_value || 'eddy3597@gmail.com';

    // Log order details
    console.log('Processing order notification:', {
      orderNumber: orderData.orderNumber,
      customer: orderData.customerName,
      total: orderData.totalAmount,
      itemCount: orderData.items.length
    });

    // Create detailed HTML email content
    const itemsHtml = orderData.items.map(item => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; text-align: left;">${item.product_name}</td>
        <td style="padding: 12px; text-align: center;">${item.packaging || 'Standard'}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669, #0891b2); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛒 New Order Received!</h1>
          <p style="color: #e6fffa; margin: 10px 0 0 0; font-size: 16px;">Order #${orderData.orderNumber}</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #059669;">
            <h2 style="color: #059669; margin: 0 0 15px 0;">Customer Information</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${orderData.customerName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${orderData.customerEmail}" style="color: #0891b2;">${orderData.customerEmail}</a></p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; margin: 0 0 15px 0;">Order Details</h2>
            <table style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #374151; color: white;">
                  <th style="padding: 15px; text-align: left;">Product</th>
                  <th style="padding: 15px; text-align: center;">Packaging</th>
                  <th style="padding: 15px; text-align: center;">Qty</th>
                  <th style="padding: 15px; text-align: right;">Unit Price</th>
                  <th style="padding: 15px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; text-align: right; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0;">Order Total: <span style="font-size: 24px; color: #059669;">$${orderData.totalAmount.toFixed(2)}</span></h3>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-top: 25px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">⚡ Action Required</h3>
            <p style="margin: 0; color: #92400e;">Please log into the admin panel to review the complete order details and begin processing this order.</p>
          </div>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">This is an automated notification from FrigidFlow. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    // Send email using Resend
    console.log('Sending order notification email to:', notificationEmail);
    
    const emailResponse = await resend.emails.send({
      from: "FrigidFlow Orders <orders@resend.dev>",
      to: [notificationEmail],
      subject: `🛒 New Order #${orderData.orderNumber} - $${orderData.totalAmount.toFixed(2)} from ${orderData.customerName}`,
      html: emailContent,
    });

    console.log('Order notification email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order notification sent successfully',
        orderNumber: orderData.orderNumber,
        emailId: emailResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);