
import mongoose from "mongoose";
import Student from "@/models/Student";
import connectToDatabase from "@/lib/mongodb";
import { createStudentSchema } from "@/validators/studentValidator";

export async function createStudent(centreId, input) {
  const validatedData = createStudentSchema.parse(input);

  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  await connectToDatabase();

  const student = await Student.create({
    ...validatedData,
    centreId,
    batchId: validatedData.batchId || null,
    admissionDate: validatedData.admissionDate
      ? new Date(validatedData.admissionDate)
      : new Date(),
  });

  return student;
}

export async function getStudents(
  centreId,
  { search = "", page = 1, limit = 10 } = {}
) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  await connectToDatabase();

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));

  const filter = { centreId };

  if (search.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { admissionNumber: { $regex: escapedSearch, $options: "i" } },
      { phone: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const [students, total] = await Promise.all([
    Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),

    Student.countDocuments(filter),
  ]);

  return {
    students,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}
