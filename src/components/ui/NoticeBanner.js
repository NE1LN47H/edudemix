"use client";

import { X } from "lucide-react";

export default function NoticeBanner({
  type = "success",
  message,
  onDismiss,
}) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`students-notice ${
        isSuccess ? "students-notice-success" : "students-notice-error"
      }`}
      role={isSuccess ? "status" : "alert"}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss message"
          onClick={onDismiss}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
