import { NextResponse } from "next/server";
import { checkAdminRequest } from "@/lib/admin-auth";
import { PRODUCTS } from "@/lib/data";
import { getProductOverrides, upsertProductOverride } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const overrides = await getProductOverrides();
  type Override = {
    product_id: string;
    out_of_stock?: boolean;
    hidden?: boolean;
    price_override?: number | null;
    tag_override?: string | null;
    quantity?: number | null;
  };
  const overrideMap = Object.fromEntries(
    (overrides as Override[]).map((o) => [o.product_id, o])
  );

  const products = PRODUCTS.map((p) => {
    const override = overrideMap[String(p.id)] || {};
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      category: p.category,
      tag: p.tag,
      media: p.media[0]?.src || "",
      outOfStock: override.out_of_stock != null ? override.out_of_stock : (p.outOfStock ?? false),
      hidden: override.hidden != null ? override.hidden : false,
      priceOverride: override.price_override != null ? override.price_override : null,
      tagOverride: override.tag_override != null ? override.tag_override : null,
      quantity: override.quantity ?? null,
    };
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!checkAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, ...patch } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const result = await upsertProductOverride(String(productId), patch);
  return NextResponse.json({ success: true, data: result });
}
