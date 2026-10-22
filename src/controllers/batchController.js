
import { ZodError } from "zod";
import {
  createBatch,
  getBatches,
  updateBatch,
  deleteBatch,
} from "@/services/batchService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export function listBatches(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const result = await getBatches(centreId, {
        search: req.nextUrl.searchParams.get("search") || "",
        page: req.nextUrl.searchParams.get("page") || 1,
        limit: req.nextUrl.searchParams.get("limit") || 10,
      });

      return Response.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("List batches error:", error);

      return Response.json(
        {
          success: false,
          message: "Unable to retrieve batches",
        },
        { status: 500 }
      );
    }
  });
}

export function addBatch(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const body = await req.json();
      const batch = await createBatch(centreId, body);

      return Response.json(
        {
          success: true,
          batch,
        },
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

      if (error?.code === 11000) {
        return Response.json(
          {
            success: false,
            message: "A batch with this name already exists in your centre",
          },
          { status: 409 }
        );
      }

      console.error("Create batch error:", error);

      return Response.json(
        {
          success: false,
          message: "Unable to create batch",
        },
        { status: 500 }
      );
    }
  });
}

export function editBatch(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: batchId } = await routeContext.params;
      const body = await req.json();
      const batch = await updateBatch(centreId, batchId, body);

      return Response.json({
        success: true,
        batch,
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

      if (error?.code === 11000) {
        return Response.json(
          {
            success: false,
            message: "A batch with this name already exists in your centre",
          },
          { status: 409 }
        );
      }

      if (error?.message === "INVALID_BATCH_ID") {
        return Response.json(
          { success: false, message: "Invalid batch ID" },
          { status: 400 }
        );
      }

      if (error?.message === "BATCH_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Batch not found" },
          { status: 404 }
        );
      }

      console.error("Update batch error:", error);

      return Response.json(
        { success: false, message: "Unable to update batch" },
        { status: 500 }
      );
    }
  });
}

export function removeBatch(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: batchId } = await routeContext.params;
      const result = await deleteBatch(centreId, batchId);

      return Response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error?.message === "BATCH_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Batch not found" },
          { status: 404 }
        );
      }

      console.error("Delete batch error:", error);
      return Response.json(
        { success: false, message: "Unable to delete batch" },
        { status: 500 }
      );
    }
  });
}
