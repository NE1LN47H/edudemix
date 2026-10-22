
import { registerCentreController } from "@/controllers/authController";

export async function POST(request) {
  return registerCentreController(request);
}
