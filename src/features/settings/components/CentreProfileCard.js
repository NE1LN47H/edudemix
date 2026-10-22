"use client";

import { Save, LoaderCircle } from "lucide-react";

export default function CentreProfileCard({
  centreForm,
  onChange,
  onSubmit,
  saving,
}) {
  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <h2>Coaching Centre Profile</h2>
        <p>This information is visible across your institute workspace.</p>
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
              required
            />
          </label>

          <div className="students-form-field">
            <span>Workspace Identifier (Slug)</span>
            <div className="settings-slug-badge">{centreForm.slug}</div>
            <small style={{ fontSize: "11px", color: "#888" }}>
              Used by staff to sign in to this workspace.
            </small>
          </div>

          <label className="students-form-field">
            <span>Contact Email</span>
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
            <span>Contact Phone</span>
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

        <div className="students-modal-actions" style={{ marginTop: 20 }}>
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
            {saving ? "Saving..." : "Save centre details"}
          </button>
        </div>
      </form>
    </section>
  );
}
