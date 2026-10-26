"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Layers3 } from "lucide-react";
import AttendanceFilters from "./components/AttendanceFilters";
import AttendanceStats from "./components/AttendanceStats";
import AttendanceTable from "./components/AttendanceTable";
import NoticeBanner from "@/components/ui/NoticeBanner";
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const abortControllerRef = useRef(null);
  const currentRequestRef = useRef(0);

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

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const requestId = ++currentRequestRef.current;

    setLoadingAttendance(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `/api/attendance?batchId=${selectedBatchId}&date=${selectedDate}`,
        { cache: "no-store", signal: controller.signal }
      );
      const result = await res.json();

      if (requestId !== currentRequestRef.current) return;

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load attendance records");
      }

      const data = result.data;
      setBatchInfo(data.batch);
      setStudents(data.attendance || []);
    } catch (err) {
      if (err.name === "AbortError" || requestId !== currentRequestRef.current) {
        return;
      }
      setError(err.message || "Unable to load attendance");
      setStudents([]);
    } finally {
      if (requestId === currentRequestRef.current) {
        setLoadingAttendance(false);
      }
    }
  }, [selectedBatchId, selectedDate]);

  useEffect(() => {
    if (!selectedBatchId) return;

    const timeout = setTimeout(() => {
      loadAttendance();
    }, 0);

    return () => clearTimeout(timeout);
  }, [selectedBatchId, selectedDate, loadAttendance]);

  function handleStatusChange(studentId, newStatus) {
    setStudents((prev) =>
      prev.map((item) =>
        item.studentId === studentId
          ? { ...item, status: item.status === newStatus ? null : newStatus }
          : item
      )
    );
  }

  function handleRemarksChange(studentId, remarks) {
    setStudents((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, remarks } : item
      )
    );
  }

  function markAll(status) {
    setStudents((prev) =>
      prev.map((item) => ({
        ...item,
        status,
      }))
    );
  }

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

  async function handleSaveAttendance() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
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

      <AttendanceFilters
        batches={batches}
        selectedBatchId={selectedBatchId}
        selectedDate={selectedDate}
        loadingBatches={loadingBatches}
        saving={saving}
        hasStudents={students.length > 0}
        onBatchChange={setSelectedBatchId}
        onDateChange={setSelectedDate}
        onSave={handleSaveAttendance}
      />

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
          <AttendanceStats
            total={total}
            present={computedSummary.present}
            absent={computedSummary.absent}
            attendanceRate={attendanceRate}
          />

          <AttendanceTable
            students={students}
            batchInfo={batchInfo}
            selectedDate={selectedDate}
            loading={loadingAttendance}
            saving={saving}
            unmarkedCount={computedSummary.unmarked}
            onStatusChange={handleStatusChange}
            onRemarksChange={handleRemarksChange}
            onMarkAll={markAll}
            onReset={loadAttendance}
            onSave={handleSaveAttendance}
          />
        </>
      )}
    </div>
  );
}
