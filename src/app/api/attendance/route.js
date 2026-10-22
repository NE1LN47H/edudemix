
import { markAttendanceController } from "@/controllers/attendanceController";

export async function POST(request) {
  return markAttendanceController(request);
}