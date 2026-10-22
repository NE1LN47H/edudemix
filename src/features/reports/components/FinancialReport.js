"use client";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function FinancialReport({ finances }) {
  return (
    <section className="report-card">
      <div className="report-card-header">
        <h2>Fee & Revenue Breakdown</h2>
        <span style={{ fontSize: "11px", color: "#166534", fontWeight: 600 }}>
          {formatCurrency(finances.totalCollected)}
        </span>
      </div>

      <div>
        <div className="breakdown-row">
          <span className="label">Total Invoiced</span>
          <span className="val">
            {formatCurrency(finances.totalInvoiced)}
          </span>
        </div>
        <div className="breakdown-row">
          <span className="label">Total Collected</span>
          <span className="val" style={{ color: "#166534" }}>
            {formatCurrency(finances.totalCollected)}
          </span>
        </div>
        <div className="breakdown-row">
          <span className="label">Pending Dues</span>
          <span className="val" style={{ color: "#991b1b" }}>
            {formatCurrency(finances.totalPending)}
          </span>
        </div>
        <div className="breakdown-row">
          <span className="label">Overall Collection Rate</span>
          <span className="val">{finances.collectionRate}%</span>
        </div>
      </div>
    </section>
  );
}
