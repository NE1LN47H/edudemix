
import { ZodError } from "zod";
import {
  authenticateUser,
  getAuthenticatedCentre,
  registerCentre,
} from "@/services/authService";
import { isSuperAdminAuthorized } from "@/services/superAdminService";
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

export async function sessionController() {
  const centre = await getAuthenticatedCentre();

  return Response.json({
    authenticated: Boolean(centre),
    user: centre
      ? {
          id: centre.userId,
          name: centre.userName,
          email: centre.userEmail,
          role: centre.role,
          centreName: centre.centreName,
          centreSlug: centre.centreSlug,
        }
      : null,
  });
}

export async function registerCentreController(request) {
  if (!isSuperAdminAuthorized(request)) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized: SaaS Administrator access required to register centres",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const result = await registerCentre(body);

    return Response.json(
      {
        success: true,
        message: "Centre registered successfully",
        ...result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          message: "Invalid registration details",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error?.code === 11000) {
      return Response.json(
        {
          success: false,
          message: "That centre slug or owner email already exists",
        },
        { status: 409 }
      );
    }

    console.error("Centre registration error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to register centre",
      },
      { status: 500 }
    );
  }
}
