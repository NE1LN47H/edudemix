"use client";

import { useEffect, useState } from "react";
import {
  Settings2,
  Building,
  User,
  LoaderCircle,
  Save,
  X,
  Lock,
} from "lucide-react";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [centreForm, setCentreForm] = useState({
    name: "",
    email: "",
    phone: "",
    slug: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    role: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingCentre, setSavingCentre] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/settings", { cache: "no-store" });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load settings");
        }

        const { centre, user } = result.data;
        setCentreForm({
          name: centre.name || "",
          email: centre.email || "",
          phone: centre.phone || "",
          slug: centre.slug || "",
        });

        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          newPassword: "",
        });
      } catch (err) {
        setError(err.message || "Unable to load settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  async function handleSaveCentre(e) {
    e.preventDefault();
    setSavingCentre(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "centre",
          name: centreForm.name,
          email: centreForm.email,
          phone: centreForm.phone,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update centre details");
      }

      setSuccess("Centre workspace details updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingCentre(false);
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "profile",
          name: profileForm.name,
          newPassword: profileForm.newPassword || undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile");
      }

      setSuccess("Your account profile was updated successfully.");
      setProfileForm((p) => ({ ...p, newPassword: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading) {
    return (
      <div className="students-state">
        <LoaderCircle className="students-spinner" size={28} />
        <p>Loading workspace configuration...</p>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">SETTINGS & PREFERENCES</div>
          <h1>Workspace Settings</h1>
          <p className="page-description">
            Configure coaching centre identity, contact details, and account security.
          </p>
        </div>
      </section>

      {success && (
        <div className="students-notice students-notice-success" role="status">
          {success}
          <button type="button" onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="students-notice students-notice-error" role="alert">
          {error}
          <button type="button" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Centre Profile Card */}
      <section className="settings-card">
        <div className="settings-card-header">
          <h2>Coaching Centre Profile</h2>
          <p>This information is visible across your institute workspace.</p>
        </div>

        <form onSubmit={handleSaveCentre}>
          <div className="students-form-grid">
            <label className="students-form-field">
              <span>Centre Workspace Name *</span>
              <input
                type="text"
                value={centreForm.name}
                onChange={(e) =>
                  setCentreForm((p) => ({ ...p, name: e.target.value }))
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
                  setCentreForm((p) => ({ ...p, email: e.target.value }))
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
                  setCentreForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+91 9876543210"
              />
            </label>
          </div>

          <div className="students-modal-actions" style={{ marginTop: 20 }}>
            <button
              type="submit"
              className="students-primary-button"
              disabled={savingCentre}
            >
              {savingCentre ? (
                <LoaderCircle className="students-spinner" size={16} />
              ) : (
                <Save size={16} />
              )}
              {savingCentre ? "Saving..." : "Save centre details"}
            </button>
          </div>
        </form>
      </section>

      {/* User Account Settings */}
      <section className="settings-card">
        <div className="settings-card-header">
          <h2>Your User Profile</h2>
          <p>Manage your account name and authentication password.</p>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="students-form-grid">
            <label className="students-form-field">
              <span>Your Name *</span>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, name: e.target.value }))
                }
                required
              />
            </label>

            <div className="students-form-field">
              <span>Account Email & Role</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
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
                  setProfileForm((p) => ({ ...p, newPassword: e.target.value }))
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
              disabled={savingProfile}
            >
              {savingProfile ? (
                <LoaderCircle className="students-spinner" size={16} />
              ) : (
                <Save size={16} />
              )}
              {savingProfile ? "Updating profile..." : "Update profile"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
