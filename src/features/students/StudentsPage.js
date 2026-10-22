"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  LoaderCircle,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react";
import "./StudentsPage.css";

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  admissionNumber: "",
  name: "",
  phone: "",
  guardianName: "",
  guardianPhone: "",
  email: "",
  batchId: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  status: "active",
  address: "",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch batches for batch assignment dropdown
  useEffect(() => {
    async function loadBatches() {
      try {
        const response = await fetch("/api/batches?limit=100", { cache: "no-store" });
        const result = await response.json();
        if (result.success && result.batches) {
          setBatches(result.batches);
        }
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    }
    loadBatches();
  }, []);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search: search.trim(),
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      const response = await fetch(`/api/students?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load students.");
      }

      setStudents(result.students || []);
      setPagination(
        result.pagination || {
          page,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      setError(err.message || "Something went wrong while loading students.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadStudents();
    }, 250);

    return () => clearTimeout(timeout);
  }, [loadStudents]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setEditingStudent(null);
    setForm({
      ...EMPTY_FORM,
      admissionDate: new Date().toISOString().slice(0, 10),
    });
    setFormError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingStudent(student);
    setForm({
      admissionNumber: student.admissionNumber || "",
      name: student.name || "",
      phone: student.phone || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      email: student.email || "",
      batchId: student.batchId?._id || student.batchId || "",
      admissionDate: student.admissionDate
        ? new Date(student.admissionDate).toISOString().slice(0, 10)
        : "",
      status: student.status || "active",
      address: student.address || "",
    });
    setFormError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingStudent(null);
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setSuccess("");

    try {
      const isEditing = Boolean(editingStudent);
      const url = isEditing
        ? `/api/students/${editingStudent._id}`
        : "/api/students";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const validationMessage = result.errors
          ?.map((issue) => issue.message)
          .filter(Boolean)
          .join(" ");

        throw new Error(
          validationMessage || result.message || "Unable to save student."
        );
      }

      setSuccess(
        isEditing
          ? "Student details updated successfully."
          : "Student added successfully."
      );
      setShowForm(false);
      setEditingStudent(null);
      setForm({ ...EMPTY_FORM });

      await loadStudents();
    } catch (err) {
      setFormError(err.message || "Unable to save student.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteStudent(student) {
    if (!window.confirm(`Are you sure you want to remove ${student.name}?`)) {
      return;
    }

    setDeletingId(student._id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/students/${student._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete student.");
      }

      setSuccess(`Student ${student.name} removed successfully.`);
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to delete student.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setPage(1);
    setSuccess("");
  }

  const firstRecord =
    pagination.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const lastRecord = Math.min(page * PAGE_SIZE, pagination.total);

  return (
    <>
      <section className="page-heading students-heading">
        <div>
          <div className="eyebrow">WORKSPACE</div>
          <h1>Students</h1>
          <p className="page-description">
            Manage student records and batch assignments for your coaching centre.
          </p>
        </div>

        <button
          type="button"
          className="students-primary-button"
          onClick={openCreateForm}
        >
          <Plus size={17} />
          Add student
        </button>
      </section>

      {success && (
        <div className="students-notice students-notice-success" role="status">
          {success}
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setSuccess("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="students-notice students-notice-error" role="alert">
          {error}
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section className="students-panel">
        <div className="students-toolbar">
          <div>
            <h2>All students</h2>
            <p className="students-subtitle">
              {pagination.total}{" "}
              {pagination.total === 1 ? "student" : "students"} in your centre
            </p>
          </div>

          <label className="students-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search students..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search by name, admission number, or phone"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
              >
                <X size={15} />
              </button>
            )}
          </label>
        </div>

        {loading ? (
          <div className="students-state">
            <LoaderCircle className="students-spinner" size={25} />
            <p>Loading student records...</p>
          </div>
        ) : error ? (
          <div className="students-state">
            <div className="students-state-icon">
              <Users size={23} />
            </div>
            <h3>Unable to load students</h3>
            <p>{error}</p>
            <button
              type="button"
              className="students-secondary-button"
              onClick={loadStudents}
            >
              Try again
            </button>
          </div>
        ) : students.length === 0 ? (
          <div className="students-state">
            <div className="students-state-icon">
              <GraduationCap size={25} />
            </div>
            <h3>{search ? "No students found" : "No students yet"}</h3>
            <p>
              {search
                ? "Try another name, admission number, or phone number."
                : "Add your first student to start managing your records."}
            </p>
            {!search && (
              <button
                type="button"
                className="students-secondary-button"
                onClick={openCreateForm}
              >
                <Plus size={16} />
                Add your first student
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="students-table-wrap">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission no.</th>
                    <th>Batch</th>
                    <th>Phone</th>
                    <th>Admission date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="students-person">
                          <div className="students-avatar">
                            {(student.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="students-person-info">
                            <span className="students-person-name">
                              {student.name}
                            </span>
                            {student.email && (
                              <span className="students-person-email">
                                {student.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="students-admission-number">
                          {student.admissionNumber}
                        </span>
                      </td>
                      <td>
                        {student.batchId ? (
                          <span className="student-batch-tag">
                            {student.batchId.name || "Assigned"}
                          </span>
                        ) : (
                          <span className="student-batch-unassigned">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td>{student.phone}</td>
                      <td>{formatDate(student.admissionDate)}</td>
                      <td>
                        <span
                          className={`students-status students-status-${student.status}`}
                        >
                          <span />
                          {student.status || "active"}
                        </span>
                      </td>
                      <td>
                        <div className="student-actions-cell">
                          <button
                            type="button"
                            className="student-action-btn"
                            title="Edit student"
                            aria-label={`Edit ${student.name}`}
                            onClick={() => openEditForm(student)}
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            type="button"
                            className="student-action-btn delete"
                            title="Delete student"
                            aria-label={`Delete ${student.name}`}
                            onClick={() => handleDeleteStudent(student)}
                            disabled={deletingId === student._id}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="students-pagination">
              <span>
                Showing {firstRecord}–{lastRecord} of {pagination.total}
              </span>

              <div className="students-pagination-controls">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  <ChevronLeft size={17} />
                </button>

                <span>
                  Page {page} of {Math.max(1, pagination.totalPages)}
                </span>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {showForm && (
        <div
          className="students-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="students-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="students-modal-title"
          >
            <div className="students-modal-header">
              <div>
                <div className="eyebrow">STUDENT RECORDS</div>
                <h2 id="students-modal-title">
                  {editingStudent ? "Edit student" : "Add student"}
                </h2>
                <p>Enter the student&apos;s admission details.</p>
              </div>

              <button
                type="button"
                className="students-modal-close"
                aria-label="Close form"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="students-form-grid">
                <label className="students-form-field">
                  <span>Student name *</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="Full name"
                    maxLength={100}
                    required
                    minLength={2}
                  />
                </label>

                <label className="students-form-field">
                  <span>Admission number *</span>
                  <input
                    name="admissionNumber"
                    value={form.admissionNumber}
                    onChange={updateField}
                    placeholder="e.g. EDM-001"
                    maxLength={30}
                    required
                  />
                </label>

                <label className="students-form-field">
                  <span>Assigned batch</span>
                  <select
                    name="batchId"
                    value={form.batchId}
                    onChange={updateField}
                  >
                    <option value="">No batch (Unassigned)</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name} ({batch.courseName})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="students-form-field">
                  <span>Phone number *</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="10-digit number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </label>

                <label className="students-form-field">
                  <span>Email address</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="student@example.com"
                  />
                </label>

                <label className="students-form-field">
                  <span>Guardian name</span>
                  <input
                    name="guardianName"
                    value={form.guardianName}
                    onChange={updateField}
                    placeholder="Parent or guardian"
                    maxLength={100}
                  />
                </label>

                <label className="students-form-field">
                  <span>Guardian phone</span>
                  <input
                    name="guardianPhone"
                    type="tel"
                    inputMode="numeric"
                    value={form.guardianPhone}
                    onChange={updateField}
                    placeholder="10-digit number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                  />
                </label>

                <label className="students-form-field">
                  <span>Admission date</span>
                  <input
                    name="admissionDate"
                    type="date"
                    value={form.admissionDate}
                    onChange={updateField}
                  />
                </label>

                <label className="students-form-field">
                  <span>Status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateField}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>

                <label className="students-form-field students-form-field-full">
                  <span>Address</span>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={updateField}
                    placeholder="Student address"
                    rows={3}
                    maxLength={500}
                  />
                </label>
              </div>

              {formError && (
                <div className="students-notice students-notice-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="students-modal-actions">
                <button
                  type="button"
                  className="students-secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="students-primary-button"
                  disabled={saving}
                >
                  {saving && (
                    <LoaderCircle className="students-spinner" size={16} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingStudent
                    ? "Save changes"
                    : "Save student"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
