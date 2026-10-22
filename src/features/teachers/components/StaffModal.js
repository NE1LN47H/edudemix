"use client";

import { LoaderCircle, X } from "lucide-react";

export default function StaffModal({
  isOpen,
  form,
  saving,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="students-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="students-modal" style={{ maxWidth: 520 }}>
        <div className="students-modal-header">
          <div>
            <div className="eyebrow">NEW TEAM MEMBER</div>
            <h2>Add staff member</h2>
            <p>Grant access to your centre workspace.</p>
          </div>

          <button
            type="button"
            className="students-modal-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label className="students-form-field">
              <span>Full name *</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </label>

            <label className="students-form-field">
              <span>Email address *</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="teacher@example.com"
                required
              />
            </label>

            <label className="students-form-field">
              <span>Temporary Password *</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </label>

            <label className="students-form-field">
              <span>Role *</span>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
              >
                <option value="teacher">Teacher (Attendance & Students)</option>
                <option value="accountant">Accountant (Fees & Invoicing)</option>
                <option value="admin">Administrator (Full Access)</option>
              </select>
            </label>
          </div>

          <div className="students-modal-actions">
            <button
              type="button"
              className="students-secondary-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="students-primary-button"
              disabled={saving}
            >
              {saving ? (
                <LoaderCircle className="students-spinner" size={16} />
              ) : null}
              {saving ? "Adding member..." : "Add member"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
