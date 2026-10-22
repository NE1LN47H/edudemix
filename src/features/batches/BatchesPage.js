
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  Layers3,
  ChevronLeft,
  ChevronRight,
  X,
  LoaderCircle,
  Users,
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";
import "./BatchesPage.css";

const PAGE_SIZE = 10;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EMPTY_FORM = {
  name: "",
  courseName: "",
  description: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  scheduleDays: [],
  startTime: "",
  endTime: "",
  capacity: "30",
  status: "active",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatTime(value) {
  if (!value) return "";

  const [hours, minutes] = value.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingBatch, setEditingBatch] = useState(null);

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

  const loadBatches = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search: search.trim(),
        page: String(page),
        limit: String(PAGE_SIZE),
      });

      const response = await fetch(`/api/batches?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load batches.");
      }

      setBatches(result.batches || []);
      setPagination(
        result.pagination || {
          page,
          limit: PAGE_SIZE,
          total: 0,
          totalPages: 0,
        }
      );
    } catch (err) {
      setError(err.message || "Something went wrong while loading batches.");
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadBatches();
    }, 250);

    return () => clearTimeout(timeout);
  }, [loadBatches]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function toggleDay(day) {
    setForm((current) => ({
      ...current,
      scheduleDays: current.scheduleDays.includes(day)
        ? current.scheduleDays.filter((item) => item !== day)
        : [...current.scheduleDays, day],
    }));
  }

  function openForm() {
    setForm({
      ...EMPTY_FORM,
      startDate: new Date().toISOString().slice(0, 10),
    });
    setFormError("");
    setSuccess("");
    setEditingBatch(null);
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;
    setEditingBatch(null);
    setShowForm(false);
    setFormError("");
  }

  function openEditForm(batch) {
  setEditingBatch(batch);

  setForm({
    name: batch.name || "",
    courseName: batch.courseName || "",
    description: batch.description || "",
    startDate: batch.startDate
      ? new Date(batch.startDate).toISOString().slice(0, 10)
      : "",
    endDate: batch.endDate
      ? new Date(batch.endDate).toISOString().slice(0, 10)
      : "",
    scheduleDays: batch.scheduleDays || [],
    startTime: batch.startTime || "",
    endTime: batch.endTime || "",
    capacity: String(batch.capacity ?? 30),
    status: batch.status || "active",
  });

  setFormError("");
  setSuccess("");
  setShowForm(true);
}

  
async function handleSubmit(event) {
  event.preventDefault();
  setSaving(true);
  setFormError("");
  setSuccess("");

  try {
    const isEditing = Boolean(editingBatch);

    const response = await fetch(
      isEditing
        ? `/api/batches/${editingBatch._id}`
        : "/api/batches",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          capacity: Number(form.capacity),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      const validationMessage = result.errors
        ?.map((issue) => issue.message)
        .filter(Boolean)
        .join(" ");

      throw new Error(
        validationMessage || result.message || "Unable to save batch."
      );
    }

    setShowForm(false);
    setEditingBatch(null);
    setForm({ ...EMPTY_FORM });
    setSearch("");
    setPage(1);

    setSuccess(
      isEditing
        ? "Batch updated successfully."
        : "Batch created successfully."
    );

    await loadBatches();
  } catch (err) {
    setFormError(err.message || "Unable to save batch.");
  } finally {
    setSaving(false);
  }
}

async function handleDeleteBatch(batch) {
  if (!window.confirm(`Are you sure you want to delete batch "${batch.name}"? Enrolled students will be unassigned.`)) {
    return;
  }

  setError("");
  setSuccess("");

  try {
    const response = await fetch(`/api/batches/${batch._id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to delete batch.");
    }

    setSuccess(`Batch "${batch.name}" removed successfully.`);
    await loadBatches();
  } catch (err) {
    setError(err.message || "Unable to delete batch.");
  }
}

  const firstRecord =
    pagination.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const lastRecord = Math.min(page * PAGE_SIZE, pagination.total);

  return (
    <>
      <section className="page-heading batches-heading">
        <div>
          <div className="eyebrow">WORKSPACE</div>
          <h1>Batches</h1>
          <p className="page-description">
            Organise courses, schedules, and student groups.
          </p>
        </div>

        <button
          type="button"
          className="batches-primary-button"
          onClick={openForm}
        >
          <Plus size={17} />
          Create batch
        </button>
      </section>

      {success && (
        <div className="batches-notice batches-notice-success" role="status">
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

      <section className="batches-panel">
        <div className="batches-toolbar">
          <div>
            <h2>All batches</h2>
            <p className="batches-subtitle">
              {pagination.total}{" "}
              {pagination.total === 1 ? "batch" : "batches"} in your centre
            </p>
          </div>

          <label className="batches-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search batches or courses..."
              aria-label="Search batches or courses"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
                setSuccess("");
              }}
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
          <div className="batches-state">
            <LoaderCircle className="batches-spinner" size={25} />
            <p>Loading batches...</p>
          </div>
        ) : error ? (
          <div className="batches-state">
            <div className="batches-state-icon">
              <Layers3 size={24} />
            </div>
            <h3>Unable to load batches</h3>
            <p>{error}</p>
            <button
              type="button"
              className="batches-secondary-button"
              onClick={loadBatches}
            >
              Try again
            </button>
          </div>
        ) : batches.length === 0 ? (
          <div className="batches-state">
            <div className="batches-state-icon">
              <Layers3 size={25} />
            </div>
            <h3>{search ? "No batches found" : "Create your first batch"}</h3>
            <p>
              {search
                ? "Try a different batch name or course name."
                : "Create a batch to organise your students and class schedules."}
            </p>
            {!search && (
              <button
                type="button"
                className="batches-secondary-button"
                onClick={openForm}
              >
                <Plus size={16} />
                Create batch
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="batches-list">
              {batches.map((batch) => (
                <article className="batch-card" key={batch._id}>
                  <div className="batch-card-main">
                    <div className="batch-icon">
                      <Layers3 size={20} />
                    </div>

                    <div className="batch-card-info">
                      <div className="batch-title-line">
                        <h3>{batch.name}</h3>
                        <span
                          className={`batches-status batches-status-${batch.status}`}
                        >
                          <span />
                          {batch.status}
                        </span>
                      </div>

                      <p className="batch-course">{batch.courseName}</p>

                      {batch.description && (
                        <p className="batch-description">
                          {batch.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="batch-card-meta">
                    <div className="batch-meta-item">
                      <CalendarDays size={15} />
                      <span>
                        {formatDate(batch.startDate)} –{" "}
                        {formatDate(batch.endDate)}
                      </span>
                    </div>

                    <div className="batch-meta-item">
                      <Users size={15} />
                      <span>
                        {batch.studentCount || 0} / {batch.capacity} students
                      </span>
                    </div>

                    {(batch.startTime || batch.endTime) && (
                      <div className="batch-meta-item">
                        <Clock3 size={15} />
                        <span>
                          {formatTime(batch.startTime)}
                          {batch.startTime && batch.endTime ? " – " : ""}
                          {formatTime(batch.endTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  {batch.scheduleDays?.length > 0 && (
                    <div className="batch-days">
                      {batch.scheduleDays.map((day) => (
                        <span key={day}>{day.slice(0, 3)}</span>
                      ))}
                    </div>
                  )}
                  <div className="batch-card-actions">
                    <button
                      type="button"
                      className="batch-edit-button"
                      onClick={() => openEditForm(batch)}
                      aria-label={`Edit ${batch.name}`}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="batch-delete-button"
                      onClick={() => handleDeleteBatch(batch)}
                      aria-label={`Delete ${batch.name}`}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="batches-pagination">
              <span>
                Showing {firstRecord}–{lastRecord} of {pagination.total}
              </span>

              <div className="batches-pagination-controls">
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
          className="batches-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            className="batches-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="batches-modal-title"
          >
            <div className="batches-modal-header">
              <div>
                <div className="eyebrow">BATCH MANAGEMENT</div>
                <h2 id="batches-modal-title">
  {editingBatch ? "Edit batch" : "Create batch"}
</h2>
                <p>Set up a course and its class schedule.</p>
              </div>

              <button
                type="button"
                className="batches-modal-close"
                aria-label="Close form"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="batches-form-grid">
                <label className="batches-form-field">
                  <span>Batch name *</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="e.g. Python Morning Batch"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </label>

                <label className="batches-form-field">
                  <span>Course name *</span>
                  <input
                    name="courseName"
                    value={form.courseName}
                    onChange={updateField}
                    placeholder="e.g. Python Programming"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </label>

                <label className="batches-form-field">
                  <span>Start date *</span>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={updateField}
                    required
                  />
                </label>

                <label className="batches-form-field">
                  <span>End date *</span>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={updateField}
                    min={form.startDate || undefined}
                    required
                  />
                </label>

                <label className="batches-form-field">
                  <span>Start time</span>
                  <input
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={updateField}
                  />
                </label>

                <label className="batches-form-field">
                  <span>End time</span>
                  <input
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={updateField}
                    min={form.startTime || undefined}
                  />
                </label>

                <label className="batches-form-field">
                  <span>Student capacity *</span>
                  <input
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={updateField}
                    min="1"
                    max="10000"
                    step="1"
                    required
                  />
                </label>

                <label className="batches-form-field">
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

                <fieldset className="batches-form-field batches-days-field">
                  <legend>Class days</legend>
                  <div className="batches-day-options">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={
                          form.scheduleDays.includes(day)
                            ? "batches-day-option selected"
                            : "batches-day-option"
                        }
                        aria-pressed={form.scheduleDays.includes(day)}
                        onClick={() => toggleDay(day)}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="batches-form-field batches-form-field-full">
                  <span>Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    placeholder="Optional details about this batch"
                    rows={3}
                    maxLength={500}
                  />
                </label>
              </div>

              {formError && (
                <div className="batches-notice batches-notice-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="batches-modal-actions">
                <button
                  type="button"
                  className="batches-secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="batches-primary-button"
                  disabled={saving}
                >
                  {saving && (
                    <LoaderCircle className="batches-spinner" size={16} />
                  )}
                  {saving
                  ? editingBatch
                    ? "Saving..."
                    : "Creating..."
                  : editingBatch
                    ? "Save changes"
                    : "Create batch"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
