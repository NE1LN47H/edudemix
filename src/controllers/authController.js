
import { ZodError } from "zod";
import { authenticateUser } from "@/services/authService";
import {
  createSession,
  destroySession,
} from "@/lib/session";

export async function loginController(request) {
  try {
    const body = await request.json();
    const user = await authenticateUser(body);

    await createSession(user);

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          message: "Please enter valid login details",
        },
        { status: 400 }
      );
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return Response.json(
        {
          success: false,
          message: "Invalid centre, email or password",
        },
        { status: 401 }
      );
    }

    console.error("Login error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to log in right now",
      },
      { status: 500 }
    );
  }
}

export async function logoutController() {
  try {
    await destroySession();

    return Response.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to log out right now",
      },
      { status: 500 }
    );
  }
}
