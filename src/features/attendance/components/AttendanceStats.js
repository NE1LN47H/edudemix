"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function AttendanceStats({
  total,
  present,
  absent,
  attendanceRate,
}) {
  return (
    <div className="attendance-stats-row">
      <div className="attendance-stat-box">
        <span className="attendance-stat-label">Total enrolled</span>
        <span className="attendance-stat-value">
          <AnimatedCounter value={total} />
        </span>
      </div>

      <div className="attendance-stat-box">
        <span className="attendance-stat-label">Present</span>
        <span className="attendance-stat-value stat-present">
          <AnimatedCounter value={present} />
        </span>
      </div>

      <div className="attendance-stat-box">
        <span className="attendance-stat-label">Absent</span>
        <span className="attendance-stat-value stat-absent">
          <AnimatedCounter value={absent} />
        </span>
      </div>

      <div className="attendance-stat-box">
        <span className="attendance-stat-label">Attendance rate</span>
        <span className="attendance-stat-value">
          <AnimatedCounter value={attendanceRate} suffix="%" />
        </span>
      </div>
    </div>
  );
}
