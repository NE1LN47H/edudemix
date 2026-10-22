import mongoose from "mongoose";
import Student from "@/models/Student";
import Batch from "@/models/Batch";
import Attendance from "@/models/Attendance";
import Fee from "@/models/Fee";
import connectToDatabase from "@/lib/mongodb";

export async function getReportsData(centreId) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  await connectToDatabase();
  const cId = new mongoose.Types.ObjectId(centreId);

  const [
    totalStudents,
    activeStudents,
    studentStatusAgg,
    batches,
    attendanceAgg,
    feeAgg,
    paymentModeAgg,
  ] = await Promise.all([
    Student.countDocuments({ centreId: cId }),
    Student.countDocuments({ centreId: cId, status: "active" }),

    Student.aggregate([
      { $match: { centreId: cId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    Batch.find({ centreId: cId }).lean(),

    Attendance.aggregate([
      { $match: { centreId: cId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    Fee.aggregate([
      { $match: { centreId: cId } },
      {
        $group: {
          _id: null,
          totalInvoiced: { $sum: "$amount" },
          totalCollected: { $sum: "$paidAmount" },
          paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          partialCount: { $sum: { $cond: [{ $eq: ["$status", "partial"] }, 1, 0] } },
        },
      },
    ]),

    Fee.aggregate([
      { $match: { centreId: cId, paidAmount: { $gt: 0 } } },
      { $group: { _id: "$paymentMode", total: { $sum: "$paidAmount" } } },
    ]),
  ]);

  // Compute Batch Occupancy
  const batchIds = batches.map((b) => b._id);
  const enrolledCounts = batchIds.length
    ? await Student.aggregate([
        { $match: { centreId: cId, batchId: { $in: batchIds } } },
        { $group: { _id: "$batchId", count: { $sum: 1 } } },
      ])
    : [];

  const enrolledMap = new Map(
    enrolledCounts.map((item) => [String(item._id), item.count])
  );

  const batchOccupancy = batches.map((b) => {
    const enrolled = enrolledMap.get(String(b._id)) || 0;
    const capacity = b.capacity || 30;
    const occupancyRate = Math.min(100, Math.round((enrolled / capacity) * 100));
    return {
      id: String(b._id),
      name: b.name,
      courseName: b.courseName,
      enrolled,
      capacity,
      occupancyRate,
    };
  });

  // Compute Attendance Stats
  let totalMarkedAttendance = 0;
  let presentAttendance = 0;
  let absentAttendance = 0;
  let lateAttendance = 0;

  for (const item of attendanceAgg) {
    totalMarkedAttendance += item.count;
    if (item._id === "present") presentAttendance = item.count;
    else if (item._id === "absent") absentAttendance = item.count;
    else if (item._id === "late") lateAttendance = item.count;
  }

  const overallAttendanceRate =
    totalMarkedAttendance > 0
      ? Math.round(((presentAttendance + lateAttendance) / totalMarkedAttendance) * 100)
      : 0;

  // Compute Financial Stats
  const feeStats = feeAgg[0] || {
    totalInvoiced: 0,
    totalCollected: 0,
    paidCount: 0,
    pendingCount: 0,
    partialCount: 0,
  };
  const totalPending = Math.max(0, feeStats.totalInvoiced - feeStats.totalCollected);

  return {
    students: {
      total: totalStudents,
      active: activeStudents,
      statusBreakdown: studentStatusAgg.map((s) => ({
        status: s._id || "unknown",
        count: s.count,
      })),
    },
    batches: {
      total: batches.length,
      occupancy: batchOccupancy,
    },
    attendance: {
      totalMarked: totalMarkedAttendance,
      present: presentAttendance,
      absent: absentAttendance,
      late: lateAttendance,
      rate: overallAttendanceRate,
    },
    finances: {
      totalInvoiced: feeStats.totalInvoiced,
      totalCollected: feeStats.totalCollected,
      totalPending,
      collectionRate:
        feeStats.totalInvoiced > 0
          ? Math.round((feeStats.totalCollected / feeStats.totalInvoiced) * 100)
          : 0,
      paymentModes: paymentModeAgg.map((pm) => ({
        mode: pm._id || "none",
        amount: pm.total,
      })),
    },
  };
}
