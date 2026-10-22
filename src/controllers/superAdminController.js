import { ZodError } from "zod";
import {
  isSuperAdminAuthorized,
  getAllCentresWithStats,
  registerCentre,
  toggleCentreStatus,
  deleteCentreCompletely,
} from "@/services/superAdminService";

export async function verifySuperAdminController(request) {
  if (!isSuperAdminAuthorized(request)) {
    return Response.json(
      { success: false, message: "Invalid SaaS Administrator Secret Key" },
      { status: 401 }
    );
  }

  return Response.json({
    success: true,
    message: "Authenticated as SaaS Super Administrator",
  });
}

export async function listCentresAdminController(request) {
  if (!isSuperAdminAuthorized(request)) {
    return Response.json(
      { success: false, message: "Unauthorized: Super Admin access required" },
      { status: 403 }
    );
  }

  try {
    const centres = await getAllCentresWithStats();
    return Response.json({
      success: true,
      data: centres,
    });
  } catch (error) {
    console.error("Super Admin list centres error:", error);
    return Response.json(
      { success: false, message: "Failed to retrieve centres" },
      { status: 500 }
    );
  }
}

export async function registerCentreAdminController(request) {
  if (!isSuperAdminAuthorized(request)) {
    return Response.json(
      { success: false, message: "Unauthorized: Super Admin access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const result = await registerCentre(body);

    return Response.json(
      {
        success: true,
        message: "New coaching centre provisioned successfully",
        ...result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          message: "Invalid centre registration data",
          errors: error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error?.code === 11000) {
      return Response.json(
        {
          success: false,
          message: "A centre with that workspace slug or owner email already exists",
        },
        { status: 409 }
      );
    }

    console.error("Super Admin register centre error:", error);
    return Response.json(
      { success: false, message: "Failed to register centre" },
      { status: 500 }
    );
  }
}

export async function updateCentreStatusAdminController(request) {
  if (!isSuperAdminAuthorized(request)) {
    return Response.json(
      { success: false, message: "Unauthorized: Super Admin access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { centreId, status } = body;

    if (!centreId || !["active", "suspended"].includes(status)) {
      return Response.json(
        { success: false, message: "Invalid centre ID or status" },
        { status: 400 }
      );
    }

    const updated = await toggleCentreStatus(centreId, status);
    return Response.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Super Admin update status error:", error);
    return Response.json(
      { success: false, message: error.message || "Failed to update centre status" },
      { status: 500 }
    );
  }
}

export async function deleteCentreAdminController(request) {
  if (!isSuperAdminAuthorized(request)) {
    return Response.json(
      { success: false, message: "Unauthorized: Super Admin access required" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { centreId } = body;

    if (!centreId) {
      return Response.json(
        { success: false, message: "Coaching Centre ID is required" },
        { status: 400 }
      );
    }

    const deleted = await deleteCentreCompletely(centreId);
    return Response.json({
      success: true,
      message: `Coaching centre "${deleted.name}" and all associated data permanently deleted`,
      data: deleted,
    });
  } catch (error) {
    console.error("Super Admin delete centre error:", error);
    return Response.json(
      { success: false, message: error.message || "Failed to delete coaching centre" },
      { status: 500 }
    );
  }
}
