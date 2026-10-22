"use client";

import { UserCircle, Save, LoaderCircle, KeyRound, Shield, Crown, GraduationCap, Calculator } from "lucide-react";

export default function UserProfileCard({
  profileForm,
  onChange,
  onSubmit,
  saving,
}) {
  const initials = profileForm.name
    ? profileForm.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  function getRoleIcon(role) {
    switch (role) {
      case "owner":
        return <Crown size={12} />;
      case "admin":
        return <Shield size={12} />;
      case "accountant":
        return <Calculator size={12} />;
      case "teacher":
      default:
        return <GraduationCap size={12} />;
    }
  }

  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <div className="settings-header-left">
          <div className="settings-card-icon">
            <UserCircle size={20} />
          </div>
          <div>
            <h2>My Account Profile</h2>
            <p>Update personal credentials and security passphrase for your session.</p>
          </div>
        </div>
      </div>

      <div className="user-profile-badge">
        <div className="user-profile-avatar">{initials}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
            {profileForm.name || "User"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{profileForm.email}</span>
            <span className={`staff-role-pill role-${profileForm.role}`} style={{ textTransform: "capitalize", display: "inline-flex", alignItems: "center", gap: 4 }}>
              {getRoleIcon(profileForm.role)}
              {profileForm.role}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="students-form-grid">
          <label className="students-form-field">
            <span>Full Name *</span>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                onChange((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. Dr. Rajesh Sharma"
              required
            />
          </label>

          <label className="students-form-field">
            <span>Login Email (Read-only)</span>
            <input
              type="email"
              value={profileForm.email}
              disabled
              style={{ background: "#f8fafc", cursor: "not-allowed", color: "#64748b" }}
            />
          </label>

          <label className="students-form-field students-form-field-full">
            <span>
              <KeyRound size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              Change Password (Leave blank to keep current)
            </span>
            <input
              type="password"
              value={profileForm.newPassword}
              onChange={(e) =>
                onChange((p) => ({ ...p, newPassword: e.target.value }))
              }
              placeholder="Minimum 6 characters"
              minLength={6}
            />
            <small style={{ fontSize: "11px", color: "#64748b", marginTop: 4 }}>
              Protected by bcrypt encryption. Changing your password updates your credentials immediately.
            </small>
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
            {saving ? "Updating..." : "Update Account Credentials"}
          </button>
        </div>
      </form>
    </section>
  );
}
