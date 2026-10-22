"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  LoaderCircle,
  X,
  Layers3,
  UserCheck,
  Save,
  RotateCcw,
} from "lucide-react";
import "./AttendancePage.css";

export default function AttendancePage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [loadingBatches, setLoadingBatches] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [saving, setSaving] = useState(false);

  const [students, setStudents] = useState([]);
  const [batchInfo, setBatchInfo] = useState(null);
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    unmarked: 0,
    percentage: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load batches on component mount
  useEffect(() => {
    async function fetchBatches() {
      try {
        setLoadingBatches(true);
        const res = await fetch("/api/batches?limit=100", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.batches?.length > 0) {
          setBatches(data.batches);
          setSelectedBatchId(data.batches[0]._id);
        }
      } catch (err) {
        setError(err.message || "Failed to load batches");
      } finally {
        setLoadingBatches(false);
      }
    }

    fetchBatches();
  }, []);

  // Fetch attendance records when batch or date changes
  const loadAttendance = useCallback(async () => {
    if (!selectedBatchId) return;

    setLoadingAttendance(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `/api/attendance?batchId=${selectedBatchId}&date=${selectedDate}`,
        { cache: "no-store" }
      );
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load attendance records");
      }

      const data = result.data;
      setBatchInfo(data.batch);
      setStudents(data.attendance || []);
      setSummary(data.summary || { present: 0, absent: 0, late: 0, unmarked: 0, percentage: 0 });
    } catch (err) {
      setError(err.message || "Unable to load attendance");
      setStudents([]);
    } finally {
      setLoadingAttendance(false);
    }
  }, [selectedBatchId, selectedDate]);

  useEffect(() => {
    if (!selectedBatchId) return;

    const timeout = setTimeout(() => {
      loadAttendance();
    }, 0);

    return () => clearTimeout(timeout);
  }, [selectedBatchId, selectedDate, loadAttendance]);

  // Update status for a specific student
  function handleStatusChange(studentId, newStatus) {
    setStudents((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? { ...item, status: item.status === newStatus ? null : newStatus }
          : item
      )
    );
  }

  // Update remarks for a specific student
  function handleRemarksChange(studentId, remarks) {
    setStudents((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  }

  // Mark all students as present
  function markAll(status) {
    setStudents((prev) =>
      prev.map((item) => ({
        ...item,
        status,
      }))
    );
  }

  // Calculate dynamic summary stats from state
  const computedSummary = students.reduce(
    (acc, cur) => {
      if (cur.status === "present") acc.present++;
      else if (cur.status === "absent") acc.absent++;
      else if (cur.status === "late") acc.late++;
      else acc.unmarked++;
      return acc;
    },
    { present: 0, absent: 0, late: 0, unmarked: 0 }
  );

  const total = students.length;
  const attendanceRate =
    total > 0
      ? Math.round(((computedSummary.present + computedSummary.late) / total) * 100)
      : 0;

  // Submit attendance to API
  async function handleSaveAttendance() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Filter students that have a status set
      const attendancePayload = students
        .filter((s) => s.status !== null)
        .map((s) => ({
          studentId: s.studentId,
          status: s.status,
          remarks: s.remarks || "",
        }));

      if (attendancePayload.length === 0) {
        throw new Error("Please mark attendance for at least one student before saving.");
      }

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: selectedBatchId,
          date: selectedDate,
          attendance: attendancePayload,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to save attendance.");
      }

      setSuccess(`Attendance saved for ${result.data.total} student(s).`);
      await loadAttendance();
    } catch (err) {
      setError(err.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="attendance-page-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE</div>
          <h1>Attendance</h1>
          <p className="page-description">
            Track daily student attendance, status, and class participation.
          </p>
        </div>
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

      <div className="attendance-filters-card">
        <div className="attendance-filter-group">
          <div className="attendance-field">
            <label htmlFor="batchSelect">Select batch</label>
            <select
              id="batchSelect"
              className="attendance-select"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
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
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {students.length > 0 && (
          <button
            type="button"
            className="attendance-save-btn"
            onClick={handleSaveAttendance}
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

      {batches.length === 0 && !loadingBatches ? (
        <div className="panel attendance-empty-box">
          <div className="attendance-empty-icon">
            <Layers3 size={24} />
          </div>
          <h3>No batches created yet</h3>
          <p>You need to create a batch before taking attendance.</p>
          <Link href="/batches" className="primary-button">
            Go to batches
          </Link>
        </div>
      ) : (
        <>
          <div className="attendance-stats-row">
            <div className="attendance-stat-box">
              <span className="attendance-stat-label">Total enrolled</span>
              <span className="attendance-stat-value">{total}</span>
            </div>

            <div className="attendance-stat-box">
              <span className="attendance-stat-label">Present</span>
              <span className="attendance-stat-value stat-present">
                {computedSummary.present}
              </span>
            </div>

            <div className="attendance-stat-box">
              <span className="attendance-stat-label">Absent</span>
              <span className="attendance-stat-value stat-absent">
                {computedSummary.absent}
              </span>
            </div>

            <div className="attendance-stat-box">
              <span className="attendance-stat-label">Attendance rate</span>
              <span className="attendance-stat-value">
                {attendanceRate}%
              </span>
            </div>
          </div>

          <section className="attendance-roster-panel">
            <div className="roster-toolbar">
              <div>
                <h2 className="roster-toolbar-title">
                  {batchInfo ? `${batchInfo.name} — Student list` : "Student list"}
                </h2>
                <small style={{ color: "#777" }}>
                  {computedSummary.unmarked > 0
                    ? `${computedSummary.unmarked} student(s) unmarked`
                    : "All students marked"}
                </small>
              </div>

              {students.length > 0 && (
                <div className="roster-quick-actions">
                  <button
                    type="button"
                    className="quick-btn"
                    onClick={() => markAll("present")}
                  >
                    <CheckCircle2 size={14} style={{ color: "#166534" }} />
                    Mark all present
                  </button>

                  <button
                    type="button"
                    className="quick-btn"
                    onClick={() => markAll("absent")}
                  >
                    <XCircle size={14} style={{ color: "#991b1b" }} />
                    Mark all absent
                  </button>

                  <button
                    type="button"
                    className="quick-btn"
                    onClick={loadAttendance}
                    title="Reload saved attendance"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                </div>
              )}
            </div>

            {loadingAttendance ? (
              <div className="students-state">
                <LoaderCircle className="students-spinner" size={25} />
                <p>Loading student roster...</p>
              </div>
            ) : students.length === 0 ? (
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
            ) : (
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
                                student.status === "present"
                                  ? "active-present"
                                  : ""
                              }`}
                              onClick={() =>
                                handleStatusChange(student.studentId, "present")
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
                                handleStatusChange(student.studentId, "late")
                              }
                            >
                              Late
                            </button>

                            <button
                              type="button"
                              className={`status-toggle-btn ${
                                student.status === "absent"
                                  ? "active-absent"
                                  : ""
                              }`}
                              onClick={() =>
                                handleStatusChange(student.studentId, "absent")
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
                              handleRemarksChange(
                                student.studentId,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {students.length > 0 && (
              <div className="roster-footer">
                <span style={{ fontSize: "11px", color: "#666" }}>
                  Selected date: {new Date(selectedDate).toLocaleDateString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                <button
                  type="button"
                  className="attendance-save-btn"
                  onClick={handleSaveAttendance}
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
            )}
          </section>
        </>
      )}
    </div>
  );
}
