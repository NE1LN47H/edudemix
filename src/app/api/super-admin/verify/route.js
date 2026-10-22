import { verifySuperAdminController } from "@/controllers/superAdminController";

export async function POST(request) {
  return verifySuperAdminController(request);
}
