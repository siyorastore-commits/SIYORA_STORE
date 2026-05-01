import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import QuizWrapper from "@/components/QuizWrapper";

export const metadata: Metadata = {
  title: "Siyora — Where Siya Meets Street",
  description: "Handcrafted kurtas & co-ord sets that blend Indian elegance with modern street style.",
  keywords: "kurti, kurta, co-ord set, indian fashion, ethnic wear, siyora",
  openGraph: {
    title: "Siyora — Where Siya Meets Street",
    description: "Handcrafted kurtas & co-ord sets for the modern Indian woman.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CartProvider>
            <Marquee />
            <Navbar />
            <main style={{ paddingTop: "108px" }}>{children}</main>
            <Footer />
            <CartDrawer />
            <Toast />
            <QuizWrapper />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
