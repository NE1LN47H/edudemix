"use client";

import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  LoaderCircle,
  UserCheck,
  Save,
} from "lucide-react";

export default function AttendanceTable({
  students,
  batchInfo,
  selectedDate,
  loading,
  saving,
  unmarkedCount,
  onStatusChange,
  onRemarksChange,
  onMarkAll,
  onReset,
  onSave,
}) {
  if (loading) {
    return null;
  }

  if (students.length === 0) {
    return (
      <div className="attendance-roster-panel">
        <div className="attendance-empty-box">
          <div className="attendance-empty-icon">
            <UserCheck size={24} />
          </div>
          <h3>No students in this batch</h3>
          <p>Assign students to this batch from the Students page.</p>
          <Link href="/students" className="primary-button">
            Assign students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="attendance-roster-panel">
      <div className="roster-toolbar">
        <div>
          <h2 className="roster-toolbar-title">
            {batchInfo ? `${batchInfo.name} — Student list` : "Student list"}
          </h2>
          <small style={{ color: "#777" }}>
            {unmarkedCount > 0
              ? `${unmarkedCount} student(s) unmarked`
              : "All students marked"}
          </small>
        </div>

        <div className="roster-quick-actions">
          <button
            type="button"
            className="quick-btn"
            onClick={() => onMarkAll("present")}
          >
            <CheckCircle2 size={14} style={{ color: "#166534" }} />
            Mark all present
          </button>

          <button
            type="button"
            className="quick-btn"
            onClick={() => onMarkAll("absent")}
          >
            <XCircle size={14} style={{ color: "#991b1b" }} />
            Mark all absent
          </button>

          <button
            type="button"
            className="quick-btn"
            onClick={onReset}
            title="Reload saved attendance"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="attendance-table-wrap">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Admission no.</th>
              <th>Phone</th>
              <th>Attendance status</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>
                  <div className="students-person">
                    <div className="students-avatar">
                      {(student.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="students-person-name">
                      {student.name}
                    </span>
                  </div>
                </td>

                <td>
                  <span className="students-admission-number">
                    {student.admissionNumber}
                  </span>
                </td>

                <td>{student.phone || "—"}</td>

                <td>
                  <div className="status-pill-group">
                    <button
                      type="button"
                      className={`status-toggle-btn ${
                        student.status === "present" ? "active-present" : ""
                      }`}
                      onClick={() =>
                        onStatusChange(student.studentId, "present")
                      }
                    >
                      Present
                    </button>

                    <button
                      type="button"
                      className={`status-toggle-btn ${
                        student.status === "late" ? "active-late" : ""
                      }`}
                      onClick={() =>
                        onStatusChange(student.studentId, "late")
                      }
                    >
                      Late
                    </button>

                    <button
                      type="button"
                      className={`status-toggle-btn ${
                        student.status === "absent" ? "active-absent" : ""
                      }`}
                      onClick={() =>
                        onStatusChange(student.studentId, "absent")
                      }
                    >
                      Absent
                    </button>
                  </div>
                </td>

                <td>
                  <input
                    type="text"
                    className="remarks-input"
                    placeholder="Optional note..."
                    value={student.remarks || ""}
                    onChange={(e) =>
                      onRemarksChange(student.studentId, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="roster-footer">
        <span style={{ fontSize: "11px", color: "#666" }}>
          Selected date:{" "}
          {new Date(selectedDate).toLocaleDateString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>

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
      </div>
    </section>
  );
}
