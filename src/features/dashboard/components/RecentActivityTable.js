"use client";

import Link from "next/link";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export default function RecentActivityTable({ recentActivity }) {
  return (
    <div className="panel activity-panel">
      <div className="panel-header">
        <div>
          <h2>Recent Payments & Activity</h2>
          <p>Latest transactions and admissions recorded</p>
        </div>
        <Link href="/fees" className="select-button">
          View all
        </Link>
      </div>

      <div className="table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Fee Title</th>
              <th>Status</th>
              <th>Date</th>
              <th className="amount-heading">Amount</th>
            </tr>
          </thead>

          <tbody>
            {recentActivity.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No recent activity recorded yet.
                </td>
              </tr>
            ) : (
              recentActivity.map((item, idx) => (
                <tr
                  key={item.id}
                  className="stagger-row"
                  style={{ animationDelay: `${Math.min(idx * 30, 240)}ms` }}
                >
                  <td>
                    <div className="student-cell">
                      <div
                        className={`student-avatar ${
                          ["violet", "blue", "green", "orange"][idx % 4]
                        }`}
                      >
                        {item.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{item.studentName}</strong>
                        <div style={{ color: "#888", fontSize: "10px" }}>
                          {item.admissionNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="muted-cell">{item.title}</td>
                  <td>
                    <span className={`status-pill status-${item.status}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="muted-cell">{formatDate(item.date)}</td>
                  <td className="amount-cell">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
