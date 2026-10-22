
import {
  addStudent,
  listStudents,
} from "@/controllers/studentController";

export async function GET(request) {
  return listStudents(request);
}

export async function POST(request) {
  return addStudent(request);
}
