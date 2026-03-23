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

/*
─── SUPABASE SQL SCHEMA ─────────────────────────────────────────────────────
Run this in your Supabase SQL Editor:

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
