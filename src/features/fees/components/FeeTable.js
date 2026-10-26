"use client";

import { Trash2 } from "lucide-react";

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
    year: "numeric",
  });
}

export default function FeeTable({
  fees,
  onOpenPayment,
  onDeleteFee,
}) {
  return (
    <div className="fees-table-wrap">
      <table className="fees-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Batch</th>
            <th>Title</th>
            <th>Due Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Receipt #</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((fee, idx) => {
            const balance = Math.max(0, fee.amount - (fee.paidAmount || 0));
            return (
              <tr
                key={fee._id}
                className="stagger-row"
                style={{ animationDelay: `${Math.min(idx * 28, 200)}ms` }}
              >
                <td>
                  <div className="students-person">
                    <div className="students-avatar">
                      {(fee.studentId?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="students-person-info">
                      <span className="students-person-name">
                        {fee.studentId?.name || "Unknown student"}
                      </span>
                      <span className="students-person-email">
                        {fee.studentId?.admissionNumber || "—"}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  {fee.batchId?.name ? (
                    <span className="student-batch-tag">
                      {fee.batchId.name}
                    </span>
                  ) : (
                    <span className="student-batch-unassigned">None</span>
                  )}
                </td>

                <td>{fee.title}</td>

                <td>{formatDate(fee.dueDate)}</td>

                <td style={{ fontWeight: 600 }}>
                  {formatCurrency(fee.amount)}
                </td>

                <td style={{ color: "#166534", fontWeight: 550 }}>
                  {formatCurrency(fee.paidAmount)}
                </td>

                <td
                  style={{
                    color: balance > 0 ? "#991b1b" : "#666",
                    fontWeight: 550,
                  }}
                >
                  {formatCurrency(balance)}
                </td>

                <td>
                  <span className={`status-badge status-${fee.status}`}>
                    {fee.status}
                  </span>
                </td>

                <td>
                  {fee.receiptNumber ? (
                    <span className="receipt-tag">{fee.receiptNumber}</span>
                  ) : (
                    "—"
                  )}
                </td>

                <td>
                  <div className="student-actions-cell">
                    {fee.status !== "paid" && (
                      <button
                        type="button"
                        className="fee-pay-btn"
                        onClick={() => onOpenPayment(fee)}
                        title="Record payment"
                      >
                        Record pay
                      </button>
                    )}

                    <button
                      type="button"
                      className="student-action-btn delete"
                      onClick={() => onDeleteFee(fee)}
                      title="Delete fee"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
