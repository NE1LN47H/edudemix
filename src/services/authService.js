import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import Centre from "@/models/Centre";
import User from "@/models/User";
import {
  loginSchema,
  registerCentreSchema,
} from "@/validators/authValidator";

export async function authenticateUser(input) {
  const credentials = loginSchema.parse(input);

  await connectToDatabase();

  const centre = await Centre.findOne({
    slug: credentials.centreSlug,
    status: "active",
  }).select("_id");

  if (!centre) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const user = await User.findOne({
    centreId: centre._id,
    email: credentials.email,
    status: "active",
  }).select("+passwordHash");

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user._id.toString(),
    centreId: user.centreId.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerCentre(input) {
  const data = registerCentreSchema.parse(input);

  await connectToDatabase();

  const passwordHash = await bcrypt.hash(data.password, 12);
  const centre = await Centre.create({
    name: data.centreName,
    slug: data.centreSlug,
    email: data.email,
    phone: data.phone,
  });

  try {
    const user = await User.create({
      centreId: centre._id,
      name: data.ownerName,
      email: data.email,
      passwordHash,
      role: "owner",
      status: "active",
    });

    return {
      centre: {
        id: centre._id.toString(),
        name: centre.name,
        slug: centre.slug,
      },
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    await Centre.deleteOne({ _id: centre._id });
    throw error;
  }
}

export async function getAuthenticatedCentre() {
  const session = await getSession();

  if (
    !session ||
    !mongoose.isValidObjectId(session.userId) ||
    !mongoose.isValidObjectId(session.centreId)
  ) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findOne({
    _id: session.userId,
    centreId: session.centreId,
    status: "active",
  }).select("_id name email centreId role");

  if (!user) {
    return null;
  }

  const centre = await Centre.findOne({
    _id: user.centreId,
    status: "active",
  }).select("_id name slug");

  if (!centre) {
    return null;
  }

  return {
    id: centre._id.toString(),
    centreName: centre.name,
    centreSlug: centre.slug,
    userId: user._id.toString(),
    userName: user.name,
    userEmail: user.email,
    role: user.role,
  };
}