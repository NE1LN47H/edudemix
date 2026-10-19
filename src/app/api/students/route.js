
import {
  addStudent,
  listStudents,
} from "@/controllers/studentController";

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

    return await listStudents(request, centre.id);
  } catch (error) {
    console.error("GET /api/students:", error);

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

    return await addStudent(request, centre.id);
  } catch (error) {
    console.error("POST /api/students:", error);

    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
