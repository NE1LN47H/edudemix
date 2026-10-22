import { redirect } from "next/navigation";
import { getAuthenticatedCentre } from "@/services/authService";

export async function requireAuthenticatedCentre() {
  const centre = await getAuthenticatedCentre();

  if (!centre) {
    redirect("/login");
  }

  return centre;
}