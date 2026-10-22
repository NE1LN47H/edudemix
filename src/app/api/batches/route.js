
import {
  addBatch,
  listBatches,
} from "@/controllers/batchController";

export async function GET(request) {
  return listBatches(request);
}

export async function POST(request) {
  return addBatch(request);
}
