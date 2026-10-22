import { getDashboardOverview } from "@/services/dashboardService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export async function GET(request) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const data = await getDashboardOverview(centreId);
      return Response.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      return Response.json(
        { success: false, message: "Unable to load dashboard stats" },
        { status: 500 }
      );
    }
  });
}
