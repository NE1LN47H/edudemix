import {
  listFees,
  addFee,
} from "@/controllers/feeController";

export async function GET(request) {
  return listFees(request);
}

export async function POST(request) {
  return addFee(request);
}
