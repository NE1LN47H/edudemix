"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Plus, LoaderCircle } from "lucide-react";
import StaffTable from "./components/StaffTable";
import StaffModal from "./components/StaffModal";
import NoticeBanner from "@/components/ui/NoticeBanner";
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
            <p>
              Add teachers or administrators to collaborate in your centre workspace.
            </p>
          </div>
        ) : (
          <StaffTable
            staff={staff}
            onToggleStatus={handleToggleStatus}
            onDeleteStaff={handleDeleteStaff}
          />
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
