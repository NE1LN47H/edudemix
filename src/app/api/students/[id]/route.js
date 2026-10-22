import {
  editStudent,
  removeStudent,
} from "@/controllers/studentController";

export async function PUT(request, context) {
  return editStudent(request, context);
}

export async function DELETE(request, context) {
  return removeStudent(request, context);
}
