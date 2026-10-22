import { getReportsData } from "@/services/reportService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export function getReports(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const data = await getReportsData(centreId);
      return Response.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Get reports error:", error);
      return Response.json(
        { success: false, message: "Unable to generate reports" },
        { status: 500 }
      );
    }
  });
}
