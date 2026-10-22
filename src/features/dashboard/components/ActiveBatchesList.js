"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function ActiveBatchesList({ activeBatches }) {
  return (
    <div className="panel batches-panel">
      <div className="panel-header">
        <div>
          <h2>Active Batches</h2>
          <p>Capacity and enrolled student counts</p>
        </div>
        <Link href="/batches" className="select-button">
          View all
        </Link>
      </div>

      <div className="batch-list">
        {activeBatches.length === 0 ? (
          <p style={{ color: "#888", fontSize: "12px", padding: "20px 0" }}>
            No active batches found.
          </p>
        ) : (
          activeBatches.map((batch) => (
            <div key={batch._id} className="batch-item">
              <div className="batch-title-row">
                <div className="batch-symbol">
                  <BookOpen size={16} />
                </div>
                <div className="batch-main">
                  <strong>{batch.name}</strong>
                  <span>{batch.courseName}</span>
                </div>
                <span className="batch-student-count">
                  {batch.enrolled}/{batch.capacity}
                </span>
              </div>

              <div className="batch-time">
                {batch.startTime
                  ? `${batch.startTime} – ${batch.endTime || ""}`
                  : "Regular Schedule"}
              </div>

              <div className="progress-track">
                <div
                  className="progress-value"
                  style={{ width: `${batch.percent}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="batch-footer">
        <Link href="/batches" className="text-link">
          Manage batches & schedules <span>→</span>
        </Link>
      </div>
    </div>
  );
}
