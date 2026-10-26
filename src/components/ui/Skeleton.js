"use client";

/**
 * Base Skeleton component with shimmer effect.
 */
export function Skeleton({
  width,
  height,
  borderRadius,
  circle = false,
  className = "",
  style = {},
  ...props
}) {
  const inlineStyles = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    ...(circle ? { borderRadius: "50%" } : {}),
  };

  return (
    <div
      className={`skeleton-shimmer ${circle ? "skeleton-circle" : ""} ${className}`.trim()}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Skeleton representation of a KPI metric card
 */
export function SkeletonMetricCard({ className = "" }) {
  return (
    <div className={`metric-card skeleton-metric-card ${className}`.trim()}>
      <div className="metric-top">
        <Skeleton width="45%" height="11px" borderRadius="3px" />
        <Skeleton width="30px" height="30px" borderRadius="6px" />
      </div>
      <div className="metric-value-skeleton-wrap">
        <Skeleton width="65%" height="28px" borderRadius="6px" style={{ margin: "14px 0 10px" }} />
      </div>
      <div className="metric-bottom">
        <Skeleton width="80%" height="11px" borderRadius="3px" />
      </div>
    </div>
  );
}

/**
 * Grid of 4 metric cards matching .metrics-grid
 */
export function SkeletonMetricsRow({ count = 4 }) {
  return (
    <section className="metrics-grid" aria-label="Loading statistics...">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonMetricCard key={idx} />
      ))}
    </section>
  );
}

/**
 * Skeleton representation of the Collection Chart panel
 */
export function SkeletonChart() {
  const mockHeights = [35, 55, 70, 85, 65, 95];

  return (
    <div className="panel collection-panel skeleton-chart-panel">
      <div className="panel-header">
        <div style={{ flex: 1 }}>
          <Skeleton width="180px" height="18px" borderRadius="4px" style={{ marginBottom: "6px" }} />
          <Skeleton width="260px" height="12px" borderRadius="3px" />
        </div>
        <Skeleton width="90px" height="28px" borderRadius="6px" />
      </div>

      <div className="chart-summary">
        <div>
          <Skeleton width="130px" height="24px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="210px" height="13px" borderRadius="4px" />
        </div>

        <div className="chart-legend">
          <Skeleton width="65px" height="12px" borderRadius="3px" />
          <Skeleton width="65px" height="12px" borderRadius="3px" />
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
          {mockHeights.map((h, idx) => (
            <div key={idx} className="bar-group">
              <div className="bar-pair">
                <Skeleton
                  className="bar skeleton-chart-bar"
                  style={{
                    height: `${Math.max(15, h * 0.7)}%`,
                    width: "16px",
                    opacity: 0.6,
                  }}
                />
                <Skeleton
                  className="bar skeleton-chart-bar"
                  style={{
                    height: `${h}%`,
                    width: "16px",
                  }}
                />
              </div>
              <Skeleton width="24px" height="10px" borderRadius="2px" style={{ marginTop: "6px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton representation of the Attendance Donut panel
 */
export function SkeletonDonut() {
  return (
    <div className="panel attendance-panel skeleton-donut-panel">
      <div className="panel-header">
        <div style={{ flex: 1 }}>
          <Skeleton width="140px" height="18px" borderRadius="4px" style={{ marginBottom: "6px" }} />
          <Skeleton width="180px" height="12px" borderRadius="3px" />
        </div>
      </div>

      <div className="attendance-visual" style={{ position: "relative" }}>
        <div
          style={{
            width: "140px",
            height: "140px",
            position: "relative",
            margin: "0 auto",
            display: "grid",
            placeItems: "center",
          }}
        >
          {/* Outer circle */}
          <Skeleton
            circle
            width="130px"
            height="130px"
            style={{
              border: "12px solid #f1f3f5",
              background: "transparent",
            }}
          />
          <div className="donut-center" style={{ position: "absolute" }}>
            <Skeleton width="48px" height="24px" borderRadius="4px" style={{ margin: "0 auto 4px" }} />
            <Skeleton width="32px" height="10px" borderRadius="2px" style={{ margin: "0 auto" }} />
          </div>
        </div>
      </div>

      <div className="attendance-legend">
        <div>
          <Skeleton width="12px" height="12px" borderRadius="2px" />
          <Skeleton width="90px" height="12px" borderRadius="3px" />
          <Skeleton width="24px" height="12px" borderRadius="3px" style={{ marginLeft: "auto" }} />
        </div>
        <div>
          <Skeleton width="12px" height="12px" borderRadius="2px" />
          <Skeleton width="85px" height="12px" borderRadius="3px" />
          <Skeleton width="24px" height="12px" borderRadius="3px" style={{ marginLeft: "auto" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton representation of Recent Activity Table
 */
export function SkeletonRecentActivity({ rows = 5 }) {
  return (
    <div className="panel activity-panel">
      <div className="panel-header">
        <div style={{ flex: 1 }}>
          <Skeleton width="180px" height="18px" borderRadius="4px" style={{ marginBottom: "6px" }} />
          <Skeleton width="220px" height="12px" borderRadius="3px" />
        </div>
        <Skeleton width="60px" height="28px" borderRadius="6px" />
      </div>

      <div className="table-wrapper">
        <div style={{ padding: "8px 16px" }}>
          {Array.from({ length: rows }).map((_, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr",
                alignItems: "center",
                gap: "12px",
                padding: "12px 0",
                borderBottom: idx === rows - 1 ? "none" : "1px solid #f0f0f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Skeleton circle width="28px" height="28px" />
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
                  <Skeleton width="70%" height="12px" borderRadius="3px" />
                  <Skeleton width="45%" height="10px" borderRadius="2px" />
                </div>
              </div>
              <Skeleton width="60%" height="12px" borderRadius="3px" />
              <Skeleton width="48px" height="18px" borderRadius="10px" />
              <Skeleton width="50%" height="12px" borderRadius="3px" />
              <Skeleton width="60%" height="13px" borderRadius="3px" style={{ justifySelf: "end" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton representation of Active Batches List
 */
export function SkeletonActiveBatches({ items = 4 }) {
  return (
    <div className="panel batches-panel">
      <div className="panel-header">
        <div style={{ flex: 1 }}>
          <Skeleton width="130px" height="18px" borderRadius="4px" style={{ marginBottom: "6px" }} />
          <Skeleton width="190px" height="12px" borderRadius="3px" />
        </div>
        <Skeleton width="65px" height="28px" borderRadius="6px" />
      </div>

      <div className="batch-list" style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "16px 0" }}>
        {Array.from({ length: items }).map((_, idx) => (
          <div key={idx} className="batch-item">
            <div className="batch-title-row">
              <Skeleton width="30px" height="30px" borderRadius="6px" />
              <div className="batch-main" style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                <Skeleton width="55%" height="13px" borderRadius="3px" />
                <Skeleton width="35%" height="11px" borderRadius="2px" />
              </div>
              <Skeleton width="38px" height="14px" borderRadius="3px" />
            </div>
            <Skeleton width="45%" height="10px" borderRadius="2px" style={{ margin: "6px 0" }} />
            <Skeleton width="100%" height="5px" borderRadius="3px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * General purpose Skeleton Table
 */
export function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="skeleton-table-wrapper" aria-label="Loading data table...">
      <div
        className="skeleton-table-row"
        style={{
          background: "var(--surface, #fafafa)",
          borderBottom: "1px solid var(--border, #eaeaea)",
        }}
      >
        {Array.from({ length: columns }).map((_, idx) => (
          <div key={idx} style={{ flex: idx === 0 ? 1.6 : 1 }}>
            <Skeleton width="60%" height="12px" borderRadius="3px" />
          </div>
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              style={{
                flex: colIdx === 0 ? 1.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {colIdx === 0 && (
                <Skeleton circle width="26px" height="26px" />
              )}
              <Skeleton
                width={colIdx === 0 ? "75%" : colIdx === columns - 1 ? "40%" : "65%"}
                height="12px"
                borderRadius="3px"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Complete Dashboard Skeleton with Shimmer
 */
export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton-layout" aria-busy="true" aria-label="Loading dashboard...">
      {/* 4 Metric KPI Cards */}
      <SkeletonMetricsRow count={4} />

      {/* 2 Middle Charts */}
      <section className="content-grid" style={{ marginBottom: "20px" }}>
        <SkeletonChart />
        <SkeletonDonut />
      </section>

      {/* Bottom Grid: Recent Activity & Active Batches */}
      <section className="bottom-grid">
        <SkeletonRecentActivity rows={4} />
        <SkeletonActiveBatches items={3} />
      </section>
    </div>
  );
}

/**
 * Students Page Skeleton
 */
export function StudentsPageSkeleton() {
  return (
    <div className="students-skeleton-layout" aria-busy="true" aria-label="Loading students...">
      <section className="page-heading">
        <div>
          <Skeleton width="110px" height="11px" borderRadius="3px" style={{ marginBottom: "6px" }} />
          <Skeleton width="160px" height="26px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="280px" height="13px" borderRadius="4px" />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Skeleton width="115px" height="34px" borderRadius="6px" />
        </div>
      </section>

      <section className="students-panel" style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <Skeleton width="200px" height="32px" borderRadius="6px" />
          <Skeleton width="90px" height="32px" borderRadius="6px" />
        </div>
        <SkeletonTable rows={7} columns={5} />
      </section>
    </div>
  );
}

/**
 * Batches Page Skeleton
 */
export function BatchesPageSkeleton() {
  return (
    <div className="batches-skeleton-layout" aria-busy="true" aria-label="Loading batches...">
      <section className="page-heading">
        <div>
          <Skeleton width="110px" height="11px" borderRadius="3px" style={{ marginBottom: "6px" }} />
          <Skeleton width="140px" height="26px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="260px" height="13px" borderRadius="4px" />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Skeleton width="115px" height="34px" borderRadius="6px" />
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: "16px", marginTop: "20px" }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="panel" style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <Skeleton width="55%" height="18px" borderRadius="4px" />
              <Skeleton width="55px" height="20px" borderRadius="10px" />
            </div>
            <Skeleton width="80%" height="12px" borderRadius="3px" style={{ marginBottom: "16px" }} />
            <Skeleton width="100%" height="6px" borderRadius="3px" style={{ marginBottom: "16px" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton width="70px" height="12px" borderRadius="3px" />
              <Skeleton width="80px" height="12px" borderRadius="3px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Fees Page Skeleton
 */
export function FeesPageSkeleton() {
  return (
    <div className="fees-skeleton-layout" aria-busy="true" aria-label="Loading fees...">
      <section className="page-heading">
        <div>
          <Skeleton width="120px" height="11px" borderRadius="3px" style={{ marginBottom: "6px" }} />
          <Skeleton width="180px" height="26px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="300px" height="13px" borderRadius="4px" />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Skeleton width="125px" height="34px" borderRadius="6px" />
        </div>
      </section>

      <SkeletonMetricsRow count={4} />

      <section className="fees-panel" style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <Skeleton width="220px" height="32px" borderRadius="6px" />
          <Skeleton width="140px" height="32px" borderRadius="6px" />
        </div>
        <SkeletonTable rows={6} columns={6} />
      </section>
    </div>
  );
}

/**
 * Attendance Page Skeleton
 */
export function AttendancePageSkeleton() {
  return (
    <div className="attendance-skeleton-layout" aria-busy="true" aria-label="Loading attendance...">
      <section className="page-heading">
        <div>
          <Skeleton width="130px" height="11px" borderRadius="3px" style={{ marginBottom: "6px" }} />
          <Skeleton width="170px" height="26px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="290px" height="13px" borderRadius="4px" />
        </div>
      </section>

      <div className="panel" style={{ padding: "16px 20px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
        <Skeleton width="180px" height="36px" borderRadius="6px" />
        <Skeleton width="150px" height="36px" borderRadius="6px" />
        <Skeleton width="120px" height="36px" borderRadius="6px" style={{ marginLeft: "auto" }} />
      </div>

      <SkeletonTable rows={7} columns={5} />
    </div>
  );
}

/**
 * Teachers Page Skeleton
 */
export function TeachersPageSkeleton() {
  return (
    <div className="teachers-skeleton-layout" aria-busy="true" aria-label="Loading staff...">
      <section className="page-heading">
        <div>
          <Skeleton width="110px" height="11px" borderRadius="3px" style={{ marginBottom: "6px" }} />
          <Skeleton width="180px" height="26px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="280px" height="13px" borderRadius="4px" />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Skeleton width="115px" height="34px" borderRadius="6px" />
        </div>
      </section>

      <SkeletonMetricsRow count={4} />

      <section className="students-panel" style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <Skeleton width="200px" height="32px" borderRadius="6px" />
          <Skeleton width="100px" height="32px" borderRadius="6px" />
        </div>
        <SkeletonTable rows={5} columns={4} />
      </section>
    </div>
  );
}

/**
 * Reports Page Skeleton
 */
export function ReportsPageSkeleton() {
  return (
    <div className="reports-container" aria-busy="true" aria-label="Loading analytics...">
      <section className="page-heading">
        <div>
          <Skeleton width="140px" height="11px" borderRadius="3px" style={{ marginBottom: "6px" }} />
          <Skeleton width="220px" height="26px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="340px" height="13px" borderRadius="4px" />
        </div>
      </section>

      <SkeletonMetricsRow count={4} />

      <div className="reports-grid" style={{ marginTop: "20px" }}>
        <SkeletonChart />
        <SkeletonDonut />
      </div>
    </div>
  );
}

/**
 * Settings Page Skeleton
 */
export function SettingsPageSkeleton() {
  return (
    <div className="settings-skeleton-layout" aria-busy="true" aria-label="Loading settings...">
      <section className="page-heading">
        <div>
          <Skeleton width="120px" height="11px" borderRadius="3px" style={{ marginBottom: "6px" }} />
          <Skeleton width="150px" height="26px" borderRadius="5px" style={{ marginBottom: "8px" }} />
          <Skeleton width="260px" height="13px" borderRadius="4px" />
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px", marginTop: "20px" }}>
        <div className="panel" style={{ padding: "24px", minHeight: "340px" }}>
          <Skeleton width="160px" height="18px" borderRadius="4px" style={{ marginBottom: "16px" }} />
          <Skeleton width="100%" height="42px" borderRadius="6px" style={{ marginBottom: "14px" }} />
          <Skeleton width="100%" height="42px" borderRadius="6px" style={{ marginBottom: "14px" }} />
          <Skeleton width="100%" height="42px" borderRadius="6px" />
        </div>
        <div className="panel" style={{ padding: "24px", minHeight: "340px" }}>
          <Skeleton width="160px" height="18px" borderRadius="4px" style={{ marginBottom: "16px" }} />
          <Skeleton width="100%" height="42px" borderRadius="6px" style={{ marginBottom: "14px" }} />
          <Skeleton width="100%" height="42px" borderRadius="6px" style={{ marginBottom: "14px" }} />
          <Skeleton width="100%" height="42px" borderRadius="6px" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
