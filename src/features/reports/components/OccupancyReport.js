"use client";

export default function OccupancyReport({ occupancy }) {
  return (
    <section className="report-card">
      <div className="report-card-header">
        <h2>Batch Capacity Utilization</h2>
        <span style={{ fontSize: "11px", color: "#777" }}>
          {occupancy.length} batches
        </span>
      </div>

      {occupancy.length === 0 ? (
        <p style={{ color: "#888", fontSize: "12px" }}>
          No batches created yet.
        </p>
      ) : (
        <div>
          {occupancy.map((b) => (
            <div key={b.id} className="occupancy-item">
              <div className="occupancy-header">
                <strong>{b.name}</strong>
                <span>
                  {b.enrolled} / {b.capacity} students ({b.occupancyRate}%)
                </span>
              </div>
              <div className="occupancy-bar-bg">
                <div
                  className="occupancy-bar-fill"
                  style={{ width: `${b.occupancyRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
