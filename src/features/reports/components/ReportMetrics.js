"use client";

import { Users, BookOpen, CalendarCheck2, CreditCard } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

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
        <div className="metric-value">
          <AnimatedCounter value={data.students.total} duration={1000} />
        </div>
        <div className="metric-bottom">
          <span className="metric-description">
            <AnimatedCounter value={data.students.active} duration={900} /> actively enrolled
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
        <div className="metric-value">
          <AnimatedCounter value={data.batches.total} duration={900} />
        </div>
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
        <div className="metric-value">
          <AnimatedCounter value={data.attendance.rate} suffix="%" duration={1100} />
        </div>
        <div className="metric-bottom">
          <span className="metric-description">
            <AnimatedCounter value={data.attendance.totalMarked} duration={1000} /> records logged
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
          <AnimatedCounter value={data.finances.collectionRate} suffix="%" duration={1100} />
        </div>
        <div className="metric-bottom">
          <span className="metric-description">
            <AnimatedCounter value={data.finances.totalCollected} isCurrency duration={1200} /> collected
          </span>
        </div>
      </div>
    </div>
  );
}
