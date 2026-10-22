"use client";

import {
  Layers3,
  CalendarDays,
  Users,
  Clock3,
  Pencil,
  Trash2,
} from "lucide-react";

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

export default function BatchCard({ batch, onEdit, onDelete }) {
  return (
    <article className="batch-card">
      <div className="batch-card-main">
        <div className="batch-icon">
          <Layers3 size={20} />
        </div>

        <div className="batch-card-info">
          <div className="batch-title-line">
            <h3>{batch.name}</h3>
            <span className={`batches-status batches-status-${batch.status}`}>
              <span />
              {batch.status}
            </span>
          </div>

          <p className="batch-course">{batch.courseName}</p>

          {batch.description && (
            <p className="batch-description">{batch.description}</p>
          )}
        </div>
      </div>

      <div className="batch-card-meta">
        <div className="batch-meta-item">
          <CalendarDays size={15} />
          <span>
            {formatDate(batch.startDate)} – {formatDate(batch.endDate)}
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
          onClick={() => onEdit(batch)}
          aria-label={`Edit ${batch.name}`}
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          type="button"
          className="batch-delete-button"
          onClick={() => onDelete(batch)}
          aria-label={`Delete ${batch.name}`}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </article>
  );
}
