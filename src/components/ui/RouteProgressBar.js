"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

function ProgressIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetLabel, setTargetLabel] = useState("");

  // Complete progress whenever the route finishes updating
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setTargetLabel("");
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal navigation links
  useEffect(() => {
    let t1, t2;

    function handleClick(e) {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const destination = new URL(link.href, window.location.href);
        const current = new URL(window.location.href);

        // Same origin and distinct destination
        if (
          destination.origin === current.origin &&
          (destination.pathname !== current.pathname || destination.search !== current.search)
        ) {
          clearTimeout(t1);
          clearTimeout(t2);

          // Get human-friendly label for destination
          const text = link.innerText?.trim() || "";
          setTargetLabel(text ? `Loading ${text}...` : "Loading page...");

          setLoading(true);
          setProgress(28);

          t1 = setTimeout(() => {
            setProgress(68);
          }, 200);

          t2 = setTimeout(() => {
            setProgress(88);
          }, 700);
        }
      } catch {
        // Ignore malformed URLs
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <>
      <div
        className="route-progress-container"
        style={{
          opacity: progress === 100 ? 0 : 1,
        }}
        aria-hidden="true"
      >
        <div
          className="route-progress-bar"
          style={{
            width: `${progress}%`,
            transition:
              progress === 100
                ? "width 160ms ease-out"
                : "width 350ms cubic-bezier(0.1, 0.5, 0.1, 1)",
          }}
        >
          <div className="route-progress-glow" />
        </div>
      </div>

      {loading && progress < 100 && (
        <div className="route-spinner-badge" role="status" aria-live="polite">
          <LoaderCircle size={15} className="route-spinner-icon" />
          <span>{targetLabel || "Loading page..."}</span>
        </div>
      )}
    </>
  );
}

export default function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressIndicator />
    </Suspense>
  );
}
