import DashboardShell from "@/components/DashboardShell";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="live-dot" />
            LIVE WORKSPACE
          </div>
          <h1>Overview</h1>
          <p className="page-description">
            Your coaching centre at a glance — student progress, schedules, and collections.
          </p>
        </div>
      </section>

      <DashboardSkeleton />
    </DashboardShell>
  );
}
