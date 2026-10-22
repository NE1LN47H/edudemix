import { ZodError } from "zod";
import {
  createFee,
  getFees,
  recordFeePayment,
  deleteFee,
} from "@/services/feeService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export function listFees(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const url = new URL(req.url);
      const search = url.searchParams.get("search") || "";
      const status = url.searchParams.get("status") || "";
      const page = url.searchParams.get("page") || 1;
      const limit = url.searchParams.get("limit") || 10;

      const result = await getFees(centreId, {
        search,
        status,
        page,
        limit,
      });

      return Response.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("List fees error:", error);
      return Response.json(
        { success: false, message: "Unable to retrieve fee records" },
        { status: 500 }
      );
    }
  });
}

export function addFee(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const body = await req.json();
      const fee = await createFee(centreId, body);

      return Response.json(
        { success: true, fee },
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

      if (error.message === "STUDENT_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Student not found in this centre" },
          { status: 404 }
        );
      }

      console.error("Create fee error:", error);
      return Response.json(
        { success: false, message: "Unable to create fee record" },
        { status: 500 }
      );
    }
  });
}

export function recordPayment(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: feeId } = await routeContext.params;
      const body = await req.json();
      const fee = await recordFeePayment(centreId, feeId, body);

      return Response.json({
        success: true,
        fee,
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

      if (error.message === "FEE_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Fee record not found" },
          { status: 404 }
        );
      }

      console.error("Record payment error:", error);
      return Response.json(
        { success: false, message: "Unable to record payment" },
        { status: 500 }
      );
    }
  });
}

export function removeFee(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: feeId } = await routeContext.params;
      const result = await deleteFee(centreId, feeId);

      return Response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error.message === "FEE_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Fee record not found" },
          { status: 404 }
        );
      }

      console.error("Delete fee error:", error);
      return Response.json(
        { success: false, message: "Unable to delete fee record" },
        { status: 500 }
      );
    }
  });
}
