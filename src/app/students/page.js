
import { Suspense } from "react";
import { requireAuthenticatedCentre } from "@/controllers/pageController";
import DashboardShell from "@/components/DashboardShell";
import StudentsPage from "@/features/students/StudentsPage";
import { StudentsPageSkeleton } from "@/components/ui/Skeleton";

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
    <Suspense
      fallback={
        <DashboardShell>
          <StudentsPageSkeleton />
        </DashboardShell>
      }
    >
      <ProtectedStudents />
    </Suspense>
  );
}
