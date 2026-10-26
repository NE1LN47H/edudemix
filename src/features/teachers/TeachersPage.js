"use client";

import { useEffect, useState, useMemo } from "react";
import { GraduationCap, Plus, LoaderCircle, Search } from "lucide-react";
import StaffMetrics from "./components/StaffMetrics";
import StaffTable from "./components/StaffTable";
import StaffModal from "./components/StaffModal";
import NoticeBanner from "@/components/ui/NoticeBanner";
import { SkeletonTable } from "@/components/ui/Skeleton";
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
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

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

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        search === "" ||
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" ||
        member.role === roleFilter ||
        (roleFilter === "admin" && member.role === "owner");

      return matchesSearch && matchesRole;
    });
  }, [staff, search, roleFilter]);

  return (
    <div className="teachers-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE MANAGEMENT</div>
          <h1>Staff & Teachers</h1>
          <p className="page-description">
            Manage your teaching faculty, administrators, accountants, and workspace access roles.
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

      <StaffMetrics staff={staff} />

      <NoticeBanner
        type="success"
        message={success}
        onDismiss={() => setSuccess("")}
      />
      <NoticeBanner
        type="error"
        message={error}
        onDismiss={() => setError("")}
      />

      <section className="students-panel">
        <div className="staff-toolbar">
          <div className="staff-search-box">
            <Search size={15} className="staff-search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="staff-search-input"
            />
          </div>

          <div className="staff-role-filters">
            <button
              type="button"
              className={`staff-filter-btn ${roleFilter === "all" ? "active" : ""}`}
              onClick={() => setRoleFilter("all")}
            >
              All ({staff.length})
            </button>
            <button
              type="button"
              className={`staff-filter-btn ${roleFilter === "teacher" ? "active" : ""}`}
              onClick={() => setRoleFilter("teacher")}
            >
              Teachers ({staff.filter((s) => s.role === "teacher").length})
            </button>
            <button
              type="button"
              className={`staff-filter-btn ${roleFilter === "admin" ? "active" : ""}`}
              onClick={() => setRoleFilter("admin")}
            >
              Admins ({staff.filter((s) => s.role === "admin" || s.role === "owner").length})
            </button>
            <button
              type="button"
              className={`staff-filter-btn ${roleFilter === "accountant" ? "active" : ""}`}
              onClick={() => setRoleFilter("accountant")}
            >
              Accountants ({staff.filter((s) => s.role === "accountant").length})
            </button>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={5} columns={4} />
        ) : filteredStaff.length === 0 ? (
          <div className="students-state">
            <div className="students-state-icon">
              <GraduationCap size={24} />
            </div>
            <h3>No matching staff members found</h3>
            <p>
              Try clearing your search query or role filter.
            </p>
          </div>
        ) : (
          <div className="reveal-content transition-filter" key={roleFilter}>
            <StaffTable
              staff={filteredStaff}
              onToggleStatus={handleToggleStatus}
              onDeleteStaff={handleDeleteStaff}
            />
          </div>
        )}
      </section>

      <StaffModal
        isOpen={showModal}
        form={form}
        saving={saving}
        onChange={(e) =>
          setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
        }
        onClose={() => setShowModal(false)}
        onSubmit={handleAddStaff}
      />
    </div>
  );
}
