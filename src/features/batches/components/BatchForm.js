"use client";

import { LoaderCircle, X } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function BatchForm({
  isOpen,
  isEditing,
  form,
  saving,
  error,
  onChange,
  onToggleDay,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="batches-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
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
              {isEditing ? "Edit batch" : "Create batch"}
            </h2>
            <p>Set up a course and its class schedule.</p>
          </div>

          <button
            type="button"
            className="batches-modal-close"
            aria-label="Close form"
            onClick={onClose}
            disabled={saving}
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="batches-form-grid">
            <label className="batches-form-field">
              <span>Batch name *</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
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
                onChange={onChange}
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
                onChange={onChange}
                required
              />
            </label>

            <label className="batches-form-field">
              <span>End date *</span>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={onChange}
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
                onChange={onChange}
              />
            </label>

            <label className="batches-form-field">
              <span>End time</span>
              <input
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={onChange}
                min={form.startTime || undefined}
              />
            </label>

            <label className="batches-form-field">
              <span>Student capacity *</span>
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={onChange}
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
                onChange={onChange}
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
                    onClick={() => onToggleDay(day)}
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
                onChange={onChange}
                placeholder="Optional details about this batch"
                rows={3}
                maxLength={500}
              />
            </label>
          </div>

          {error && (
            <div className="batches-notice batches-notice-error" role="alert">
              {error}
            </div>
          )}

          <div className="batches-modal-actions">
            <button
              type="button"
              className="batches-secondary-button"
              onClick={onClose}
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
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                ? "Save changes"
                : "Create batch"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
