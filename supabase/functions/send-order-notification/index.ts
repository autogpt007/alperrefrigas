
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Here you would integrate with your preferred email service
    // For now, we'll just log the order details and return success
    console.log('New order notification:', {
      orderNumber: orderData.orderNumber,
      customer: orderData.customerName,
      total: orderData.totalAmount,
      itemCount: orderData.items.length
    });

    // You can integrate with services like:
    // - Resend
    // - SendGrid
    // - Nodemailer
    // - etc.

    // Example email content
    const emailContent = `
      New Order Received: ${orderData.orderNumber}
      
      Customer: ${orderData.customerName}
      Email: ${orderData.customerEmail}
      Total: $${orderData.totalAmount}
      
      Items:
      ${orderData.items.map(item => 
        `- ${item.product_name} (${item.packaging}) x${item.quantity} @ $${item.price}`
      ).join('\n')}
      
      Please review and process this order in the admin dashboard.
    `;

    console.log('Email content:', emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order notification processed',
        orderNumber: orderData.orderNumber 
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
