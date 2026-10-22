import {
  listStaff,
  createStaff,
} from "@/controllers/teacherController";

export async function GET(request) {
  return listStaff(request);
}

export async function POST(request) {
  return createStaff(request);
}
