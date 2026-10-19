
import {
  addBatch,
  listBatches,
} from "@/controllers/batchController";

import { getAuthenticatedCentre } from "@/lib/auth";

function unauthorizedResponse() {
  return Response.json(
    {
      success: false,
      message: "Authentication required",
    },
    { status: 401 }
  );
}

export async function GET(request) {
  try {
    const centre = await getAuthenticatedCentre();

    if (!centre) {
      return unauthorizedResponse();
    }

    return await listBatches(request, centre.id);
  } catch (error) {
    console.error("GET /api/batches:", error);

    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const centre = await getAuthenticatedCentre();

    if (!centre) {
      return unauthorizedResponse();
    }

    return await addBatch(request, centre.id);
  } catch (error) {
    console.error("POST /api/batches:", error);

    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
