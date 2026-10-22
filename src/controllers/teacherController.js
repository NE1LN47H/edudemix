import { ZodError } from "zod";
import {
  getStaffMembers,
  addStaffMember,
  updateStaffStatus,
  deleteStaffMember,
} from "@/services/teacherService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export function listStaff(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const staff = await getStaffMembers(centreId);
      return Response.json({
        success: true,
        staff,
      });
    } catch (error) {
      console.error("List staff error:", error);
      return Response.json(
        { success: false, message: "Unable to retrieve staff members" },
        { status: 500 }
      );
    }
  });
}

export function createStaff(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const body = await req.json();
      const user = await addStaffMember(centreId, body);

      return Response.json(
        { success: true, user },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return Response.json(
          {
            success: false,
            message: "Validation failed",
            errors: error.issues,
          },
          { status: 400 }
        );
      }

      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return Response.json(
          { success: false, message: "A staff member with this email already exists" },
          { status: 409 }
        );
      }

      console.error("Create staff error:", error);
      return Response.json(
        { success: false, message: "Unable to add staff member" },
        { status: 500 }
      );
    }
  });
}

export function toggleStatus(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: userId } = await routeContext.params;
      const { status } = await req.json();
      const updated = await updateStaffStatus(centreId, userId, status);

      return Response.json({
        success: true,
        user: updated,
      });
    } catch (error) {
      if (error.message === "CANNOT_DISABLE_OWNER") {
        return Response.json(
          { success: false, message: "Primary centre owner cannot be disabled" },
          { status: 400 }
        );
      }

      if (error.message === "USER_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Staff member not found" },
          { status: 404 }
        );
      }

      console.error("Update staff error:", error);
      return Response.json(
        { success: false, message: "Unable to update staff status" },
        { status: 500 }
      );
    }
  });
}

export function removeStaff(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: userId } = await routeContext.params;
      const result = await deleteStaffMember(centreId, userId);

      return Response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === "CANNOT_DELETE_OWNER") {
        return Response.json(
          { success: false, message: "Primary centre owner cannot be deleted" },
          { status: 400 }
        );
      }

      if (error.message === "USER_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Staff member not found" },
          { status: 404 }
        );
      }

      console.error("Delete staff error:", error);
      return Response.json(
        { success: false, message: "Unable to delete staff member" },
        { status: 500 }
      );
    }
  });
}
