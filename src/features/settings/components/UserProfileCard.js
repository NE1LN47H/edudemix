"use client";

import { Save, LoaderCircle } from "lucide-react";

export default function UserProfileCard({
  profileForm,
  onChange,
  onSubmit,
  saving,
}) {
  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <h2>Your User Profile</h2>
        <p>Manage your account name and authentication password.</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="students-form-grid">
          <label className="students-form-field">
            <span>Your Name *</span>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                onChange((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </label>

          <div className="students-form-field">
            <span>Account Email & Role</span>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: "12px", color: "#444" }}>
                {profileForm.email}
              </span>
              <span className={`role-pill role-${profileForm.role}`}>
                {profileForm.role}
              </span>
            </div>
          </div>

          <label className="students-form-field students-form-field-full">
            <span>Change Password (Optional)</span>
            <input
              type="password"
              value={profileForm.newPassword}
              onChange={(e) =>
                onChange((p) => ({ ...p, newPassword: e.target.value }))
              }
              placeholder="Leave blank to keep current password"
              minLength={6}
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
            {saving ? "Updating profile..." : "Update profile"}
          </button>
        </div>
      </form>
    </section>
  );
}
