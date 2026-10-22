
import { sessionController } from "@/controllers/authController";

export async function GET() {
  return sessionController();
}
