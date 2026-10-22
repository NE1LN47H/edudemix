"use client";

import { useEffect, useState } from "react";
import { Activity, LoaderCircle } from "lucide-react";
import ReportMetrics from "./components/ReportMetrics";
import OccupancyReport from "./components/OccupancyReport";
import FinancialReport from "./components/FinancialReport";
import AttendanceReport from "./components/AttendanceReport";
import EnrollmentReport from "./components/EnrollmentReport";
import "./ReportsPage.css";

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function fetchReports() {
      try {
        setLoading(true);
        const res = await fetch("/api/reports", { cache: "no-store" });
        const result = await res.json();
        if (ignore) return;
        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load reports");
        }
        setData(result.data);
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to load analytics data");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchReports();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="students-state">
        <LoaderCircle className="students-spinner" size={28} />
        <p>Compiling analytics and reports...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="students-state">
        <Activity size={28} style={{ color: "#991b1b" }} />
        <h3>Unable to load reports</h3>
        <p>{error || "No data available."}</p>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE ANALYTICS</div>
          <h1>Centre Reports & Insights</h1>
          <p className="page-description">
            Comprehensive overview of student enrollment, batch capacities, attendance rates, and revenue.
          </p>
        </div>
      </section>

      <ReportMetrics data={data} />

      <div className="reports-grid">
        <OccupancyReport occupancy={data.batches.occupancy} />
        <FinancialReport finances={data.finances} />
        <AttendanceReport attendance={data.attendance} />
        <EnrollmentReport students={data.students} />
      </div>
    </div>
  );
}
