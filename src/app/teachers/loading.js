import DashboardShell from "@/components/DashboardShell";
import { TeachersPageSkeleton } from "@/components/ui/Skeleton";

export default function TeachersLoading() {
  return (
    <DashboardShell>
      <TeachersPageSkeleton />
    </DashboardShell>
  );
}
