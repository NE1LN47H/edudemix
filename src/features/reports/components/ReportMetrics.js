"use client";

import { Users, BookOpen, CalendarCheck2, CreditCard } from "lucide-react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function ReportMetrics({ data }) {
  return (
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
  );
}
