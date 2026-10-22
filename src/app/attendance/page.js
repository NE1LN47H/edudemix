import { Suspense } from "react";
import DashboardShell from "@/components/DashboardShell";
import AttendancePage from "@/features/attendance/AttendancePage";
import { requireAuthenticatedCentre } from "@/controllers/pageController";

export const metadata = {
  title: "Attendance | edudemix",
  description: "Mark and track batch attendance for your students",
};

async function ProtectedAttendance() {
  await requireAuthenticatedCentre();

  return (
    <DashboardShell>
      <AttendancePage />
    </DashboardShell>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="page-loading">Loading attendance...</div>}>
      <ProtectedAttendance />
    </Suspense>
  );
}
