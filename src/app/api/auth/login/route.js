
import { loginController } from "@/controllers/authController";

export async function POST(request) {
  return loginController(request);
}
