
import bcrypt from "bcryptjs";
import { z } from "zod";
import connectToDatabase from "@/lib/mongodb";
import Centre from "@/models/Centre";
import User from "@/models/User";

const loginSchema = z.object({
  centreSlug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),

  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1).max(128),
});

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
