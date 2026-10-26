import DashboardShell from "@/components/DashboardShell";
import { SettingsPageSkeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <DashboardShell>
      <SettingsPageSkeleton />
    </DashboardShell>
  );
}
