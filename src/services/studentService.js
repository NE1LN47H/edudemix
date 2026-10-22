
import mongoose from "mongoose";
import Student from "@/models/Student";
import Batch from "@/models/Batch";
import connectToDatabase from "@/lib/mongodb";
import { createStudentSchema } from "@/validators/studentValidator";

export async function createStudent(centreId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  const validatedData = createStudentSchema.parse(input);

  await connectToDatabase();

  // Verify that the selected batch belongs to this centre.
  let batchId = null;

  if (validatedData.batchId) {
    if (!mongoose.isValidObjectId(validatedData.batchId)) {
      throw new Error("INVALID_BATCH_ID");
    }

    const batch = await Batch.findOne({
      _id: validatedData.batchId,
      centreId,
    }).select("_id");

    if (!batch) {
      throw new Error("BATCH_NOT_FOUND");
    }

    batchId = batch._id;
  }

  const student = await Student.create({
    ...validatedData,
    centreId,
    batchId,
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

  // Escape special regex characters in the search input.
  const trimmedSearch = String(search).trim();

  if (trimmedSearch) {
    const escapedSearch = trimmedSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      {
        admissionNumber: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
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
