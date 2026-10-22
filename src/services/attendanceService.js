
import mongoose from "mongoose";
import Attendance from "@/models/Attendance";
import Batch from "@/models/Batch";
import Student from "@/models/Student";
import connectToDatabase from "@/lib/mongodb";
import { markAttendanceSchema } from "@/validators/attendanceValidator";

export async function markAttendance(centreId, userId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("INVALID_USER_ID");
  }

  const data = markAttendanceSchema.parse(input);

  await connectToDatabase();

  // Verify that the batch belongs to this centre.
  const batch = await Batch.findOne({
    _id: data.batchId,
    centreId,
  }).select("_id");

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // Prevent duplicate student IDs in the same request.
  const studentIds = data.attendance.map(
    (record) => record.studentId
  );

  if (new Set(studentIds).size !== studentIds.length) {
    throw new Error("DUPLICATE_STUDENTS");
  }

  // Verify that every student belongs to this centre and batch.
  const validStudents = await Student.find({
    _id: { $in: studentIds },
    centreId,
    batchId: batch._id,
  }).select("_id");

  if (validStudents.length !== studentIds.length) {
    throw new Error("STUDENTS_NOT_IN_BATCH");
  }

  // Store the date consistently at UTC midnight.
  const attendanceDate = new Date(
    `${data.date}T00:00:00.000Z`
  );

  // Insert new records or update existing records for that day.
  const operations = data.attendance.map((record) => ({
    updateOne: {
      filter: {
        centreId,
        batchId: batch._id,
        studentId: record.studentId,
        date: attendanceDate,
      },
      update: {
        $set: {
          status: record.status,
          remarks: record.remarks,
          markedBy: userId,
        },
        $setOnInsert: {
          centreId,
          batchId: batch._id,
          studentId: record.studentId,
          date: attendanceDate,
        },
      },
      upsert: true,
    },
  }));

  await Attendance.bulkWrite(operations);

  // Return the saved records.
  const records = await Attendance.find({
    centreId,
    batchId: batch._id,
    studentId: { $in: studentIds },
    date: attendanceDate,
  })
    .populate("studentId", "name admissionNumber")
    .sort({ createdAt: 1 })
    .lean();

  return {
    date: data.date,
    batchId: batch._id.toString(),
    total: records.length,
    records,
  };
}
