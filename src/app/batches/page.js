
import { Suspense } from "react";
import { requireAuthenticatedCentre } from "@/controllers/pageController";
import DashboardShell from "@/components/DashboardShell";
import BatchesPage from "@/features/batches/BatchesPage";
import { BatchesPageSkeleton } from "@/components/ui/Skeleton";

async function ProtectedBatches() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <BatchesPage />
    </DashboardShell>
  );
}

export default function BatchesRoute() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <BatchesPageSkeleton />
        </DashboardShell>
      }
    >
      <ProtectedBatches />
    </Suspense>
  );
}
