
import { Suspense } from "react";
import { requireAuthenticatedCentre } from "@/controllers/pageController";
import DashboardShell from "@/components/DashboardShell";
import BatchesPage from "@/features/batches/BatchesPage";

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
    <Suspense fallback={<div className="page-loading">Loading batches...</div>}>
      <ProtectedBatches />
    </Suspense>
  );
}
