import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

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
  noStore();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getAllOrders() {
  noStore();
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
  noStore();
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

// ─── USER HELPERS ─────────────────────────────────────────────────────────────

export async function getUserByPhone(phone: string) {
  const { data } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();
  return data;
}

export async function createUser(phone: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert([{ phone, siyora_stars: 50 }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  // Record signup bonus transaction
  await supabaseAdmin.from("star_transactions").insert([{
    user_id: data.id,
    delta: 50,
    reason: "signup_bonus",
    order_id: null,
  }]);
  return data;
}

export async function getUserById(userId: string) {
  const { data } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

export async function awardStars(userId: string, delta: number, reason: string, orderId?: string) {
  // Increment stars balance
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("siyora_stars")
    .eq("id", userId)
    .single();
  if (!user) return;

  await supabaseAdmin
    .from("users")
    .update({ siyora_stars: Math.max(0, (user.siyora_stars || 0) + delta) })
    .eq("id", userId);

  await supabaseAdmin.from("star_transactions").insert([{
    user_id: userId,
    delta,
    reason,
    order_id: orderId || null,
  }]);
}

export async function getStarTransactions(userId: string) {
  noStore();
  const { data } = await supabaseAdmin
    .from("star_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getUserOrders(userId: string) {
  noStore();
  const { data } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getAllUsers() {
  noStore();
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getUserStarSummary() {
  noStore();
  const { data } = await supabaseAdmin
    .from("star_transactions")
    .select("delta, reason");
  if (!data) return { totalAwarded: 0, totalRedeemed: 0 };
  const totalAwarded = data.filter(t => t.delta > 0).reduce((s, t) => s + t.delta, 0);
  const totalRedeemed = data.filter(t => t.delta < 0).reduce((s, t) => s + Math.abs(t.delta), 0);
  return { totalAwarded, totalRedeemed };
}

export async function getUserWithOrders(userId: string) {
  noStore();
  const [userRes, ordersRes, txRes, quizRes] = await Promise.all([
    supabaseAdmin.from("users").select("*").eq("id", userId).single(),
    supabaseAdmin.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabaseAdmin.from("star_transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabaseAdmin.from("quiz_responses").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
  ]);
  return {
    user: userRes.data,
    orders: ordersRes.data || [],
    transactions: txRes.data || [],
    quiz: quizRes.data?.[0] || null,
  };
}

export async function updateUserProfile(userId: string, name: string, email?: string) {
  const patch: Record<string, string> = { name };
  if (email) patch.email = email;
  const { data, error } = await supabaseAdmin
    .from("users")
    .update(patch)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function linkOrdersToUser(phone: string, userId: string) {
  // Try both "+91XXXXXXXXXX" and bare "XXXXXXXXXX" to handle checkout stripping the prefix
  const withPrefix = phone.startsWith("+91") ? phone : `+91${phone}`;
  const withoutPrefix = phone.startsWith("+91") ? phone.slice(3) : phone;

  for (const p of [withPrefix, withoutPrefix]) {
    await supabaseAdmin
      .from("orders")
      .update({ user_id: userId })
      .eq("customer_phone", p)
      .is("user_id", null);
  }
}

// ─── OTP SESSION HELPERS ───────────────────────────────────────────────────────

export async function saveOTPSession(phone: string, otpHash: string, expiresAt: string) {
  await supabaseAdmin
    .from("otp_sessions")
    .upsert({ phone, otp_hash: otpHash, expires_at: expiresAt });
}

export async function getOTPSession(phone: string) {
  const { data } = await supabaseAdmin
    .from("otp_sessions")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();
  return data;
}

export async function deleteOTPSession(phone: string) {
  await supabaseAdmin.from("otp_sessions").delete().eq("phone", phone);
}

// ─── QUIZ HELPERS ──────────────────────────────────────────────────────────────

export async function saveQuizResponse(payload: {
  user_id?: string;
  phone: string;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string | null;
  q5: string | null;
  completed: boolean;
}) {
  const { error } = await supabaseAdmin.from("quiz_responses").insert([payload]);
  if (error) throw new Error(error.message);
}

export async function getSiteContent(key: string) {
  noStore();
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
  order_status text default 'confirmed',
  user_id uuid references users(id)
);

-- Enable Row Level Security
alter table orders enable row level security;
create policy "Allow server inserts" on orders for insert with check (true);

-- ─── NEW TABLES FOR AUTH + STARS ───────────────────────────────────────────

-- Add user_id to existing orders table (if orders already exists):
alter table orders add column if not exists user_id uuid references users(id);

create table users (
  id uuid default gen_random_uuid() primary key,
  phone text unique not null,
  name text,
  email text,
  siyora_stars integer default 50 not null,
  created_at timestamp with time zone default now()
);
alter table users enable row level security;
create policy "Server full access on users" on users using (true) with check (true);

create table star_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) not null,
  delta integer not null,
  reason text not null,
  order_id uuid references orders(id),
  created_at timestamp with time zone default now()
);
alter table star_transactions enable row level security;
create policy "Server full access on star_transactions" on star_transactions using (true) with check (true);

create table otp_sessions (
  phone text primary key,
  otp_hash text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);
alter table otp_sessions enable row level security;
create policy "Server full access on otp_sessions" on otp_sessions using (true) with check (true);

create table quiz_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  phone text not null,
  q1 text,
  q2 text,
  q3 text,
  q4 text,
  q5 text,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
alter table quiz_responses enable row level security;
create policy "Server full access on quiz_responses" on quiz_responses using (true) with check (true);
─────────────────────────────────────────────────────────────────────────────
*/
