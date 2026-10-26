"use client";

import { LoaderCircle } from "lucide-react";

/**
 * Modern centered page loading spinner for route transitions.
 */
export default function PageLoadingSpinner({
  label = "Loading workspace...",
  sublabel = "Fetching latest records",
  minHeight = "65vh",
  showCard = true,
}) {
  return (
    <div
      className="page-loading-spinner-container"
      style={{ minHeight }}
      role="status"
      aria-live="polite"
    >
      <div className={`page-loading-spinner-box ${showCard ? "with-card" : ""}`.trim()}>
        <div className="page-spinner-animation">
          <LoaderCircle size={38} className="page-spinner-icon" strokeWidth={2.2} />
          <div className="page-spinner-pulse" />
        </div>

        <div className="page-spinner-content">
          <h3 className="page-spinner-title">{label}</h3>
          {sublabel && <p className="page-spinner-subtitle">{sublabel}</p>}
        </div>
      </div>
    </div>
  );
}
