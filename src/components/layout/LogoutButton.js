
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="logout-button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Sign out"
    >
      <LogOut size={16} />
      <span className="logout-button-text">
        {loading ? "Signing out..." : "Sign out"}
      </span>
    </button>
  );
}
