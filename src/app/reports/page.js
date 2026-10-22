import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import ReportsPage from "@/features/reports/ReportsPage";
import { requireAuthenticatedCentre } from "@/controllers/pageController";

export const metadata = {
  title: "Reports & Analytics | edudemix",
  description: "View coaching center metrics, attendance percentages, and fee collections",
};

async function ProtectedReports() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <ReportsPage />
    </DashboardShell>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="page-loading">Generating reports...</div>}>
      <ProtectedReports />
    </Suspense>
  );
}
