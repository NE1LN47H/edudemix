import { getAuthenticatedCentre } from "@/services/authService";

export async function withAuthenticatedCentre(action) {
  try {
    const centre = await getAuthenticatedCentre();

    if (!centre) {
      return Response.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    return await action(centre);
  } catch (error) {
    console.error("Authenticated API request failed:", error);

    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}