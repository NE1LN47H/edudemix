import {
  listCentresAdminController,
  registerCentreAdminController,
  updateCentreStatusAdminController,
  deleteCentreAdminController,
} from "@/controllers/superAdminController";

export async function GET(request) {
  return listCentresAdminController(request);
}

export async function POST(request) {
  return registerCentreAdminController(request);
}

export async function PATCH(request) {
  return updateCentreStatusAdminController(request);
}

export async function DELETE(request) {
  return deleteCentreAdminController(request);
}
