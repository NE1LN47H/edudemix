"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Users,
  BookOpen,
  CalendarCheck2,
  CreditCard,
  LoaderCircle,
  TrendingUp,
} from "lucide-react";
import "./ReportsPage.css";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        const res = await fetch("/api/reports", { cache: "no-store" });
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load reports");
        }
        setData(result.data);
      } catch (err) {
        setError(err.message || "Unable to load analytics data");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="students-state">
        <LoaderCircle className="students-spinner" size={28} />
        <p>Compiling analytics and reports...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="students-state">
        <Activity size={28} style={{ color: "#991b1b" }} />
        <h3>Unable to load reports</h3>
        <p>{error || "No data available."}</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE ANALYTICS</div>
          <h1>Centre Reports & Insights</h1>
          <p className="page-description">
            Comprehensive overview of student enrollment, batch capacities, attendance rates, and revenue.
          </p>
        </div>
      </section>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">TOTAL STUDENTS</span>
            <div className="metric-icon">
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">{data.students.total}</div>
          <div className="metric-bottom">
            <span className="metric-description">
              {data.students.active} actively enrolled
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">ACTIVE BATCHES</span>
            <div className="metric-icon">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="metric-value">{data.batches.total}</div>
          <div className="metric-bottom">
            <span className="metric-description">
              Running course cohorts
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">ATTENDANCE RATE</span>
            <div className="metric-icon">
              <CalendarCheck2 size={16} />
            </div>
          </div>
          <div className="metric-value">{data.attendance.rate}%</div>
          <div className="metric-bottom">
            <span className="metric-description">
              {data.attendance.totalMarked} records logged
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">FEE COLLECTION</span>
            <div className="metric-icon">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="metric-value" style={{ color: "#166534" }}>
            {data.finances.collectionRate}%
          </div>
          <div className="metric-bottom">
            <span className="metric-description">
              {formatCurrency(data.finances.totalCollected)} collected
            </span>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        {/* Batch Occupancy Card */}
        <section className="report-card">
          <div className="report-card-header">
            <h2>Batch Capacity Utilization</h2>
            <span style={{ fontSize: "11px", color: "#777" }}>
              {data.batches.occupancy.length} batches
            </span>
          </div>

          {data.batches.occupancy.length === 0 ? (
            <p style={{ color: "#888", fontSize: "12px" }}>No batches created yet.</p>
          ) : (
            <div>
              {data.batches.occupancy.map((b) => (
                <div key={b.id} className="occupancy-item">
                  <div className="occupancy-header">
                    <strong>{b.name}</strong>
                    <span>
                      {b.enrolled} / {b.capacity} students ({b.occupancyRate}%)
                    </span>
                  </div>
                  <div className="occupancy-bar-bg">
                    <div
                      className="occupancy-bar-fill"
                      style={{ width: `${b.occupancyRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Financial Summary Card */}
        <section className="report-card">
          <div className="report-card-header">
            <h2>Fee & Revenue Breakdown</h2>
            <span style={{ fontSize: "11px", color: "#166534", fontWeight: 600 }}>
              {formatCurrency(data.finances.totalCollected)}
            </span>
          </div>

          <div>
            <div className="breakdown-row">
              <span className="label">Total Invoiced</span>
              <span className="val">{formatCurrency(data.finances.totalInvoiced)}</span>
            </div>
            <div className="breakdown-row">
              <span className="label">Total Collected</span>
              <span className="val" style={{ color: "#166534" }}>
                {formatCurrency(data.finances.totalCollected)}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="label">Pending Dues</span>
              <span className="val" style={{ color: "#991b1b" }}>
                {formatCurrency(data.finances.totalPending)}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="label">Overall Collection Rate</span>
              <span className="val">{data.finances.collectionRate}%</span>
            </div>
          </div>
        </section>

        {/* Attendance Statistics Card */}
        <section className="report-card">
          <div className="report-card-header">
            <h2>Attendance Distribution</h2>
            <span style={{ fontSize: "11px", color: "#777" }}>
              {data.attendance.totalMarked} total logs
            </span>
          </div>

          <div>
            <div className="breakdown-row">
              <span className="label">Present Entries</span>
              <span className="val" style={{ color: "#166534" }}>
                {data.attendance.present}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="label">Absent Entries</span>
              <span className="val" style={{ color: "#991b1b" }}>
                {data.attendance.absent}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="label">Late Entries</span>
              <span className="val" style={{ color: "#854d0e" }}>
                {data.attendance.late}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="label">Effective Attendance Rate</span>
              <span className="val">{data.attendance.rate}%</span>
            </div>
          </div>
        </section>

        {/* Student Status Card */}
        <section className="report-card">
          <div className="report-card-header">
            <h2>Student Enrollment Status</h2>
            <span style={{ fontSize: "11px", color: "#777" }}>
              {data.students.total} students
            </span>
          </div>

          <div>
            {data.students.statusBreakdown.map((s) => (
              <div key={s.status} className="breakdown-row">
                <span className="label">{s.status}</span>
                <span className="val">{s.count}</span>
              </div>
            ))}
            {data.students.statusBreakdown.length === 0 && (
              <p style={{ color: "#888", fontSize: "12px" }}>No student records yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
