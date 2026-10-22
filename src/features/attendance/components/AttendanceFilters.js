"use client";

import { LoaderCircle, Save } from "lucide-react";

export default function AttendanceFilters({
  batches,
  selectedBatchId,
  selectedDate,
  loadingBatches,
  saving,
  hasStudents,
  onBatchChange,
  onDateChange,
  onSave,
}) {
  return (
    <div className="attendance-filters-card">
      <div className="attendance-filter-group">
        <div className="attendance-field">
          <label htmlFor="batchSelect">Select batch</label>
          <select
            id="batchSelect"
            className="attendance-select"
            value={selectedBatchId}
            onChange={(e) => onBatchChange(e.target.value)}
            disabled={loadingBatches || batches.length === 0}
          >
            {batches.length === 0 ? (
              <option value="">No batches available</option>
            ) : (
              batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name} ({batch.courseName})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="attendance-field">
          <label htmlFor="dateSelect">Select date</label>
          <input
            id="dateSelect"
            type="date"
            className="attendance-input"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      {hasStudents && (
        <button
          type="button"
          className="attendance-save-btn"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <LoaderCircle size={16} className="students-spinner" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving records..." : "Save attendance"}
        </button>
      )}
    </div>
  );
}
