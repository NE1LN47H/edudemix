"use client";

import Link from "next/link";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function AttendanceDonut({
  attendanceRate = 0,
  presentToday = 0,
  absentToday = 0,
  markedToday = 0,
  totalMarkedEver = 0,
  overallAttendanceRate = 0,
  overallPresent = 0,
  overallAbsent = 0,
}) {
  const isTodayMarked = markedToday > 0;
  const hasAnyRecords = isTodayMarked || totalMarkedEver > 0;
  const displayRate = isTodayMarked
    ? attendanceRate
    : hasAnyRecords
    ? overallAttendanceRate
    : 0;

  const displayPresent = isTodayMarked ? presentToday : hasAnyRecords ? overallPresent : 0;
  const displayAbsent = isTodayMarked ? absentToday : hasAnyRecords ? overallAbsent : 0;
  const centerLabel = isTodayMarked ? "Today" : hasAnyRecords ? "Overall" : "No Data";

  const dashArrayLength = 238.76;
  const strokeLength = (Math.max(0, Math.min(100, displayRate)) / 100) * dashArrayLength;

  return (
    <div className="panel attendance-panel">
      <div className="panel-header">
        <div>
          <h2>Attendance Status</h2>
          <p>
            {isTodayMarked
              ? "Today's student participation rate"
              : hasAnyRecords
              ? "Overall centre attendance rate"
              : "No attendance records logged yet"}
          </p>
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
          {displayRate > 0 && (
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#171717"
              strokeWidth="11"
              strokeDasharray={`${strokeLength} ${dashArrayLength}`}
              strokeDashoffset="60"
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="donut-center">
          <strong>
            <AnimatedCounter value={displayRate} suffix="%" duration={1100} />
          </strong>
          <span>{centerLabel}</span>
        </div>
      </div>

      <div className="attendance-legend">
        <div>
          <span className="legend-square present" />
          <span>Present {isTodayMarked ? "today" : "(total)"}</span>
          <strong>
            <AnimatedCounter value={displayPresent} duration={1000} />
          </strong>
        </div>

        <div>
          <span className="legend-square absent" />
          <span>Absent {isTodayMarked ? "today" : "(total)"}</span>
          <strong>
            <AnimatedCounter value={displayAbsent} duration={1000} />
          </strong>
        </div>
      </div>

      {!isTodayMarked && (
        <div style={{ marginTop: "10px", fontSize: "11px", color: "#737373" }}>
          {hasAnyRecords
            ? "Today's attendance not yet taken."
            : "Take daily attendance to track attendance trends."}
        </div>
      )}

      <Link href="/attendance" className="text-link" style={{ marginTop: "12px" }}>
        {isTodayMarked ? "Manage daily attendance" : "Mark attendance now"} <span>→</span>
      </Link>
    </div>
  );
}
