import connectToDatabase from "@/lib/mongodb";
import Centre from "@/models/Centre";
import User from "@/models/User";
import Student from "@/models/Student";
import Batch from "@/models/Batch";
import Attendance from "@/models/Attendance";
import Fee from "@/models/Fee";
import { registerCentre } from "@/services/authService";

export function isSuperAdminAuthorized(request) {
  const configuredSecret = process.env.SUPERADMIN_SECRET;
  if (!configuredSecret) {
    return false;
  }

  const providedKey = request.headers.get("x-superadmin-key");
  return Boolean(providedKey && providedKey === configuredSecret);
}

export async function getAllCentresWithStats() {
  await connectToDatabase();

  const centres = await Centre.find({}).sort({ createdAt: -1 }).lean();

  const centresWithDetails = await Promise.all(
    centres.map(async (centre) => {
      const [owner, studentCount, batchCount] = await Promise.all([
        User.findOne({ centreId: centre._id, role: "owner" })
          .select("name email createdAt")
          .lean(),
        Student.countDocuments({ centreId: centre._id }),
        Batch.countDocuments({ centreId: centre._id }),
      ]);

      return {
        id: centre._id.toString(),
        name: centre.name,
        slug: centre.slug,
        email: centre.email,
        phone: centre.phone,
        status: centre.status || "active",
        createdAt: centre.createdAt,
        owner: owner
          ? {
              name: owner.name,
              email: owner.email,
            }
          : null,
        stats: {
          students: studentCount,
          batches: batchCount,
        },
      };
    })
  );

  return centresWithDetails;
}

export async function toggleCentreStatus(centreId, newStatus) {
  await connectToDatabase();

  const centre = await Centre.findByIdAndUpdate(
    centreId,
    { status: newStatus },
    { new: true }
  ).lean();

  if (!centre) {
    throw new Error("Centre not found");
  }

  return {
    id: centre._id.toString(),
    status: centre.status,
  };
}

export async function deleteCentreCompletely(centreId) {
  await connectToDatabase();

  const centre = await Centre.findById(centreId);
  if (!centre) {
    throw new Error("Coaching centre not found");
  }

  // Cascade delete all records belonging to this coaching centre
  await Promise.all([
    User.deleteMany({ centreId }),
    Student.deleteMany({ centreId }),
    Batch.deleteMany({ centreId }),
    Attendance.deleteMany({ centreId }),
    Fee.deleteMany({ centreId }),
    Centre.deleteOne({ _id: centreId }),
  ]);

  return {
    id: centreId,
    name: centre.name,
    slug: centre.slug,
  };
}

export { registerCentre };
