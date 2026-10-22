import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Centre from "@/models/Centre";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";
import { z } from "zod";

const centreUpdateSchema = z.object({
  name: z.string().trim().min(2, "Centre name is required").max(150),
  email: z.string().trim().email("Valid email required").or(z.literal("")).default(""),
  phone: z.string().trim().max(20).default(""),
});

const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  newPassword: z.string().min(6, "Password must have at least 6 characters").or(z.literal("")).optional(),
});

export async function getCentreSettings(centreId, userId) {
  if (!mongoose.isValidObjectId(centreId) || !mongoose.isValidObjectId(userId)) {
    throw new Error("INVALID_IDENTIFIER");
  }

  await connectToDatabase();

  const [centre, user] = await Promise.all([
    Centre.findById(centreId).lean(),
    User.findById(userId).select("name email role createdAt").lean(),
  ]);

  if (!centre || !user) {
    throw new Error("NOT_FOUND");
  }

  return {
    centre: {
      id: String(centre._id),
      name: centre.name,
      slug: centre.slug,
      email: centre.email || "",
      phone: centre.phone || "",
      status: centre.status,
    },
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      joined: user.createdAt,
    },
  };
}

export async function updateCentreSettings(centreId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  const data = centreUpdateSchema.parse(input);

  await connectToDatabase();

  const centre = await Centre.findByIdAndUpdate(
    centreId,
    {
      $set: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    },
    { new: true }
  ).lean();

  if (!centre) {
    throw new Error("CENTRE_NOT_FOUND");
  }

  return centre;
}

export async function updateUserProfile(userId, input) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("INVALID_USER_ID");
  }

  const data = profileUpdateSchema.parse(input);

  await connectToDatabase();

  const updateFields = { name: data.name };
  if (data.newPassword) {
    updateFields.passwordHash = await bcrypt.hash(data.newPassword, 12);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  ).select("name email role");

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}
