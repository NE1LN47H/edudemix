"use client";

import {
  Users,
  BookOpen,
  CalendarDays,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

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
        <div className="metric-value">
          <AnimatedCounter value={metrics.totalStudents} duration={1000} />
        </div>
        <div className="metric-bottom">
          <span className="metric-change up">
            <TrendingUp size={12} />
            Active
          </span>
          <span className="metric-description">
            <AnimatedCounter value={metrics.activeStudents} duration={900} /> enrolled in courses
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
          <AnimatedCounter value={metrics.activeBatches} duration={900} />
        </div>
        <div className="metric-bottom">
          <span className="metric-description">Running course cohorts</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-top">
          <span className="metric-label">
            {metrics.markedToday > 0
              ? "TODAY'S ATTENDANCE"
              : metrics.totalMarkedEver > 0
              ? "OVERALL ATTENDANCE"
              : "TODAY'S ATTENDANCE"}
          </span>
          <div className="metric-icon">
            <CalendarDays size={16} />
          </div>
        </div>
        <div className="metric-value">
          <AnimatedCounter
            value={metrics.markedToday > 0 ? metrics.attendanceRate : (metrics.totalMarkedEver > 0 ? metrics.overallAttendanceRate : 0)}
            suffix="%"
            duration={1100}
          />
        </div>
        <div className="metric-bottom">
          <span className="metric-description">
            {metrics.markedToday > 0 ? (
              <>
                <AnimatedCounter value={metrics.presentToday} duration={1000} /> present of {metrics.markedToday} today
              </>
            ) : metrics.totalMarkedEver > 0 ? (
              <>
                Overall across all recorded sessions
              </>
            ) : (
              "No attendance recorded yet"
            )}
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
          <AnimatedCounter value={metrics.totalCollected || 0} isCurrency duration={1200} />
        </div>
        <div className="metric-bottom">
          <span className="metric-description">
            Pending dues: <AnimatedCounter value={metrics.totalPending || 0} isCurrency duration={1200} />
          </span>
        </div>
      </div>
    </section>
  );
}

