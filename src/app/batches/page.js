
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedCentre } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";
import BatchesPage from "@/features/batches/BatchesPage";

async function ProtectedBatches() {
  const centre = await getAuthenticatedCentre();

  if (!centre) {
    redirect("/login");
  }

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
