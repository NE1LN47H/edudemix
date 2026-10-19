
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedCentre } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";
import StudentsPage from "@/features/students/StudentsPage";

async function ProtectedStudents() {
  const centre = await getAuthenticatedCentre();

  if (!centre) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <StudentsPage />
    </DashboardShell>
  );
}

export default function StudentsRoute() {
  return (
    <Suspense fallback={<div className="page-loading">Loading students...</div>}>
      <ProtectedStudents />
    </Suspense>
  );
}
