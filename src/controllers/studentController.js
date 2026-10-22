
import { ZodError } from "zod";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "@/services/studentService";
import { withAuthenticatedCentre } from "@/controllers/controllerUtils";

export function listStudents(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const result = await getStudents(centreId, {
        search: req.nextUrl.searchParams.get("search") || "",
        page: req.nextUrl.searchParams.get("page") || 1,
        limit: req.nextUrl.searchParams.get("limit") || 10,
      });

      return Response.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("List students error:", error);

      return Response.json(
        { success: false, message: "Unable to retrieve students" },
        { status: 500 }
      );
    }
  });
}

export function addStudent(req) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const body = await req.json();
      const student = await createStudent(centreId, body);

      return Response.json(
        { success: true, student },
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
            message: "That admission number already exists for this centre",
          },
          { status: 409 }
        );
      }

      console.error("Create student error:", error);

      return Response.json(
        { success: false, message: "Unable to create student" },
        { status: 500 }
      );
    }
  });
}

export function editStudent(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: studentId } = await routeContext.params;
      const body = await req.json();
      const student = await updateStudent(centreId, studentId, body);

      return Response.json({
        success: true,
        student,
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
            message: "That admission number already exists for this centre",
          },
          { status: 409 }
        );
      }

      if (error?.message === "INVALID_STUDENT_ID") {
        return Response.json(
          { success: false, message: "Invalid student identifier" },
          { status: 400 }
        );
      }

      if (error?.message === "STUDENT_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      console.error("Update student error:", error);
      return Response.json(
        { success: false, message: "Unable to update student" },
        { status: 500 }
      );
    }
  });
}

export function removeStudent(req, routeContext) {
  return withAuthenticatedCentre(async ({ id: centreId }) => {
    try {
      const { id: studentId } = await routeContext.params;
      const result = await deleteStudent(centreId, studentId);

      return Response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error?.message === "STUDENT_NOT_FOUND") {
        return Response.json(
          { success: false, message: "Student not found" },
          { status: 404 }
        );
      }

      console.error("Delete student error:", error);
      return Response.json(
        { success: false, message: "Unable to delete student" },
        { status: 500 }
      );
    }
  });
}
