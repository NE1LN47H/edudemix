import DashboardShell from "@/components/DashboardShell";
import { AttendancePageSkeleton } from "@/components/ui/Skeleton";

export default function AttendanceLoading() {
  return (
    <DashboardShell>
      <AttendancePageSkeleton />
    </DashboardShell>
  );
}
