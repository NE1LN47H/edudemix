"use client";

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
        <span className="attendance-stat-value">{total}</span>
      </div>

      <div className="attendance-stat-box">
        <span className="attendance-stat-label">Present</span>
        <span className="attendance-stat-value stat-present">{present}</span>
      </div>

      <div className="attendance-stat-box">
        <span className="attendance-stat-label">Absent</span>
        <span className="attendance-stat-value stat-absent">{absent}</span>
      </div>

      <div className="attendance-stat-box">
        <span className="attendance-stat-label">Attendance rate</span>
        <span className="attendance-stat-value">{attendanceRate}%</span>
      </div>
    </div>
  );
}
