"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function FeeMetrics({ stats, collectionRate }) {
  return (
    <div className="fees-metrics">
      <div className="fees-metric-card">
        <span className="label">Total Invoiced</span>
        <span className="value">
          <AnimatedCounter value={stats.totalInvoiced} isCurrency duration={1100} />
        </span>
        <span className="sub">All-time invoices created</span>
      </div>

      <div className="fees-metric-card">
        <span className="label">Total Collected</span>
        <span className="value" style={{ color: "#166534" }}>
          <AnimatedCounter value={stats.totalCollected} isCurrency duration={1100} />
        </span>
        <span className="sub">
          <AnimatedCounter value={collectionRate} suffix="%" duration={1000} /> collection rate
        </span>
      </div>

      <div className="fees-metric-card">
        <span className="label">Pending Dues</span>
        <span className="value" style={{ color: "#991b1b" }}>
          <AnimatedCounter value={stats.totalPending} isCurrency duration={1100} />
        </span>
        <span className="sub">
          <AnimatedCounter
            value={(stats.pendingCount || 0) + (stats.partialCount || 0) + (stats.overdueCount || 0)}
            duration={900}
          />{" "}
          unpaid / pending invoices
        </span>
      </div>

      <div className="fees-metric-card">
        <span className="label">Fully Paid</span>
        <span className="value">
          <AnimatedCounter value={stats.paidCount} duration={900} />
        </span>
        <span className="sub">Cleared student invoices</span>
      </div>
    </div>
  );
}
