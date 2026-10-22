"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  CalendarDays,
  CreditCard,
  Plus,
  ArrowRight,
  LoaderCircle,
  TrendingUp,
} from "lucide-react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export default function OverviewDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard overview", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="students-state">
        <LoaderCircle className="students-spinner" size={28} />
        <p>Loading your centre overview...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalStudents: 0,
    activeStudents: 0,
    activeBatches: 0,
    attendanceRate: 0,
    presentToday: 0,
    absentToday: 0,
    totalCollected: 0,
    totalPending: 0,
  };

  const activeBatches = data?.activeBatches || [];
  const recentActivity = data?.recentActivity || [];
  const recentAdmissions = data?.recentAdmissions || [];

  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="live-dot" />
            LIVE WORKSPACE
          </div>
          <h1>Overview</h1>
          <p className="page-description">
            Your coaching centre at a glance — student progress, schedules, and collections.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/students" className="primary-button">
            <Plus size={15} />
            Add student
          </Link>
          <Link href="/attendance" className="select-button">
            <CalendarDays size={14} />
            Mark attendance
          </Link>
        </div>
      </section>

      {/* 4 Metric Cards */}
      <section className="metrics-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">TOTAL STUDENTS</span>
            <div className="metric-icon">
              <Users size={16} />
            </div>
          </div>
          <div className="metric-value">{metrics.totalStudents}</div>
          <div className="metric-bottom">
            <span className="metric-change up">
              <TrendingUp size={12} />
              Active
            </span>
            <span className="metric-description">
              {metrics.activeStudents} enrolled in courses
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
          <div className="metric-value">{metrics.activeBatches}</div>
          <div className="metric-bottom">
            <span className="metric-description">
              Running course cohorts
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">TODAY&apos;S ATTENDANCE</span>
            <div className="metric-icon">
              <CalendarDays size={16} />
            </div>
          </div>
          <div className="metric-value">{metrics.attendanceRate}%</div>
          <div className="metric-bottom">
            <span className="metric-description">
              {metrics.presentToday} present today
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-label">TOTAL REVENUE</span>
            <div className="metric-icon">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="metric-value">
            {formatCurrency(metrics.totalCollected)}
          </div>
          <div className="metric-bottom">
            <span className="metric-description">
              Pending dues: {formatCurrency(metrics.totalPending)}
            </span>
          </div>
        </div>
      </section>

      {/* Content Grid: Financial Chart & Attendance Donut */}
      <section className="content-grid">
        <div className="panel collection-panel">
          <div className="panel-header">
            <div>
              <h2>Fee Collections & Trends</h2>
              <p>Monthly fee inflow comparison across academic terms</p>
            </div>
            <Link href="/fees" className="select-button">
              View all fees
            </Link>
          </div>

          <div className="chart-summary">
            <div>
              <div className="chart-total">
                {formatCurrency(metrics.totalCollected)}
              </div>
              <div className="chart-subtitle">
                <span className="positive-text">
                  <TrendingUp size={13} /> Current Term
                </span>
                <span>• Invoiced: {formatCurrency(metrics.totalInvoiced)}</span>
              </div>
            </div>

            <div className="chart-legend">
              <span className="legend-dot current" />
              <span>Current</span>
              <span className="legend-dot previous" />
              <span>Previous</span>
            </div>
          </div>

          <div className="chart">
            <div className="chart-gridlines">
              <div><span>80k</span></div>
              <div><span>60k</span></div>
              <div><span>40k</span></div>
              <div><span>20k</span></div>
              <div><span>0</span></div>
            </div>

            <div className="chart-bars">
              {(data?.collectionBars || [
                { month: "May", heightPercent: 35 },
                { month: "Jun", heightPercent: 55 },
                { month: "Jul", heightPercent: 70 },
                { month: "Aug", heightPercent: 85 },
                { month: "Sep", heightPercent: 65 },
                { month: "Oct", heightPercent: 95 },
              ]).map((bar) => (
                <div key={bar.month} className="bar-group">
                  <div className="bar-pair">
                    <div
                      className="bar previous-bar"
                      style={{ height: `${Math.max(10, bar.heightPercent * 0.75)}%` }}
                    />
                    <div
                      className="bar current-bar"
                      style={{ height: `${bar.heightPercent}%` }}
                    />
                  </div>
                  <span className="bar-label">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel attendance-panel">
          <div className="panel-header">
            <div>
              <h2>Attendance Status</h2>
              <p>Daily student participation rate</p>
            </div>
          </div>

          <div className="attendance-visual">
            <svg className="donut-chart" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ededed"
                strokeWidth="11"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#171717"
                strokeWidth="11"
                strokeDasharray={`${(metrics.attendanceRate / 100) * 238.76} 238.76`}
                strokeDashoffset="60"
                strokeLinecap="round"
              />
            </svg>
            <div className="donut-center">
              <strong>{metrics.attendanceRate}%</strong>
              <span>Today</span>
            </div>
          </div>

          <div className="attendance-legend">
            <div>
              <span className="legend-square present" />
              <span>Present students</span>
              <strong>{metrics.presentToday}</strong>
            </div>

            <div>
              <span className="legend-square absent" />
              <span>Absent students</span>
              <strong>{metrics.absentToday}</strong>
            </div>
          </div>

          <Link href="/attendance" className="text-link">
            Open daily attendance <span>→</span>
          </Link>
        </div>
      </section>

      {/* Bottom Grid: Recent Activity & Active Batches */}
      <section className="bottom-grid">
        <div className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h2>Recent Payments & Activity</h2>
              <p>Latest transactions and admissions recorded</p>
            </div>
            <Link href="/fees" className="select-button">
              View all
            </Link>
          </div>

          <div className="table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Fee Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="amount-heading">Amount</th>
                </tr>
              </thead>

              <tbody>
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      No recent activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((item, idx) => (
                    <tr key={item.id}>
                      <td>
                        <div className="student-cell">
                          <div className={`student-avatar ${["violet", "blue", "green", "orange"][idx % 4]}`}>
                            {item.studentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{item.studentName}</strong>
                            <div style={{ color: "#888", fontSize: "10px" }}>
                              {item.admissionNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="muted-cell">{item.title}</td>
                      <td>
                        <span className={`status-pill status-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="muted-cell">{formatDate(item.date)}</td>
                      <td className="amount-cell">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel batches-panel">
          <div className="panel-header">
            <div>
              <h2>Active Batches</h2>
              <p>Capacity and enrolled student counts</p>
            </div>
            <Link href="/batches" className="select-button">
              View all
            </Link>
          </div>

          <div className="batch-list">
            {activeBatches.length === 0 ? (
              <p style={{ color: "#888", fontSize: "12px", padding: "20px 0" }}>
                No active batches found.
              </p>
            ) : (
              activeBatches.map((batch) => (
                <div key={batch._id} className="batch-item">
                  <div className="batch-title-row">
                    <div className="batch-symbol">
                      <BookOpen size={16} />
                    </div>
                    <div className="batch-main">
                      <strong>{batch.name}</strong>
                      <span>{batch.courseName}</span>
                    </div>
                    <span className="batch-student-count">
                      {batch.enrolled}/{batch.capacity}
                    </span>
                  </div>

                  <div className="batch-time">
                    {batch.startTime ? `${batch.startTime} – ${batch.endTime || ""}` : "Regular Schedule"}
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-value"
                      style={{ width: `${batch.percent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="batch-footer">
            <Link href="/batches" className="text-link">
              Manage batches & schedules <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
