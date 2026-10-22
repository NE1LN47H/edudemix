import { ZodError } from "zod";
import {
  getCentreSettings,
  updateCentreSettings,
  updateUserProfile,
} from "@/services/settingsService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export function getSettings(req) {
  return withAuthenticatedCentre(async ({ id: centreId, userId }) => {
    try {
      const data = await getCentreSettings(centreId, userId);
      return Response.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Get settings error:", error);
      return Response.json(
        { success: false, message: "Unable to retrieve settings" },
        { status: 500 }
      );
    }
  });
}

export function saveSettings(req) {
  return withAuthenticatedCentre(async ({ id: centreId, userId }) => {
    try {
      const body = await req.json();
      const { type, ...payload } = body;

      if (type === "profile") {
        const user = await updateUserProfile(userId, payload);
        return Response.json({
          success: true,
          message: "Profile updated successfully",
          user,
        });
      }

      // Default: centre details
      const centre = await updateCentreSettings(centreId, payload);
      return Response.json({
        success: true,
        message: "Centre details updated successfully",
        centre,
      });
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

      console.error("Save settings error:", error);
      return Response.json(
        { success: false, message: "Unable to update settings" },
        { status: 500 }
      );
    }
  });
}
