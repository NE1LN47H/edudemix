"use client";

import { LoaderCircle, X, GraduationCap, Shield, Calculator } from "lucide-react";

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
      <section className="students-modal" style={{ maxWidth: 540 }}>
        <div className="students-modal-header">
          <div>
            <div className="eyebrow">NEW TEAM MEMBER</div>
            <h2>Add staff member</h2>
            <p>Grant faculty or administrative access to your centre workspace.</p>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <label className="students-form-field">
              <span>Full Name *</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Dr. Rajesh Sharma"
                required
              />
            </label>

            <label className="students-form-field">
              <span>Email Address *</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="faculty@centre.com"
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
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
              <small style={{ fontSize: "11px", color: "#64748b" }}>
                Staff member can change this anytime from their Account Settings.
              </small>
            </label>

            <div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                Workspace Role & Privileges *
              </span>

              <div className="role-select-grid">
                <div
                  className={`role-select-card ${
                    form.role === "teacher" ? "selected" : ""
                  }`}
                  onClick={() =>
                    onChange({ target: { name: "role", value: "teacher" } })
                  }
                >
                  <div className="role-select-title">
                    <GraduationCap size={15} style={{ color: "#166534" }} />
                    Teacher
                  </div>
                  <div className="role-select-desc">
                    Admissions, cohort rosters, and attendance roll-call.
                  </div>
                </div>

                <div
                  className={`role-select-card ${
                    form.role === "accountant" ? "selected" : ""
                  }`}
                  onClick={() =>
                    onChange({ target: { name: "role", value: "accountant" } })
                  }
                >
                  <div className="role-select-title">
                    <Calculator size={15} style={{ color: "#92400e" }} />
                    Accountant
                  </div>
                  <div className="role-select-desc">
                    Fee invoicing, payment collection, and ledger receipts.
                  </div>
                </div>

                <div
                  className={`role-select-card ${
                    form.role === "admin" ? "selected" : ""
                  }`}
                  onClick={() =>
                    onChange({ target: { name: "role", value: "admin" } })
                  }
                >
                  <div className="role-select-title">
                    <Shield size={15} style={{ color: "#1e40af" }} />
                    Admin
                  </div>
                  <div className="role-select-desc">
                    Full management access across all modules.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="students-modal-actions" style={{ marginTop: 24 }}>
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
              {saving ? "Adding member..." : "Add staff member"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
