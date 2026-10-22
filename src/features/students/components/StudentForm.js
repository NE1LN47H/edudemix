"use client";

import { LoaderCircle, X } from "lucide-react";

export default function StudentForm({
  isOpen,
  isEditing,
  form,
  batches,
  saving,
  error,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="students-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
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
              {isEditing ? "Edit student" : "Add student"}
            </h2>
            <p>Enter the student&apos;s admission details.</p>
          </div>

          <button
            type="button"
            className="students-modal-close"
            aria-label="Close form"
            onClick={onClose}
            disabled={saving}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="students-form-grid">
            <label className="students-form-field">
              <span>Student name *</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
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
                onChange={onChange}
                placeholder="e.g. EDM-001"
                maxLength={30}
                required
              />
            </label>

            <label className="students-form-field">
              <span>Assigned batch</span>
              <select
                name="batchId"
                value={form.batchId || ""}
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
                placeholder="student@example.com"
              />
            </label>

            <label className="students-form-field">
              <span>Guardian name</span>
              <input
                name="guardianName"
                value={form.guardianName}
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
              />
            </label>

            <label className="students-form-field">
              <span>Status</span>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
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
                onChange={onChange}
                placeholder="Student address"
                rows={3}
                maxLength={500}
              />
            </label>
          </div>

          {error && (
            <div className="students-notice students-notice-error" role="alert">
              {error}
            </div>
          )}

          <div className="students-modal-actions">
            <button
              type="button"
              className="students-secondary-button"
              onClick={onClose}
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
                : isEditing
                ? "Save changes"
                : "Save student"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
