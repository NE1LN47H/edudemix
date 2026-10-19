
import { ZodError } from "zod";
import {
  createBatch,
  getBatches,
} from "@/services/batchService";

export async function listBatches(req, centreId) {
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
}

export async function addBatch(req, centreId) {
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
}
