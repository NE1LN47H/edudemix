import DashboardShell from "@/components/DashboardShell";
import { StudentsPageSkeleton } from "@/components/ui/Skeleton";

export default function StudentsLoading() {
  return (
    <DashboardShell>
      <StudentsPageSkeleton />
    </DashboardShell>
  );
}
