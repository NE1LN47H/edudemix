"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  Lock,
  Building,
  Users,
  BookOpen,
  Plus,
  Check,
  Copy,
  LogOut,
  Search,
  LoaderCircle,
  X,
  ExternalLink,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import "./super-admin.css";

export default function SuperAdminPortal() {
  const [keyInput, setKeyInput] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState("");

  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal & form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdResult, setCreatedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Deletion modal state
  const [deletingCentre, setDeletingCentre] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    centreName: "",
    centreSlug: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
  });

  const loadCentres = useCallback(async (key) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/super-admin/centres", {
        headers: { "x-superadmin-key": key },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load institutes");
      }
      setCentres(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyAndLoad = useCallback(async (key) => {
    try {
      setVerifying(true);
      setAuthError("");
      const res = await fetch("/api/super-admin/verify", {
        method: "POST",
        headers: { "x-superadmin-key": key },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid Master Secret Key");
      }
      setAuthenticated(true);
      sessionStorage.setItem("edudemix_superadmin_key", key);
      loadCentres(key);
    } catch (err) {
      setAuthError(err.message);
      setAuthenticated(false);
      sessionStorage.removeItem("edudemix_superadmin_key");
    } finally {
      setVerifying(false);
    }
  }, [loadCentres]);

  // Check sessionStorage on mount
  useEffect(() => {
    let ignore = false;
    const saved = sessionStorage.getItem("edudemix_superadmin_key");
    if (saved) {
      setTimeout(() => {
        if (!ignore) {
          setAdminKey(saved);
          verifyAndLoad(saved);
        }
      }, 0);
    }
    return () => {
      ignore = true;
    };
  }, [verifyAndLoad]);

  function handleKeySubmit(e) {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAdminKey(keyInput.trim());
    verifyAndLoad(keyInput.trim());
  }

  function handleLogout() {
    sessionStorage.removeItem("edudemix_superadmin_key");
    setAdminKey("");
    setAuthenticated(false);
    setKeyInput("");
    setCentres([]);
  }

  function handleNameChange(e) {
    const name = e.target.value;
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({
      ...prev,
      centreName: name,
      centreSlug: prev.centreSlug === "" || prev.centreSlug === autoSlug.slice(0, -1) ? autoSlug : prev.centreSlug,
    }));
  }

  async function handleRegisterCentre(e) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      const res = await fetch("/api/super-admin/centres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-superadmin-key": adminKey,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to register centre");
      }

      setCreatedResult({
        centreName: form.centreName,
        slug: data.centre.slug,
        ownerEmail: data.user.email,
        ownerPassword: form.password,
        loginUrl: `${window.location.origin}/login`,
      });

      // Reload list and reset form
      loadCentres(adminKey);
      setForm({
        centreName: "",
        centreSlug: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(centreId, currentStatus) {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    if (
      !confirm(
        `Are you sure you want to mark this coaching centre as ${newStatus}?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/super-admin/centres", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-superadmin-key": adminKey,
        },
        body: JSON.stringify({ centreId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to update status");
      }
      setCentres((prev) =>
        prev.map((c) => (c.id === centreId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDeleteCentreSubmit(e) {
    e.preventDefault();
    if (!deletingCentre) return;

    try {
      setIsDeleting(true);
      setError("");
      const res = await fetch("/api/super-admin/centres", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-superadmin-key": adminKey,
        },
        body: JSON.stringify({ centreId: deletingCentre.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to delete coaching centre");
      }

      setCentres((prev) => prev.filter((c) => c.id !== deletingCentre.id));
      setDeletingCentre(null);
      setDeleteConfirmText("");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCopyCredentials() {
    if (!createdResult) return;
    const text = `🎉 Welcome to edudemix! Your coaching centre workspace has been provisioned:

• Institute: ${createdResult.centreName}
• Workspace Identifier: ${createdResult.slug}
• Sign-in Email: ${createdResult.ownerEmail}
• Temporary Password: ${createdResult.ownerPassword}
• Login URL: ${createdResult.loginUrl}

Please log in and update your password under Workspace Settings.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // Filtered centres
  const filteredCentres = useMemo(() => {
    if (!search.trim()) return centres;
    const q = search.toLowerCase();
    return centres.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.owner?.name && c.owner.name.toLowerCase().includes(q)) ||
        (c.owner?.email && c.owner.email.toLowerCase().includes(q))
    );
  }, [centres, search]);

  // Overall totals
  const totalStudents = useMemo(
    () => centres.reduce((acc, c) => acc + (c.stats?.students || 0), 0),
    [centres]
  );
  const totalBatches = useMemo(
    () => centres.reduce((acc, c) => acc + (c.stats?.batches || 0), 0),
    [centres]
  );

  // If NOT authenticated, show the Master Secret Key Gate
  if (!authenticated) {
    return (
      <div className="saas-gate-wrapper">
        <div className="saas-gate-card">
          <div className="saas-gate-icon">
            <Lock size={26} />
          </div>
          <h2>edudemix SaaS Portal</h2>
          <p>
            Restricted to edudemix Platform Administrators only. Enter your Master Secret Key to manage institutes and centre registrations.
          </p>

          <form className="saas-gate-form" onSubmit={handleKeySubmit}>
            <input
              type="password"
              className="saas-input"
              placeholder="Enter Master Secret Key..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
              required
            />

            {authError && (
              <div
                style={{
                  color: "#991b1b",
                  fontSize: "12px",
                  background: "#fee2e2",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
              >
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="saas-primary-btn"
              disabled={verifying}
            >
              {verifying ? (
                <LoaderCircle size={16} className="students-spinner" />
              ) : (
                <ShieldCheck size={16} />
              )}
              {verifying ? "Verifying key..." : "Authenticate as SaaS Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="saas-admin-container">
      {/* SaaS Admin Header */}
      <header className="saas-admin-header">
        <div className="saas-admin-brand">
          <div className="saas-brand-logo">
            <Building size={20} />
          </div>
          <div>
            <div className="saas-brand-title">edudemix Platform</div>
          </div>
          <span className="saas-brand-badge">SaaS Master Administrator</span>
        </div>

        <div className="saas-admin-user">
          <a
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
            className="saas-logout-btn"
            style={{ color: "#93c5fd" }}
          >
            <ExternalLink size={14} />
            Go to User Login
          </a>
          <button
            type="button"
            className="saas-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={14} />
            Lock Portal
          </button>
        </div>
      </header>

      {/* Main SaaS Dashboard */}
      <main className="saas-admin-main">
        <div className="page-heading">
          <div>
            <div className="eyebrow">PLATFORM TENANT MANAGEMENT</div>
            <h1>Coaching Centres Registry</h1>
            <p className="page-description">
              Onboard new institutes, provision tenant workspaces, and monitor active coaching cohorts across the platform.
            </p>
          </div>

          <button
            type="button"
            className="saas-primary-btn"
            onClick={() => {
              setCreatedResult(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={16} />
            Register New Coaching Centre
          </button>
        </div>

        {/* Global SaaS Metrics */}
        <div className="metrics-grid" style={{ margin: "20px 0" }}>
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">TOTAL CENTRES</span>
              <div className="metric-icon">
                <Building size={16} />
              </div>
            </div>
            <div className="metric-value">{centres.length}</div>
            <div className="metric-bottom">
              <span className="metric-description">
                Active tenant institutes
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">TOTAL STUDENTS MANAGED</span>
              <div className="metric-icon">
                <Users size={16} />
              </div>
            </div>
            <div className="metric-value">{totalStudents}</div>
            <div className="metric-bottom">
              <span className="metric-description">
                Enrolled across all centres
              </span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">ACTIVE BATCHES</span>
              <div className="metric-icon">
                <BookOpen size={16} />
              </div>
            </div>
            <div className="metric-value">{totalBatches}</div>
            <div className="metric-bottom">
              <span className="metric-description">
                Running course cohorts
              </span>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="saas-action-bar">
          <div style={{ position: "relative", width: 320 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 10,
                top: 10,
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search centre, slug, or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="saas-search-input"
              style={{ paddingLeft: 32 }}
            />
          </div>

          <span style={{ fontSize: "12px", color: "#64748b" }}>
            Showing {filteredCentres.length} of {centres.length} centres
          </span>
        </div>

        {error && (
          <div
            style={{
              padding: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "6px",
              marginBottom: "16px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* Centres Table */}
        {loading ? (
          <div className="students-state">
            <LoaderCircle className="students-spinner" size={28} />
            <p>Loading coaching centre registry...</p>
          </div>
        ) : filteredCentres.length === 0 ? (
          <div className="students-state">
            <Building size={32} style={{ color: "#94a3b8" }} />
            <h3>No coaching centres found</h3>
            <p>Click &ldquo;Register New Coaching Centre&rdquo; above to provision your first tenant workspace.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="saas-centres-table">
              <thead>
                <tr>
                  <th>Institute Name</th>
                  <th>Workspace Slug</th>
                  <th>Owner / Contact</th>
                  <th>Platform Footprint</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCentres.map((centre) => (
                  <tr key={centre.id}>
                    <td>
                      <strong style={{ fontSize: "14px" }}>
                        {centre.name}
                      </strong>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        Registered: {new Date(centre.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="saas-slug-tag">{centre.slug}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {centre.owner?.name || "—"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        {centre.owner?.email || centre.email || "—"}
                      </div>
                      {centre.phone && (
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {centre.phone}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: "12px" }}>
                        <strong>{centre.stats?.students || 0}</strong> students
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        <strong>{centre.stats?.batches || 0}</strong> batches
                      </div>
                    </td>
                    <td>
                      <span
                        className={`saas-status-badge status-${
                          centre.status || "active"
                        }`}
                      >
                        {centre.status || "active"}
                      </span>
                    </td>
                    <td>
                      <div className="saas-action-group">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(centre.id, centre.status || "active")
                          }
                          style={{
                            background: "none",
                            border: "1px solid #cbd5e1",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "11px",
                            cursor: "pointer",
                          }}
                        >
                          {centre.status === "suspended" ? "Reactivate" : "Suspend"}
                        </button>
                        <button
                          type="button"
                          className="saas-delete-btn"
                          title="Permanently delete coaching centre"
                          onClick={() => {
                            setDeletingCentre(centre);
                            setDeleteConfirmText("");
                          }}
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Centre Registration Modal */}
      {isModalOpen && (
        <div className="students-modal-backdrop" role="dialog">
          <div className="saas-credentials-modal-box">
            {createdResult ? (
              <div>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#dcfce7",
                      color: "#15803d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}
                  >
                    <Check size={24} />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                    Workspace Provisioned!
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748b" }}>
                    The coaching centre account has been registered. Copy the details below to share with the centre administrator.
                  </p>
                </div>

                <div className="saas-cred-block">
                  <strong>Institute:</strong> {createdResult.centreName}
                  <br />
                  <strong>Workspace Slug:</strong> {createdResult.slug}
                  <br />
                  <strong>Sign-in Email:</strong> {createdResult.ownerEmail}
                  <br />
                  <strong>Initial Password:</strong> {createdResult.ownerPassword}
                  <br />
                  <strong>Sign-in Page:</strong> {createdResult.loginUrl}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    type="button"
                    className="saas-primary-btn"
                    style={{ flex: 1 }}
                    onClick={handleCopyCredentials}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied to Clipboard!" : "Copy Welcome Credentials"}
                  </button>
                  <button
                    type="button"
                    className="students-secondary-button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCreatedResult(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="students-modal-header">
                  <div>
                    <h2>Register Coaching Centre</h2>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                      Provision a new tenant workspace and create the institute owner account.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="students-close-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleRegisterCentre}>
                  <div className="students-form-grid">
                    <label className="students-form-field">
                      <span>Coaching Centre Name *</span>
                      <input
                        type="text"
                        placeholder="e.g. Apex IIT Academy"
                        value={form.centreName}
                        onChange={handleNameChange}
                        required
                      />
                    </label>

                    <label className="students-form-field">
                      <span>Workspace Identifier (Slug) *</span>
                      <input
                        type="text"
                        placeholder="e.g. apex-academy"
                        value={form.centreSlug}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            centreSlug: e.target.value.toLowerCase().trim(),
                          }))
                        }
                        pattern="^[a-z0-9-]+$"
                        title="Lowercase letters, numbers, and hyphens only"
                        required
                      />
                    </label>

                    <label className="students-form-field">
                      <span>Owner / Principal Name *</span>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Rajesh Sharma"
                        value={form.ownerName}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, ownerName: e.target.value }))
                        }
                        required
                      />
                    </label>

                    <label className="students-form-field">
                      <span>Owner Sign-in Email *</span>
                      <input
                        type="email"
                        placeholder="owner@centre.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        required
                      />
                    </label>

                    <label className="students-form-field">
                      <span>Centre Contact Phone</span>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                      />
                    </label>

                    <label className="students-form-field">
                      <span>Initial Password *</span>
                      <input
                        type="text"
                        placeholder="Minimum 8 characters"
                        value={form.password}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, password: e.target.value }))
                        }
                        minLength={8}
                        required
                      />
                    </label>
                  </div>

                  <div className="students-modal-actions" style={{ marginTop: 24 }}>
                    <button
                      type="button"
                      className="students-secondary-button"
                      onClick={() => setIsModalOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="saas-primary-btn"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <LoaderCircle
                          size={16}
                          className="students-spinner"
                        />
                      ) : (
                        <Plus size={16} />
                      )}
                      {submitting ? "Provisioning..." : "Provision Workspace"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Centre Deletion Confirmation Modal */}
      {deletingCentre && (
        <div className="students-modal-backdrop" role="dialog">
          <div className="saas-credentials-modal-box">
            <div className="students-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#fee2e2",
                    color: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h2 style={{ color: "#991b1b" }}>Delete Coaching Centre</h2>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                    Irreversible action — permanently erase tenant workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="students-close-button"
                onClick={() => setDeletingCentre(null)}
                disabled={isDeleting}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ margin: "20px 0" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
                You are about to permanently delete <strong>{deletingCentre.name}</strong> (workspace slug: <code>{deletingCentre.slug}</code>).
              </p>

              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "#991b1b",
                  margin: "12px 0",
                }}
              >
                <strong>The following records will be permanently deleted:</strong>
                <ul style={{ paddingLeft: "20px", marginTop: "6px", lineHeight: "1.5" }}>
                  <li>All {deletingCentre.stats?.students || 0} student profiles and admission records</li>
                  <li>All {deletingCentre.stats?.batches || 0} batches and cohorts</li>
                  <li>All staff and teacher user accounts</li>
                  <li>All attendance sessions and daily logs</li>
                  <li>All fee invoices, receipts, and payment transactions</li>
                </ul>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b" }}>
                To confirm deletion, please type the workspace slug <strong>{deletingCentre.slug}</strong> below:
              </p>

              <input
                type="text"
                className="saas-input"
                placeholder={deletingCentre.slug}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                style={{ marginTop: 8 }}
                autoFocus
              />
            </div>

            <div className="students-modal-actions">
              <button
                type="button"
                className="students-secondary-button"
                onClick={() => setDeletingCentre(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="saas-danger-btn"
                disabled={
                  isDeleting ||
                  deleteConfirmText.trim().toLowerCase() !==
                    deletingCentre.slug.toLowerCase()
                }
                onClick={handleDeleteCentreSubmit}
              >
                {isDeleting ? (
                  <LoaderCircle size={16} className="students-spinner" />
                ) : (
                  <Trash2 size={16} />
                )}
                {isDeleting ? "Deleting..." : "Permanently Delete Centre"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
