import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";
import { z } from "zod";

const staffSchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  role: z.enum(["admin", "teacher", "accountant"]).default("teacher"),
});

export async function getStaffMembers(centreId) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  await connectToDatabase();

  const staff = await User.find({ centreId })
    .select("_id name email role status createdAt")
    .sort({ createdAt: -1 })
    .lean();

  return staff;
}

export async function addStaffMember(centreId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  const data = staffSchema.parse(input);

  await connectToDatabase();

  const existingUser = await User.findOne({
    centreId,
    email: data.email,
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    centreId,
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
    status: "active",
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
}

export async function updateStaffStatus(centreId, userId, newStatus) {
  if (!mongoose.isValidObjectId(centreId) || !mongoose.isValidObjectId(userId)) {
    throw new Error("INVALID_IDENTIFIER");
  }

  await connectToDatabase();

  const user = await User.findOne({ _id: userId, centreId });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === "owner" && newStatus === "disabled") {
    throw new Error("CANNOT_DISABLE_OWNER");
  }

  user.status = newStatus;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function deleteStaffMember(centreId, userId) {
  if (!mongoose.isValidObjectId(centreId) || !mongoose.isValidObjectId(userId)) {
    throw new Error("INVALID_IDENTIFIER");
  }

  await connectToDatabase();

  const user = await User.findOne({ _id: userId, centreId });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === "owner") {
    throw new Error("CANNOT_DELETE_OWNER");
  }

  await User.deleteOne({ _id: userId, centreId });

  return { success: true, id: userId };
}
