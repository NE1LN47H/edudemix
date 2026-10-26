import DashboardShell from "@/components/DashboardShell";
import { BatchesPageSkeleton } from "@/components/ui/Skeleton";

export default function BatchesLoading() {
  return (
    <DashboardShell>
      <BatchesPageSkeleton />
    </DashboardShell>
  );
}
