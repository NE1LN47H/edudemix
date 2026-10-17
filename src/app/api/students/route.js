
import {
  addStudent,
  listStudents,
} from "@/controllers/studentController";

import { requireCentre } from "@/lib/auth";

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
  const centre = await requireCentre();

  if (!centre) {
    return unauthorizedResponse();
  }

  return listStudents(request, centre.id);
}

export async function POST(request) {
  const centre = await requireCentre();

  if (!centre) {
    return unauthorizedResponse();
  }

  return addStudent(request, centre.id);
}
