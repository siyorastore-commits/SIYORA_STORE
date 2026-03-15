# Siyora — Fashion Brand Website

> Where Siya Meets Street. Full-stack Next.js 14 e-commerce with Razorpay + Supabase + Resend.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Custom CSS (no framework needed)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay (UPI, Cards, Netbanking, COD)
- **Email**: Resend (Beautiful order confirmation emails)
- **Deployment**: Vercel

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
# Fill in your keys (see below)
```

### 3. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL in your SQL Editor:

```sql
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
alter table orders enable row level security;
```

### 4. Set up Razorpay
1. Create account at [razorpay.com](https://razorpay.com)
2. Get your Key ID and Key Secret from Dashboard → API Keys
3. Add to `.env.local`

### 5. Set up Resend (email)
1. Create account at [resend.com](https://resend.com)
2. Add and verify your domain (e.g. `siyora.in`)
3. Get your API key and add to `.env.local`

### 6. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 7. Deploy to Vercel
```bash
npx vercel
# Add all env vars in Vercel Dashboard → Settings → Environment Variables
```

---

## Project Structure
```
siyora/
├── app/
│   ├── page.tsx              # Homepage
│   ├── shop/page.tsx         # Product listing
│   ├── product/[id]/page.tsx # Product detail
│   ├── checkout/page.tsx     # Checkout + Razorpay
│   ├── order-success/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── api/
│       ├── create-order/     # Creates Razorpay order
│       ├── verify-payment/   # Verifies + saves to DB + sends email
│       └── send-confirmation/# Standalone email trigger
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Marquee.tsx
│   ├── ProductCard.tsx
│   ├── ProductModal.tsx
│   ├── CartDrawer.tsx
│   └── Toast.tsx
├── context/
│   └── CartContext.tsx       # Global cart state
├── lib/
│   ├── data.ts               # Product data
│   ├── supabase.ts           # DB client + helpers
│   ├── razorpay.ts           # Razorpay client + helpers
│   └── resend.ts             # Email templates
└── types/
    └── index.ts              # TypeScript types
```

---

## Adding Products
Edit `lib/data.ts` — add to the `PRODUCTS` array with:
- Real images: replace `emoji` with an image path and update `ProductCard.tsx`
- More categories: add to `CATEGORIES` array

## Shipping (Shiprocket)
After each order is placed, log in to Shiprocket and manually create a shipment with the customer details stored in Supabase. You can also integrate the Shiprocket API later for automated label generation.

---

## Support
Made with ❤️ for Siyora. Questions? siyora.store@gmail.com
