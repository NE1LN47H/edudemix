"use client";

import { useState } from "react";
import { Building2, Save, LoaderCircle, Copy, Check, Hash, Mail, Phone } from "lucide-react";

export default function CentreProfileCard({
  centreForm,
  onChange,
  onSubmit,
  saving,
}) {
  const [copied, setCopied] = useState(false);

  function handleCopySlug() {
    if (!centreForm.slug) return;
    navigator.clipboard.writeText(centreForm.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <div className="settings-header-left">
          <div className="settings-card-icon">
            <Building2 size={20} />
          </div>
          <div>
            <h2>Coaching Centre Profile</h2>
            <p>Configure the identity and contact details for your institute workspace.</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="students-form-grid">
          <label className="students-form-field">
            <span>Centre Workspace Name *</span>
            <input
              type="text"
              value={centreForm.name}
              onChange={(e) =>
                onChange((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. Apex Science Academy"
              required
            />
          </label>

          <div className="students-form-field">
            <span>Workspace Identifier (Slug)</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <div className="settings-slug-badge">
                <Hash size={14} style={{ color: "#0284c7" }} />
                <span>{centreForm.slug || "loading..."}</span>
              </div>
              <button
                type="button"
                className="settings-copy-btn"
                onClick={handleCopySlug}
                title="Copy workspace slug"
              >
                {copied ? (
                  <>
                    <Check size={13} style={{ color: "#16a34a" }} />
                    <span style={{ color: "#16a34a" }}>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Slug</span>
                  </>
                )}
              </button>
            </div>
            <small style={{ fontSize: "11px", color: "#64748b", marginTop: 4 }}>
              Used by tutors and staff when signing in to this institute.
            </small>
          </div>

          <label className="students-form-field">
            <span>
              <Mail size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              Official Email
            </span>
            <input
              type="email"
              value={centreForm.email}
              onChange={(e) =>
                onChange((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="contact@centre.com"
            />
          </label>

          <label className="students-form-field">
            <span>
              <Phone size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              Phone / Helpline
            </span>
            <input
              type="text"
              value={centreForm.phone}
              onChange={(e) =>
                onChange((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+91 9876543210"
            />
          </label>
        </div>

        <div className="students-modal-actions" style={{ marginTop: 24 }}>
          <button
            type="submit"
            className="students-primary-button"
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle className="students-spinner" size={16} />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving Changes..." : "Save Workspace Profile"}
          </button>
        </div>
      </form>
    </section>
  );
}
