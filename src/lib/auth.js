
import mongoose from "mongoose";
import { getSession } from "@/lib/session";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Centre from "@/models/Centre";

export async function getAuthenticatedCentre() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (
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
  }).select("_id centreId role");

  if (!user) {
    return null;
  }

  const centre = await Centre.findOne({
    _id: user.centreId,
    status: "active",
  }).select("_id");

  if (!centre) {
    return null;
  }

  return {
    id: centre._id.toString(),
    userId: user._id.toString(),
    role: user.role,
  };
}
