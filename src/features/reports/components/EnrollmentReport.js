"use client";

export default function EnrollmentReport({ students }) {
  return (
    <section className="report-card">
      <div className="report-card-header">
        <h2>Student Enrollment Status</h2>
        <span style={{ fontSize: "11px", color: "#777" }}>
          {students.total} students
        </span>
      </div>

      <div>
        {students.statusBreakdown.map((s) => (
          <div key={s.status} className="breakdown-row">
            <span className="label">{s.status}</span>
            <span className="val">{s.count}</span>
          </div>
        ))}
        {students.statusBreakdown.length === 0 && (
          <p style={{ color: "#888", fontSize: "12px" }}>No student records yet.</p>
        )}
      </div>
    </section>
  );
}
