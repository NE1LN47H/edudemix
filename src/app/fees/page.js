import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import FeesPage from "@/features/fees/FeesPage";
import { requireAuthenticatedCentre } from "@/controllers/pageController";

export const metadata = {
  title: "Fees & Payments | edudemix",
  description: "Manage tuition fee records, invoices, and payments",
};

async function ProtectedFees() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <FeesPage />
    </DashboardShell>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProtectedFees />
    </Suspense>
  );
}
