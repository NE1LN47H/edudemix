"use client";

import Link from "next/link";
import { TrendingUp, CreditCard } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

function formatCompact(val) {
  if (!val || val <= 0) return "0";
  if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `${Math.round(val / 1000)}k`;
  return String(Math.round(val));
}

export default function CollectionChart({
  totalCollected = 0,
  totalInvoiced = 0,
  collectionBars = [],
}) {
  const maxAmount = Math.max(
    ...collectionBars.map((b) => Math.max(b.current || 0, b.previous || 0)),
    0
  );

  const roundMax = maxAmount > 0 ? (maxAmount >= 1000 ? Math.ceil(maxAmount / 1000) * 1000 : maxAmount) : 0;
  const gridSteps = roundMax > 0
    ? [
        formatCompact(roundMax),
        formatCompact(roundMax * 0.75),
        formatCompact(roundMax * 0.5),
        formatCompact(roundMax * 0.25),
        "0",
      ]
    : ["—", "—", "—", "—", "0"];

  const hasAnyData = totalCollected > 0 || totalInvoiced > 0 || maxAmount > 0;

  return (
    <div className="panel collection-panel">
      <div className="panel-header">
        <div>
          <h2>Fee Collections & Trends</h2>
          <p>Monthly fee inflow vs invoiced amounts</p>
        </div>
        <Link href="/fees" className="select-button">
          View all fees
        </Link>
      </div>

      <div className="chart-summary">
        <div>
          <div className="chart-total">
            <AnimatedCounter value={totalCollected} isCurrency duration={1200} />
          </div>
          <div className="chart-subtitle">
            {totalCollected > 0 ? (
              <span className="positive-text">
                <TrendingUp size={13} /> Realized collections
              </span>
            ) : (
              <span style={{ color: "#737373" }}>
                <CreditCard size={13} style={{ verticalAlign: "middle", display: "inline" }} /> Total collected
              </span>
            )}
            <span>
              • Invoiced: <AnimatedCounter value={totalInvoiced} isCurrency duration={1200} />
            </span>
          </div>
        </div>

        <div className="chart-legend">
          <span className="legend-dot current" />
          <span>Collected</span>
          <span className="legend-dot previous" />
          <span>Invoiced</span>
        </div>
      </div>

      <div className="chart" style={{ position: "relative" }}>
        <div className="chart-gridlines">
          {gridSteps.map((step, idx) => (
            <div key={idx}>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="chart-bars">
          {collectionBars.map((bar) => {
            const hasValues = (bar.current || 0) > 0 || (bar.previous || 0) > 0;
            return (
              <div
                key={bar.month}
                className="bar-group"
                title={`${bar.month}: Collected ₹${(bar.current || 0).toLocaleString("en-IN")}, Invoiced ₹${(bar.previous || 0).toLocaleString("en-IN")}`}
              >
                <div className="bar-pair">
                  <div
                    className="bar previous-bar"
                    style={{
                      height: `${bar.invoicedHeightPercent || 0}%`,
                      opacity: bar.invoicedHeightPercent > 0 ? 1 : 0.2,
                    }}
                  />
                  <div
                    className="bar current-bar"
                    style={{
                      height: `${bar.heightPercent || 0}%`,
                      opacity: bar.heightPercent > 0 ? 1 : 0.2,
                    }}
                  />
                </div>
                <span className="bar-label">{bar.month}</span>
              </div>
            );
          })}
        </div>

        {!hasAnyData && (
          <div
            style={{
              position: "absolute",
              inset: "40px 20px 30px 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              background: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(2px)",
              borderRadius: "8px",
              textAlign: "center",
              padding: "16px",
              pointerEvents: "none",
            }}
          >
            <p style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 600, color: "#171717" }}>
              No collections recorded yet
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#737373", maxWidth: "260px" }}>
              Invoices and recorded student fee payments will appear here in the monthly trend chart.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
