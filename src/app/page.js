
import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import OverviewDashboard from "@/features/dashboard/OverviewDashboard";
import { requireAuthenticatedCentre } from "@/controllers/pageController";

export const metadata = {
  title: "Overview | edudemix",
  description: "Coaching centre management workspace overview",
};

async function ProtectedDashboard() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <OverviewDashboard />
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
