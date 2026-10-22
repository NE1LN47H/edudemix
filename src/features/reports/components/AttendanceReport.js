"use client";

export default function AttendanceReport({ attendance }) {
  return (
    <section className="report-card">
      <div className="report-card-header">
        <h2>Attendance Distribution</h2>
        <span style={{ fontSize: "11px", color: "#777" }}>
          {attendance.totalMarked} total logs
        </span>
      </div>

      <div>
        <div className="breakdown-row">
          <span className="label">Present Entries</span>
          <span className="val" style={{ color: "#166534" }}>
            {attendance.present}
          </span>
        </div>
        <div className="breakdown-row">
          <span className="label">Absent Entries</span>
          <span className="val" style={{ color: "#991b1b" }}>
            {attendance.absent}
          </span>
        </div>
        <div className="breakdown-row">
          <span className="label">Late Entries</span>
          <span className="val" style={{ color: "#854d0e" }}>
            {attendance.late}
          </span>
        </div>
        <div className="breakdown-row">
          <span className="label">Effective Attendance Rate</span>
          <span className="val">{attendance.rate}%</span>
        </div>
      </div>
    </section>
  );
}
