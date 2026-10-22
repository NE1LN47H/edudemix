
import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import { requireAuthenticatedCentre } from "@/controllers/pageController";

async function ProtectedDashboard() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <section className="page-heading">
        <div>
          <div className="eyebrow">WORKSPACE</div>
          <h1>Overview</h1>
          <p className="page-description">
            Your coaching centre at a glance.
          </p>
        </div>
      </section>

      <section className="panel students-empty-panel">
        <h2>Welcome to edudemix</h2>
        <p>
          Your workspace is ready. Start by managing
          your students and batches.
        </p>
      </section>
    </DashboardShell>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="page-loading">Loading dashboard...</div>}>
      <ProtectedDashboard />
    </Suspense>
  );
}
