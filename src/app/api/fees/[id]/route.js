import {
  recordPayment,
  removeFee,
} from "@/controllers/feeController";

export async function PUT(request, context) {
  return recordPayment(request, context);
}

export async function DELETE(request, context) {
  return removeFee(request, context);
}
