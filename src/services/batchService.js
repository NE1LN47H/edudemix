
import mongoose from "mongoose";
import Batch from "@/models/Batch";
import Student from "@/models/Student";
import connectToDatabase from "@/lib/mongodb";
import { createBatchSchema } from "@/validators/batchValidator";

export async function createBatch(centreId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  const validatedData = createBatchSchema.parse(input);

  await connectToDatabase();

  const batch = await Batch.create({
    ...validatedData,
    centreId,
    startDate: new Date(`${validatedData.startDate}T00:00:00.000Z`),
    endDate: new Date(`${validatedData.endDate}T00:00:00.000Z`),
  });

  return batch;
}

export async function getBatches(
  centreId,
  { search = "", page = 1, limit = 10 } = {}
) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  await connectToDatabase();

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));

  const filter = {
    centreId: new mongoose.Types.ObjectId(centreId),
  };

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    const escapedSearch = trimmedSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { courseName: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const [batches, total] = await Promise.all([
    Batch.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),

    Batch.countDocuments(filter),
  ]);

  // Count only students belonging to this centre.
  const batchIds = batches.map((batch) => batch._id);

  const studentCounts = batchIds.length
    ? await Student.aggregate([
        {
          $match: {
            centreId: new mongoose.Types.ObjectId(centreId),
            batchId: { $in: batchIds },
          },
        },
        {
          $group: {
            _id: "$batchId",
            count: { $sum: 1 },
          },
        },
      ])
    : [];

  const countMap = new Map(
    studentCounts.map((item) => [String(item._id), item.count])
  );

  const batchesWithCounts = batches.map((batch) => ({
    ...batch,
    studentCount: countMap.get(String(batch._id)) || 0,
  }));

  return {
    batches: batchesWithCounts,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}


export async function updateBatch(centreId, batchId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  if (!mongoose.isValidObjectId(batchId)) {
    throw new Error("INVALID_BATCH_ID");
  }

  const validatedData = createBatchSchema.parse(input);

  await connectToDatabase();

  const batch = await Batch.findOneAndUpdate(
    {
      _id: batchId,
      centreId,
    },
    {
      $set: {
        ...validatedData,
        startDate: new Date(
          `${validatedData.startDate}T00:00:00.000Z`
        ),
        endDate: new Date(
          `${validatedData.endDate}T00:00:00.000Z`
        ),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  return batch;
}

export async function deleteBatch(centreId, batchId) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  if (!mongoose.isValidObjectId(batchId)) {
    throw new Error("INVALID_BATCH_ID");
  }

  await connectToDatabase();

  const batch = await Batch.findOneAndDelete({
    _id: batchId,
    centreId,
  });

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // Unassign students from this batch
  await Student.updateMany(
    { centreId, batchId },
    { $set: { batchId: null } }
  );

  return { success: true, id: batchId };
}

