import DashboardShell from "@/components/DashboardShell";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <DashboardShell>
      <DashboardSkeleton />
    </DashboardShell>
  );
}
