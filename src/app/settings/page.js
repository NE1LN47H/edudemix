import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import SettingsPage from "@/features/settings/SettingsPage";
import { requireAuthenticatedCentre } from "@/controllers/pageController";

export const metadata = {
  title: "Settings | edudemix",
  description: "Configure coaching center details and user profile",
};

async function ProtectedSettings() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <SettingsPage />
    </DashboardShell>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="page-loading">Loading settings...</div>}>
      <ProtectedSettings />
    </Suspense>
  );
}
