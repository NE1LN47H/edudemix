
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  LoaderCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    centreSlug: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect users who are already logged in.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data.authenticated && !cancelled) {
          router.replace("/dashboard");
        }
      } catch {
        // Keep the login page available if the check fails.
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <header className="login-header">
        <a href="/login" className="login-brand">
          <span className="login-brand-icon">
            <GraduationCap size={20} />
          </span>

          <span>edudemix</span>
        </a>

        <span className="login-header-label">
          COACHING MANAGEMENT
        </span>
      </header>

      <section className="login-content">
        <div className="login-heading">
          <span className="login-eyebrow">
            WELCOME BACK
          </span>

          <h1>Sign in to your workspace.</h1>

          <p>
            Manage your students, batches, attendance
            and fees from one place.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="centreSlug">
            Centre workspace
          </label>

          <input
            id="centreSlug"
            name="centreSlug"
            value={form.centreSlug}
            onChange={handleChange}
            placeholder="my-coaching-centre"
            autoComplete="organization"
            required
          />

          <label htmlFor="email">
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="username"
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={17}
                  className="login-spinner"
                />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p className="login-security-note">
            Your workspace is protected by secure
            authentication.
          </p>
        </form>
      </section>

      <footer className="login-footer">
        <span>© 2026 edudemix</span>

        <span>
          Built for better learning management.
        </span>
      </footer>
    </main>
  );
}
