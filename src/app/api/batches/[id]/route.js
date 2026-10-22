
import {
  editBatch,
  removeBatch,
} from "@/controllers/batchController";

export async function PUT(request, context) {
  return editBatch(request, context);
}

export async function DELETE(request, context) {
  return removeBatch(request, context);
}
