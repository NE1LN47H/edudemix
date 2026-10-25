import "./globals.css";

export const metadata = {
  title: "edudemix — Coaching Centre Management",
  description:
    "Manage students, batches, attendance and fees with edudemix.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}