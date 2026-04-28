import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={poppins.className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#f5f0eb",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
}
