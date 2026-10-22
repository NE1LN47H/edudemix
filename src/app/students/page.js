
import { Suspense } from "react";
import { requireAuthenticatedCentre } from "@/controllers/pageController";
import DashboardShell from "@/components/DashboardShell";
import StudentsPage from "@/features/students/StudentsPage";

async function ProtectedStudents() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <StudentsPage />
    </DashboardShell>
  );
}

export default function StudentsRoute() {
  return (
    <Suspense fallback={null}>
      <ProtectedStudents />
    </Suspense>
  );
}
