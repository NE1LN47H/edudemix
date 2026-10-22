import { getReports } from "@/controllers/reportController";

export async function GET(request) {
  return getReports(request);
}
