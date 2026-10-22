"use client";

import {
  Users,
  BookOpen,
  CalendarDays,
  CreditCard,
  TrendingUp,
} from "lucide-react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function MetricsRow({ metrics }) {
  return (
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
          <span className="metric-description">Running course cohorts</span>
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
  );
}
