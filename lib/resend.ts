import { Resend } from "resend";
import { CartItem } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderConfirmationEmail({
  to,
  customerName,
  orderId,
  items,
  totalAmount,
  shippingAddress,
}: {
  to: string;
  customerName: string;
  orderId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}) {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F0DDD5">
          ${item.emoji} ${item.name}
          ${item.selectedSize ? `<span style="color:#7A5555;font-size:12px"> (${item.selectedSize})</span>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #F0DDD5;text-align:center">${item.qty}</td>
        <td style="padding:12px 0;border-bottom:1px solid #F0DDD5;text-align:right;font-weight:600">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#FEFAF7;font-family:'Georgia',serif">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:24px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 8px 40px rgba(233,30,140,0.08)">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#E91E8C,#FF6B5B);padding:48px 40px;text-align:center">
      <h1 style="color:white;font-size:42px;margin:0;font-weight:700;letter-spacing:-1px">Siyora</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;letter-spacing:3px;text-transform:uppercase">Where Siya Meets Street</p>
    </div>

    <!-- Body -->
    <div style="padding:48px 40px">
      <div style="text-align:center;margin-bottom:36px">
        <div style="font-size:56px;margin-bottom:16px">🎉</div>
        <h2 style="font-size:32px;color:#180A08;margin:0 0 8px;font-weight:700">Order Confirmed!</h2>
        <p style="color:#7A5555;font-size:15px;margin:0;line-height:1.7">
          Hey ${customerName}, your order is confirmed and we're getting it ready!
        </p>
      </div>

      <!-- Order ID -->
      <div style="background:#FFE8F0;border-radius:12px;padding:20px;text-align:center;margin-bottom:32px">
        <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7A5555;margin:0 0 6px">Order ID</p>
        <p style="font-family:'Georgia',serif;font-size:24px;font-weight:700;color:#E91E8C;margin:0">#${orderId}</p>
      </div>

      <!-- Items -->
      <h3 style="font-size:18px;color:#180A08;margin:0 0 16px;font-weight:700">Your Items</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="border-bottom:2px solid #180A08">
            <th style="text-align:left;padding-bottom:10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A5555">Item</th>
            <th style="text-align:center;padding-bottom:10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A5555">Qty</th>
            <th style="text-align:right;padding-bottom:10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A5555">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Total -->
      <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #180A08;margin-bottom:32px">
        <span style="font-size:16px;font-weight:600;color:#180A08">Total Paid</span>
        <span style="font-family:'Georgia',serif;font-size:28px;font-weight:700;color:#180A08">₹${totalAmount.toLocaleString()}</span>
      </div>

      <!-- Shipping -->
      <h3 style="font-size:18px;color:#180A08;margin:0 0 12px;font-weight:700">Shipping To</h3>
      <div style="background:#FEFAF7;border-radius:12px;padding:20px;border:1px solid #F0DDD5;margin-bottom:32px">
        <p style="margin:0;color:#7A5555;font-size:14px;line-height:1.8">
          ${shippingAddress.address}<br>
          ${shippingAddress.city}, ${shippingAddress.state} — ${shippingAddress.pincode}
        </p>
      </div>

      <!-- Timeline -->
      <h3 style="font-size:18px;color:#180A08;margin:0 0 16px;font-weight:700">What's Next?</h3>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:40px">
        ${[
          ["✅", "Order Confirmed", "Right now"],
          ["📦", "Packed & Dispatched", "Within 24–48 hours"],
          ["🚀", "Shipped via Shiprocket", "You'll get a tracking link"],
          ["🏠", "Delivered to You", "6–7 business days"],
        ]
          .map(
            ([icon, title, time]) => `
          <div style="display:flex;align-items:center;gap:14px;padding:14px;background:white;border-radius:10px;border:1px solid #F0DDD5">
            <span style="font-size:22px">${icon}</span>
            <div>
              <p style="margin:0;font-weight:600;font-size:14px;color:#180A08">${title}</p>
              <p style="margin:0;font-size:12px;color:#7A5555">${time}</p>
            </div>
          </div>`
          )
          .join("")}
      </div>

      <!-- CTA -->
      <div style="text-align:center">
        <p style="color:#7A5555;font-size:14px;margin-bottom:16px">Questions? Reach us anytime:</p>
        <a href="https://wa.me/919876543210" style="background:#E91E8C;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:12px;letter-spacing:2px;font-weight:600;text-transform:uppercase">WhatsApp Us</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#180A08;padding:32px 40px;text-align:center">
      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0 0 8px">Follow us @siyora.in</p>
      <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0">© 2025 Siyora. Made with ❤️ in India.</p>
    </div>
  </div>
</body>
</html>`;

  const notificationHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FEFAF7;font-family:'Georgia',serif">
  <div style="max-width:600px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#E91E8C,#FF6B5B);padding:32px 40px;text-align:center">
      <h1 style="color:white;font-size:28px;margin:0;font-weight:700">New Order Received!</h1>
    </div>
    <div style="padding:32px 40px">
      <div style="background:#FFE8F0;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px">
        <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7A5555;margin:0 0 4px">Order ID</p>
        <p style="font-size:22px;font-weight:700;color:#E91E8C;margin:0">#${orderId}</p>
      </div>
      <p style="color:#180A08;font-size:15px;margin:0 0 8px"><strong>Customer:</strong> ${customerName}</p>
      <p style="color:#180A08;font-size:15px;margin:0 0 8px"><strong>Email:</strong> ${to}</p>
      <p style="color:#180A08;font-size:15px;margin:0 0 24px"><strong>Total:</strong> ₹${totalAmount.toLocaleString()}</p>
      <h3 style="font-size:16px;color:#180A08;margin:0 0 12px">Items Ordered</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr style="border-bottom:2px solid #180A08">
            <th style="text-align:left;padding-bottom:8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A5555">Item</th>
            <th style="text-align:center;padding-bottom:8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A5555">Qty</th>
            <th style="text-align:right;padding-bottom:8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A5555">Price</th>
          </tr>
        </thead>
        <tbody>${items
          .map(
            (item) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F0DDD5">${item.emoji} ${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ""}</td>
            <td style="padding:10px 0;border-bottom:1px solid #F0DDD5;text-align:center">${item.qty}</td>
            <td style="padding:10px 0;border-bottom:1px solid #F0DDD5;text-align:right;font-weight:600">₹${(item.price * item.qty).toLocaleString()}</td>
          </tr>`
          )
          .join("")}</tbody>
      </table>
      <h3 style="font-size:16px;color:#180A08;margin:0 0 8px">Ship To</h3>
      <div style="background:#FEFAF7;border-radius:10px;padding:16px;border:1px solid #F0DDD5">
        <p style="margin:0;color:#7A5555;font-size:14px;line-height:1.8">
          ${shippingAddress.address}<br>
          ${shippingAddress.city}, ${shippingAddress.state} — ${shippingAddress.pincode}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;

  await Promise.all([
    resend.emails.send({
      from: "Siyora Orders <onboarding@resend.dev>",
      to,
      subject: `✨ Order Confirmed! #${orderId} — Siyora`,
      html,
    }),
    resend.emails.send({
      from: "Siyora Orders <onboarding@resend.dev>",
      to: "siyora.store@gmail.com",
      subject: `🛍️ New Order #${orderId} — ${customerName} (₹${totalAmount.toLocaleString()})`,
      html: notificationHtml,
    }),
  ]);
}
