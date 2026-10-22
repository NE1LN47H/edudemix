
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

export async function getBatchAttendance(centreId, batchId, dateString) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  if (!mongoose.isValidObjectId(batchId)) {
    throw new Error("INVALID_BATCH_ID");
  }

  await connectToDatabase();

  const batch = await Batch.findOne({
    _id: batchId,
    centreId,
  }).lean();

  if (!batch) {
    throw new Error("BATCH_NOT_FOUND");
  }

  // Get all students enrolled in this batch
  const students = await Student.find({
    centreId,
    batchId,
  })
    .sort({ name: 1 })
    .lean();

  const targetDate = dateString
    ? new Date(`${dateString}T00:00:00.000Z`)
    : new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z");

  const formattedDate = targetDate.toISOString().slice(0, 10);

  // Fetch attendance records for this batch and date
  const records = await Attendance.find({
    centreId,
    batchId,
    date: targetDate,
  }).lean();

  const recordMap = new Map(
    records.map((r) => [String(r.studentId), r])
  );

  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let unmarkedCount = 0;

  const studentAttendance = students.map((s) => {
    const existing = recordMap.get(String(s._id));
    const status = existing ? existing.status : null;
    const remarks = existing ? existing.remarks || "" : "";

    if (status === "present") presentCount++;
    else if (status === "absent") absentCount++;
    else if (status === "late") lateCount++;
    else unmarkedCount++;

    return {
      studentId: String(s._id),
      name: s.name,
      admissionNumber: s.admissionNumber,
      phone: s.phone,
      status,
      remarks,
    };
  });

  return {
    batch: {
      id: String(batch._id),
      name: batch.name,
      courseName: batch.courseName,
      capacity: batch.capacity,
    },
    date: formattedDate,
    totalStudents: students.length,
    summary: {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      unmarked: unmarkedCount,
      percentage: students.length > 0 && (presentCount + lateCount > 0)
        ? Math.round(((presentCount + lateCount) / students.length) * 100)
        : 0,
    },
    attendance: studentAttendance,
  };
}

export async function getAttendanceOverview(centreId, dateString) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  await connectToDatabase();

  const targetDate = dateString
    ? new Date(`${dateString}T00:00:00.000Z`)
    : new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z");

  const [records, totalStudents] = await Promise.all([
    Attendance.find({
      centreId,
      date: targetDate,
    }).lean(),
    Student.countDocuments({ centreId, status: "active" }),
  ]);

  let present = 0;
  let absent = 0;
  let late = 0;

  for (const record of records) {
    if (record.status === "present") present++;
    else if (record.status === "absent") absent++;
    else if (record.status === "late") late++;
  }

  const marked = records.length;
  const unmarked = Math.max(0, totalStudents - marked);
  const percentage = marked > 0 ? Math.round(((present + late) / marked) * 100) : 0;

  return {
    date: targetDate.toISOString().slice(0, 10),
    totalStudents,
    marked,
    unmarked,
    present,
    absent,
    late,
    percentage,
  };
}
