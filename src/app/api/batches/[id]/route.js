
import { editBatch } from "@/controllers/batchController";

export async function PUT(request, context) {
  return editBatch(request, context);
}
