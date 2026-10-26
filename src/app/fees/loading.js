import DashboardShell from "@/components/DashboardShell";
import { FeesPageSkeleton } from "@/components/ui/Skeleton";

export default function FeesLoading() {
  return (
    <DashboardShell>
      <FeesPageSkeleton />
    </DashboardShell>
  );
}
