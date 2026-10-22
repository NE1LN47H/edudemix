import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import TeachersPage from "@/features/teachers/TeachersPage";
import { requireAuthenticatedCentre } from "@/controllers/pageController";

export const metadata = {
  title: "Teachers & Staff | edudemix",
  description: "Manage coaching institute faculty, teachers, and staff members",
};

async function ProtectedTeachers() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <TeachersPage />
    </DashboardShell>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="page-loading">Loading staff directory...</div>}>
      <ProtectedTeachers />
    </Suspense>
  );
}
