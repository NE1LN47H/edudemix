import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import OverviewDashboard from "@/features/dashboard/OverviewDashboard";
import { requireAuthenticatedCentre } from "@/controllers/pageController";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export const metadata = {
  title: "Dashboard Overview | edudemix",
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

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <DashboardSkeleton />
        </DashboardShell>
      }
    >
      <ProtectedDashboard />
    </Suspense>
  );
}
