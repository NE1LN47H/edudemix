
import {
  markAttendanceController,
  getAttendanceController,
} from "@/controllers/attendanceController";

export async function GET(request) {
  return getAttendanceController(request);
}

export async function POST(request) {
  return markAttendanceController(request);
}