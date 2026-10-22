"use client";

import { Pencil, Trash2 } from "lucide-react";

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

export default function StudentTable({
  students,
  onEdit,
  onDelete,
  deletingId,
}) {
  return (
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
                    onClick={() => onEdit(student)}
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    type="button"
                    className="student-action-btn delete"
                    title="Delete student"
                    aria-label={`Delete ${student.name}`}
                    onClick={() => onDelete(student)}
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
  );
}
