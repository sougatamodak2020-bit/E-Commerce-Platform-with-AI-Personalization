import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createSupabaseServer() {
  const cookieStore = await cookies(); // Next.js 15 requires await
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch {} },
        remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch {} },
      },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from Authorization header (sent by frontend)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    let userId: string | null = null;

    if (token) {
      // Verify token with admin client
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && user) userId = user.id;
      console.log('[Orders] Token auth user:', userId);
    }

    // Fallback: try cookie-based session
    if (!userId) {
      const supabase = await createSupabaseServer();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
      console.log('[Orders] Cookie auth user:', userId);
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - Please login to place an order' }, { status: 401 });
    }

    const body = await request.json();
    console.log('[Orders] Body:', JSON.stringify(body).substring(0, 200));

    const { items, shippingAddress, billingAddress, paymentMethod = 'card', shipping = 0, discount = 0, coupon_code, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: any) => {
      const price = item.price || item.unit_price || item.product?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const total = Math.round((subtotal + (shipping || 0) + tax - (discount || 0)) * 100) / 100;

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: paymentMethod,
        subtotal,
        shipping: shipping || 0,
        tax,
        discount: discount || 0,
        total,
        shipping_address: shippingAddress || {},
        billing_address: billingAddress || shippingAddress || {},
        coupon_code: coupon_code || null,
        notes: notes || null,
        currency: 'INR',
      })
      .select()
      .single();

    if (orderError) {
      console.error('[Orders] Insert error:', JSON.stringify(orderError));
      return NextResponse.json({ error: orderError.message, details: orderError }, { status: 500 });
    }

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id || item.product?.id || item.id || null,
      product_name: item.product?.name || item.name || item.product_name || 'Unknown',
      product_image: item.product?.images?.[0] || item.image || item.product_image || null,
      sku: item.product?.sku || item.sku || null,
      quantity: item.quantity,
      unit_price: item.price || item.unit_price || item.product?.price || 0,
      total_price: (item.price || item.unit_price || item.product?.price || 0) * item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);

    if (itemsError) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    console.log('[Orders] Success! Order:', order.id);
    return NextResponse.json({ data: order, success: true }, { status: 201 });
  } catch (error: any) {
    console.error('[Orders] Unexpected error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
