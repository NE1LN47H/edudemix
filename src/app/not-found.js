import Link from "next/link";
import { GraduationCap, ArrowLeft, LayoutDashboard, Users, BookOpen, CreditCard, Search } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found | edudemix",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "#ffffff",
      color: "#0f172a",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Top Brand Bar */}
      <header style={{
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f1f5f9"
      }}>
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          color: "#0f172a"
        }}>
          <div style={{
            width: "32px",
            height: "32px",
            background: "#0f172a",
            borderRadius: "8px",
            display: "grid",
            placeItems: "center",
            color: "#ffffff"
          }}>
            <GraduationCap size={18} />
          </div>
          <span style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "-0.5px" }}>edudemix</span>
        </Link>

        <Link href="/dashboard" style={{
          fontSize: "13px",
          color: "#64748b",
          textDecoration: "none",
          fontWeight: "500",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <LayoutDashboard size={15} />
          <span>Go to workspace</span>
        </Link>
      </header>

      {/* Main 404 Hero */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "9999px",
          background: "#f1f5f9",
          border: "1px solid #e2e8f0",
          fontSize: "12px",
          fontWeight: "600",
          color: "#475569",
          marginBottom: "20px",
          letterSpacing: "0.04em"
        }}>
          <span>ERROR 404</span>
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 6vw, 48px)",
          fontWeight: "800",
          lineHeight: "1.1",
          letterSpacing: "-1.5px",
          color: "#0f172a",
          margin: "0 0 16px"
        }}>
          Page not found
        </h1>

        <p style={{
          fontSize: "15px",
          color: "#64748b",
          lineHeight: "1.6",
          margin: "0 0 32px",
          maxWidth: "460px"
        }}>
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved, renamed, or no longer exists.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "40px"
        }}>
          <Link href="/dashboard" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            textDecoration: "none",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
            transition: "background 150ms ease"
          }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <Link href="/" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            background: "#ffffff",
            color: "#334155",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "500",
            textDecoration: "none"
          }}>
            Home Page
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: "18px 32px",
        borderTop: "1px solid #f1f5f9",
        fontSize: "12px",
        color: "#94a3b8",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px"
      }}>
        <span>edudemix &copy; 2026. All rights reserved.</span>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/login" style={{ color: "#64748b", textDecoration: "none" }}>Sign In</Link>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Support</Link>
        </div>
      </footer>
    </div>
  );
}
