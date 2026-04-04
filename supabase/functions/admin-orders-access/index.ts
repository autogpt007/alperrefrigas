import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    // Parse JSON body if provided (prefer body over query params)
    let body: any = {};
    if (req.method !== 'GET') {
      try {
        body = await req.json();
      } catch (_) {
        body = {};
      }
    }

    const action = body.action ?? url.searchParams.get('action') ?? 'list';
    const orderId = body.orderId ?? url.searchParams.get('orderId');
    const status = body.status ?? url.searchParams.get('status');
    const notes = body.notes ?? url.searchParams.get('notes');
    const trackingNumber = body.trackingNumber ?? url.searchParams.get('trackingNumber');

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Verify user has admin role from user_roles table (secure role storage)
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.error(`Non-admin order access attempt by user: ${user.id}`);
      return new Response(
        JSON.stringify({ error: 'Insufficient privileges. Admin access required.' }),
        { 
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize service role client for data access
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log(`Admin performing order action: ${action}`);

    if (action === 'list') {
      // Fetch all orders with items using service client
      const { data, error } = await serviceClient
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price,
            sku,
            packaging,
            epa_approved,
            configuration_json
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching orders:`, error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch orders' }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === 'update' && orderId && status) {
      // Update order status (and tracking number if provided) using service client
      const updatePayload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (trackingNumber) {
        updatePayload.tracking_number = trackingNumber;
      }

      const { data, error } = await serviceClient
        .from('orders')
        .update(updatePayload)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating order ${orderId}:`, error);
        return new Response(
          JSON.stringify({ error: 'Failed to update order' }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === 'add-notes' && orderId) {
      const { data, error } = await serviceClient
        .from('orders')
        .update({ 
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error(`Error adding notes to order ${orderId}:`, error);
        return new Response(
          JSON.stringify({ error: 'Failed to add notes' }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      return new Response(
        JSON.stringify(data),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (action === 'send-kyc' && orderId) {
      // Generate secure token
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const kycToken = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('');

      // Create KYC verification record
      const { error: kycError } = await serviceClient
        .from('kyc_verifications')
        .insert({
          order_id: orderId,
          token: kycToken,
          status: 'pending',
        });

      if (kycError) {
        console.error('Error creating KYC record:', kycError);
        return new Response(
          JSON.stringify({ error: 'Failed to create KYC verification' }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update order status to pending
      await serviceClient.from('orders').update({ status: 'pending', updated_at: new Date().toISOString() }).eq('id', orderId);

      // Fetch order details for email
      const { data: orderData } = await serviceClient
        .from('orders')
        .select('*, order_items(product_name, quantity, price)')
        .eq('id', orderId)
        .single();

      if (orderData) {
        // Determine the site URL for the KYC link
        const siteUrl = 'https://alperrefrigas.lovable.app';
        const kycLink = `${siteUrl}/kyc/${kycToken}`;

        // Send KYC email via send-transactional-email
        try {
          await supabaseClient.functions.invoke('send-transactional-email', {
            body: {
              templateName: 'kyc-request',
              recipientEmail: orderData.customer_email,
              idempotencyKey: `kyc-request-${orderId}`,
              templateData: {
                customerName: orderData.customer_name,
                orderNumber: orderData.order_number,
                totalAmount: orderData.total_amount,
                items: orderData.order_items || [],
                kycLink,
              },
            },
          });
        } catch (emailErr) {
          console.error('KYC email send error:', emailErr);
        }
      }

      console.log(`KYC request sent for order ${orderId}`);
      return new Response(
        JSON.stringify({ success: true, token: kycToken }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'delete' && orderId) {
      // First delete all order items
      const { error: itemsError } = await serviceClient
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) {
        console.error(`Error deleting order items for ${orderId}:`, itemsError);
        return new Response(
          JSON.stringify({ error: 'Failed to delete order items' }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Then delete the order
      const { error } = await serviceClient
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error(`Error deleting order ${orderId}:`, error);
        return new Response(
          JSON.stringify({ error: 'Failed to delete order' }),
          { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      console.log(`Order ${orderId} deleted successfully`);
      return new Response(
        JSON.stringify({ success: true, message: 'Order deleted successfully' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Admin orders access error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
