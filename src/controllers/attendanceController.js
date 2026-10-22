
import { ZodError } from "zod";
import { markAttendance } from "@/services/attendanceService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export function markAttendanceController(request) {
  return withAuthenticatedCentre(async ({ id: centreId, userId }) => {
    try {
      const body = await request.json();

      const result = await markAttendance(centreId, userId, body);

      return Response.json({
        success: true,
        message: "Attendance saved successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return Response.json(
          {
            success: false,
            message: "Invalid attendance details",
            errors: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 }
        );
      }

      if (error.message === "INVALID_CENTRE_ID") {
        return Response.json(
          { success: false, message: "Invalid centre" },
          { status: 400 }
        );
      }

      if (error.message === "INVALID_USER_ID") {
        return Response.json(
          { success: false, message: "Invalid user" },
          { status: 400 }
        );
      }

      if (error.message === "BATCH_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Batch not found" },
          { status: 404 }
        );
      }

      if (error.message === "DUPLICATE_STUDENTS") {
        return Response.json(
          {
            success: false,
            message: "A student appears more than once in this request",
          },
          { status: 400 }
        );
      }

      if (error.message === "STUDENTS_NOT_IN_BATCH") {
        return Response.json(
          {
            success: false,
            message: "One or more students do not belong to this batch",
          },
          { status: 400 }
        );
      }

      console.error("Mark attendance error:", error);

      return Response.json(
        {
          success: false,
          message: "Unable to save attendance",
        },
        { status: 500 }
      );
    }
  });
}
