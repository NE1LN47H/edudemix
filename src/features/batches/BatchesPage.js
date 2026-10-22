"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Layers3, LoaderCircle } from "lucide-react";
import BatchCard from "./components/BatchCard";
import BatchForm from "./components/BatchForm";
import BatchToolbar from "./components/BatchToolbar";
import Pagination from "@/components/ui/Pagination";
import NoticeBanner from "@/components/ui/NoticeBanner";
import "./BatchesPage.css";

const PAGE_SIZE = 10;

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

  function openCreateForm() {
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
        isEditing ? `/api/batches/${editingBatch._id}` : "/api/batches",
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
    if (
      !window.confirm(
        `Are you sure you want to delete batch "${batch.name}"? Enrolled students will be unassigned.`
      )
    ) {
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
          onClick={openCreateForm}
        >
          <Plus size={17} />
          Create batch
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

      <section className="batches-panel">
        <BatchToolbar
          total={pagination.total}
          search={search}
          onSearchChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            setSuccess("");
          }}
          onClearSearch={() => {
            setSearch("");
            setPage(1);
          }}
        />

        {loading ? null : error ? (
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
                onClick={openCreateForm}
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
                <BatchCard
                  key={batch._id}
                  batch={batch}
                  onEdit={openEditForm}
                  onDelete={handleDeleteBatch}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <BatchForm
        isOpen={showForm}
        isEditing={Boolean(editingBatch)}
        form={form}
        saving={saving}
        error={formError}
        onChange={updateField}
        onToggleDay={toggleDay}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </>
  );
}
