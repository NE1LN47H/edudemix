"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Plus,
  X,
  LoaderCircle,
  Trash2,
  Power,
  ShieldCheck,
} from "lucide-react";
import "./TeachersPage.css";

const EMPTY_STAFF_FORM = {
  name: "",
  email: "",
  password: "",
  role: "teacher",
};

export default function TeachersPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_STAFF_FORM);
  const [saving, setSaving] = useState(false);

  async function loadStaff() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/teachers", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to load staff members");
      }
      setStaff(data.staff || []);
    } catch (err) {
      setError(err.message || "Failed to load staff list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStaff();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  async function handleAddStaff(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to add staff member");
      }

      setSuccess(`Added ${data.user.name} as ${data.user.role}.`);
      setShowModal(false);
      setForm(EMPTY_STAFF_FORM);
      loadStaff();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(user) {
    if (user.role === "owner") return;
    const newStatus = user.status === "active" ? "disabled" : "active";

    try {
      const res = await fetch(`/api/teachers/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to update status");
      }

      setSuccess(`Updated status for ${user.name}.`);
      loadStaff();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteStaff(user) {
    if (user.role === "owner") return;
    if (!window.confirm(`Are you sure you want to remove ${user.name}?`)) return;

    try {
      const res = await fetch(`/api/teachers/${user._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to delete staff member");
      }

      setSuccess(`Staff member ${user.name} removed.`);
      loadStaff();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="teachers-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE MANAGEMENT</div>
          <h1>Staff & Teachers</h1>
          <p className="page-description">
            Manage your teaching staff, administrators, and workspace roles.
          </p>
        </div>

        <button
          type="button"
          className="students-primary-button"
          onClick={() => {
            setForm(EMPTY_STAFF_FORM);
            setShowModal(true);
          }}
        >
          <Plus size={16} />
          Add staff member
        </button>
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

      <section className="students-panel">
        <div className="students-toolbar">
          <div>
            <h2>Staff directory</h2>
            <p className="students-subtitle">
              {staff.length} registered members in this centre
            </p>
          </div>
        </div>

        {loading ? (
          <div className="students-state">
            <LoaderCircle className="students-spinner" size={25} />
            <p>Loading staff directory...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="students-state">
            <div className="students-state-icon">
              <GraduationCap size={24} />
            </div>
            <h3>No additional staff added</h3>
            <p>Add teachers or administrators to collaborate in your centre workspace.</p>
          </div>
        ) : (
          <div className="students-table-wrap">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {staff.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="students-person">
                        <div className="students-avatar">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <span className="students-person-name">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span className={`role-pill role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`students-status students-status-${
                          user.status === "active" ? "active" : "inactive"
                        }`}
                      >
                        <span />
                        {user.status}
                      </span>
                    </td>

                    <td>
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td>
                      {user.role !== "owner" ? (
                        <div className="student-actions-cell">
                          <button
                            type="button"
                            className="student-action-btn"
                            title={
                              user.status === "active"
                                ? "Disable account"
                                : "Activate account"
                            }
                            onClick={() => handleToggleStatus(user)}
                          >
                            <Power size={13} />
                          </button>

                          <button
                            type="button"
                            className="student-action-btn delete"
                            title="Remove staff member"
                            onClick={() => handleDeleteStaff(user)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "11px", color: "#888" }}>
                          Primary owner
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <div
          className="students-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
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
                onClick={() => setShowModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <label className="students-form-field">
                  <span>Full name *</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
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
                    onChange={(e) =>
                      setForm((p) => ({ ...p, role: e.target.value }))
                    }
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
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
}
