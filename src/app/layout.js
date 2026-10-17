import "./globals.css";

export const metadata = {
  title: "edudemix — Coaching Centre Management",
  description:
    "Manage students, batches, attendance and fees with edudemix.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}