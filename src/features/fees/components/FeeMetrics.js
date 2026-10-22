"use client";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function FeeMetrics({ stats, collectionRate }) {
  return (
    <div className="fees-metrics">
      <div className="fees-metric-card">
        <span className="label">Total Invoiced</span>
        <span className="value">{formatCurrency(stats.totalInvoiced)}</span>
        <span className="sub">All-time invoices created</span>
      </div>

      <div className="fees-metric-card">
        <span className="label">Total Collected</span>
        <span className="value" style={{ color: "#166534" }}>
          {formatCurrency(stats.totalCollected)}
        </span>
        <span className="sub">{collectionRate}% collection rate</span>
      </div>

      <div className="fees-metric-card">
        <span className="label">Pending Dues</span>
        <span className="value" style={{ color: "#991b1b" }}>
          {formatCurrency(stats.totalPending)}
        </span>
        <span className="sub">
          {stats.pendingCount + stats.partialCount} pending invoices
        </span>
      </div>

      <div className="fees-metric-card">
        <span className="label">Fully Paid</span>
        <span className="value">{stats.paidCount}</span>
        <span className="sub">Cleared student invoices</span>
      </div>
    </div>
  );
}
