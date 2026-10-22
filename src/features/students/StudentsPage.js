"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, LoaderCircle } from "lucide-react";
import StudentTable from "./components/StudentTable";
import StudentForm from "./components/StudentForm";
import StudentToolbar from "./components/StudentToolbar";
import StudentEmptyState from "./components/StudentEmptyState";
import Pagination from "@/components/ui/Pagination";
import NoticeBanner from "@/components/ui/NoticeBanner";
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

  // Load batches for dropdown selection
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
        headers: { "Content-Type": "application/json" },
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
        <StudentToolbar
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

        {loading ? null : error || students.length === 0 ? (
          <StudentEmptyState
            search={search}
            error={error}
            onRetry={loadStudents}
            onAddStudent={openCreateForm}
          />
        ) : (
          <>
            <StudentTable
              students={students}
              onEdit={openEditForm}
              onDelete={handleDeleteStudent}
              deletingId={deletingId}
            />

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

      <StudentForm
        isOpen={showForm}
        isEditing={Boolean(editingStudent)}
        form={form}
        batches={batches}
        saving={saving}
        error={formError}
        onChange={updateField}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />
    </>
  );
}
