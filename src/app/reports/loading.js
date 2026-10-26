import DashboardShell from "@/components/DashboardShell";
import { ReportsPageSkeleton } from "@/components/ui/Skeleton";

export default function ReportsLoading() {
  return (
    <DashboardShell>
      <ReportsPageSkeleton />
    </DashboardShell>
  );
}
