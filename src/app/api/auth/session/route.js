
import { getAuthenticatedCentre } from "@/lib/auth";

export async function GET() {
  const centre = await getAuthenticatedCentre();

  return Response.json({
    authenticated: Boolean(centre),
  });
}
