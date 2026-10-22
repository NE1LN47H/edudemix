"use client";

import Link from "next/link";

export default function AttendanceDonut({
  attendanceRate,
  presentToday,
  absentToday,
}) {
  return (
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
            strokeDasharray={`${(attendanceRate / 100) * 238.76} 238.76`}
            strokeDashoffset="60"
            strokeLinecap="round"
          />
        </svg>
        <div className="donut-center">
          <strong>{attendanceRate}%</strong>
          <span>Today</span>
        </div>
      </div>

      <div className="attendance-legend">
        <div>
          <span className="legend-square present" />
          <span>Present students</span>
          <strong>{presentToday}</strong>
        </div>

        <div>
          <span className="legend-square absent" />
          <span>Absent students</span>
          <strong>{absentToday}</strong>
        </div>
      </div>

      <Link href="/attendance" className="text-link">
        Open daily attendance <span>→</span>
      </Link>
    </div>
  );
}
