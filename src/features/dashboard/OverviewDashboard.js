"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CalendarDays } from "lucide-react";
import MetricsRow from "./components/MetricsRow";
import CollectionChart from "./components/CollectionChart";
import AttendanceDonut from "./components/AttendanceDonut";
import RecentActivityTable from "./components/RecentActivityTable";
import ActiveBatchesList from "./components/ActiveBatchesList";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function OverviewDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard overview", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const metrics = data?.metrics || {
    totalStudents: 0,
    activeStudents: 0,
    activeBatches: 0,
    attendanceRate: 0,
    presentToday: 0,
    absentToday: 0,
    markedToday: 0,
    totalMarkedEver: 0,
    overallAttendanceRate: 0,
    overallPresent: 0,
    overallAbsent: 0,
    totalCollected: 0,
    totalPending: 0,
    totalInvoiced: 0,
  };

  const activeBatches = data?.activeBatches || [];
  const recentActivity = data?.recentActivity || [];
  const collectionBars = data?.collectionBars || [];

  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="live-dot" />
            LIVE WORKSPACE
          </div>
          <h1>Overview</h1>
          <p className="page-description">
            Your coaching centre at a glance — student progress, schedules, and collections.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/students" className="primary-button">
            <Plus size={15} />
            Add student
          </Link>
          <Link href="/attendance" className="select-button">
            <CalendarDays size={14} />
            Mark attendance
          </Link>
        </div>
      </section>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="dashboard-content-loaded">
          {/* KPI Metrics Row with smooth reveal */}
          <div className="reveal-content reveal-stagger-1">
            <MetricsRow metrics={metrics} />
          </div>

          {/* Charts Row with smooth reveal */}
          <section className="content-grid reveal-content reveal-stagger-2">
            <CollectionChart
              totalCollected={metrics.totalCollected}
              totalInvoiced={metrics.totalInvoiced}
              collectionBars={collectionBars}
            />

            <AttendanceDonut
              attendanceRate={metrics.attendanceRate}
              presentToday={metrics.presentToday}
              absentToday={metrics.absentToday}
              markedToday={metrics.markedToday}
              totalMarkedEver={metrics.totalMarkedEver}
              overallAttendanceRate={metrics.overallAttendanceRate}
              overallPresent={metrics.overallPresent}
              overallAbsent={metrics.overallAbsent}
            />
          </section>

          {/* Bottom Grid: Recent Activity & Active Cohorts with smooth reveal */}
          <section className="bottom-grid reveal-content reveal-stagger-3">
            <RecentActivityTable recentActivity={recentActivity} />
            <ActiveBatchesList activeBatches={activeBatches} />
          </section>
        </div>
      )}
    </>
  );
}
