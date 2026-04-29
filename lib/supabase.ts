import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client (browser-safe)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key — bypasses RLS, server-side API routes only
const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── DB HELPERS ──────────────────────────────────────────────────────────────

/** Called the moment the user clicks Pay — before Razorpay modal opens. */
export async function createPendingOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: object;
  items: object[];
  total_amount: number;
  razorpay_order_id: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([{
      ...orderData,
      razorpay_payment_id: null,
      payment_status: "pending",
      order_status: "initiated",
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Called after payment result — updates the existing pending record. */
export async function updateOrderAfterPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string | null,
  paymentStatus: string,
  orderStatus: string,
) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({
      razorpay_payment_id: razorpayPaymentId,
      payment_status: paymentStatus,
      order_status: orderStatus,
    })
    .eq("razorpay_order_id", razorpayOrderId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Legacy insert — kept for compatibility. */
export async function saveOrder(orderData: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: object;
  items: object[];
  total_amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  payment_status: string;
  order_status: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: string,
  paymentStatus?: string
) {
  const update: Record<string, string> = { order_status: orderStatus };
  if (paymentStatus) update.payment_status = paymentStatus;
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getProductOverrides() {
  const { data, error } = await supabaseAdmin
    .from("product_overrides")
    .select("*");

  if (error) return [];
  return data || [];
}

export async function upsertProductOverride(
  productId: string,
  patch: {
    out_of_stock?: boolean;
    hidden?: boolean;
    price_override?: number | null;
    tag_override?: string | null;
    quantity?: number | null;
  }
) {
  const updates: typeof patch = { ...patch };
  // Auto out-of-stock when quantity hits 0
  if (typeof updates.quantity === "number" && updates.quantity <= 0) {
    updates.quantity = 0;
    updates.out_of_stock = true;
  }

  const { data, error } = await supabaseAdmin
    .from("product_overrides")
    .upsert({ product_id: productId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/** Subtract ordered quantities after payment; auto-marks out-of-stock at 0. */
export async function decrementProductQuantities(
  items: Array<{ productId: string; qty: number }>
) {
  for (const { productId, qty } of items) {
    const { data } = await supabaseAdmin
      .from("product_overrides")
      .select("quantity, out_of_stock")
      .eq("product_id", productId)
      .maybeSingle();

    // Skip products with no quantity set (untracked)
    if (!data || data.quantity == null) continue;

    const newQty = Math.max(0, data.quantity - qty);
    await supabaseAdmin.from("product_overrides").upsert({
      product_id: productId,
      quantity: newQty,
      out_of_stock: newQty === 0 ? true : data.out_of_stock,
      updated_at: new Date().toISOString(),
    });
  }
}

export async function getSiteContent(key: string) {
  const { data } = await supabaseAdmin
    .from("site_content")
    .select("value")
    .eq("key", key)
    .single();

  return data?.value ?? null;
}

export async function setSiteContent(key: string, value: unknown) {
  const { error } = await supabaseAdmin
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) throw new Error(error.message);
}

/*
─── SUPABASE SQL SCHEMA ─────────────────────────────────────────────────────
Run this in your Supabase SQL Editor:

-- Add quantity column to product_overrides (run once):
alter table product_overrides add column if not exists quantity integer default null;

create table orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  total_amount integer not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text default 'pending',
  order_status text default 'confirmed'
);

-- Enable Row Level Security
alter table orders enable row level security;

-- Allow insert from API (server-side only via service_role key)
create policy "Allow server inserts" on orders
  for insert with check (true);
─────────────────────────────────────────────────────────────────────────────
*/
