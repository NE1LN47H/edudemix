import {
  toggleStatus,
  removeStaff,
} from "@/controllers/teacherController";

export async function PUT(request, context) {
  return toggleStatus(request, context);
}

export async function DELETE(request, context) {
  return removeStaff(request, context);
}
