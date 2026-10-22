"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export default function CollectionChart({
  totalCollected,
  totalInvoiced,
  collectionBars,
}) {
  return (
    <div className="panel collection-panel">
      <div className="panel-header">
        <div>
          <h2>Fee Collections & Trends</h2>
          <p>Monthly fee inflow comparison across academic terms</p>
        </div>
        <Link href="/fees" className="select-button">
          View all fees
        </Link>
      </div>

      <div className="chart-summary">
        <div>
          <div className="chart-total">
            {formatCurrency(totalCollected)}
          </div>
          <div className="chart-subtitle">
            <span className="positive-text">
              <TrendingUp size={13} /> Current Term
            </span>
            <span>• Invoiced: {formatCurrency(totalInvoiced)}</span>
          </div>
        </div>

        <div className="chart-legend">
          <span className="legend-dot current" />
          <span>Current</span>
          <span className="legend-dot previous" />
          <span>Previous</span>
        </div>
      </div>

      <div className="chart">
        <div className="chart-gridlines">
          <div><span>80k</span></div>
          <div><span>60k</span></div>
          <div><span>40k</span></div>
          <div><span>20k</span></div>
          <div><span>0</span></div>
        </div>

        <div className="chart-bars">
          {(collectionBars || [
            { month: "May", heightPercent: 35 },
            { month: "Jun", heightPercent: 55 },
            { month: "Jul", heightPercent: 70 },
            { month: "Aug", heightPercent: 85 },
            { month: "Sep", heightPercent: 65 },
            { month: "Oct", heightPercent: 95 },
          ]).map((bar) => (
            <div key={bar.month} className="bar-group">
              <div className="bar-pair">
                <div
                  className="bar previous-bar"
                  style={{ height: `${Math.max(10, bar.heightPercent * 0.75)}%` }}
                />
                <div
                  className="bar current-bar"
                  style={{ height: `${bar.heightPercent}%` }}
                />
              </div>
              <span className="bar-label">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
