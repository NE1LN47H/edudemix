import mongoose from "mongoose";
import Student from "@/models/Student";
import Batch from "@/models/Batch";
import Attendance from "@/models/Attendance";
import Fee from "@/models/Fee";
import connectToDatabase from "@/lib/mongodb";

export async function getDashboardOverview(centreId) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  await connectToDatabase();
  const cId = new mongoose.Types.ObjectId(centreId);

  const todayStr = new Date().toISOString().slice(0, 10);
  const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
  const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

  const [
    totalStudents,
    activeStudents,
    batches,
    todayAttendance,
    overallAttendanceAgg,
    latestAttendanceRecord,
    feeAgg,
    recentStudents,
    recentFees,
  ] = await Promise.all([
    Student.countDocuments({ centreId: cId }),
    Student.countDocuments({ centreId: cId, status: "active" }),

    Batch.find({ centreId: cId, status: "active" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Attendance.find({
      centreId: cId,
      date: { $gte: startOfToday, $lte: endOfToday },
    }).lean(),

    Attendance.aggregate([
      { $match: { centreId: cId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    Attendance.findOne({ centreId: cId })
      .sort({ date: -1 })
      .select("date")
      .lean(),

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
          overdueCount: { $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] } },
        },
      },
    ]),

    Student.find({ centreId: cId })
      .populate("batchId", "name")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Fee.find({ centreId: cId })
      .populate("studentId", "name admissionNumber")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  // Compute Batch student counts
  const batchIds = batches.map((b) => b._id);
  const studentCounts = batchIds.length
    ? await Student.aggregate([
        { $match: { centreId: cId, batchId: { $in: batchIds } } },
        { $group: { _id: "$batchId", count: { $sum: 1 } } },
      ])
    : [];

  const countMap = new Map(
    studentCounts.map((item) => [String(item._id), item.count])
  );

  const batchesWithCounts = batches.map((b) => {
    const enrolled = countMap.get(String(b._id)) || 0;
    const capacity = b.capacity || 30;
    const percent = Math.min(100, Math.round((enrolled / capacity) * 100));
    return {
      _id: String(b._id),
      name: b.name,
      courseName: b.courseName,
      startTime: b.startTime,
      endTime: b.endTime,
      enrolled,
      capacity,
      percent,
    };
  });

  // Real today's attendance calculation
  let presentToday = 0;
  let absentToday = 0;
  let lateToday = 0;

  for (const record of todayAttendance) {
    if (record.status === "present") presentToday++;
    else if (record.status === "absent") absentToday++;
    else if (record.status === "late") lateToday++;
  }

  const markedToday = todayAttendance.length;

  // Real overall attendance calculation across all recorded sessions
  let totalMarkedEver = 0;
  let overallPresent = 0;
  let overallAbsent = 0;
  let overallLate = 0;

  for (const item of overallAttendanceAgg) {
    totalMarkedEver += item.count;
    if (item._id === "present") overallPresent = item.count;
    else if (item._id === "absent") overallAbsent = item.count;
    else if (item._id === "late") overallLate = item.count;
  }

  const overallAttendanceRate =
    totalMarkedEver > 0
      ? Math.round(((overallPresent + overallLate) / totalMarkedEver) * 100)
      : 0;

  // Real effective rate: if taken today, show today's rate; if not today but past records exist, show overall; otherwise 0%
  const attendanceRate =
    markedToday > 0
      ? Math.round(((presentToday + lateToday) / markedToday) * 100)
      : totalMarkedEver > 0
      ? overallAttendanceRate
      : 0;

  const finances = feeAgg[0] || {
    totalInvoiced: 0,
    totalCollected: 0,
    paidCount: 0,
    pendingCount: 0,
    partialCount: 0,
    overdueCount: 0,
  };
  const totalPending = Math.max(0, finances.totalInvoiced - finances.totalCollected);

  // Generate real 6-month historical & current collection chart data
  const now = new Date();
  const past6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1; // 1-12
    const monthName = d.toLocaleDateString("en-US", { month: "short" });
    const key = `${year}-${String(month).padStart(2, "0")}`;
    past6Months.push({
      key,
      year,
      month,
      monthName,
      startDate: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)),
      endDate: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)),
    });
  }

  const earliestDate = past6Months[0].startDate;

  const monthlyAgg = await Fee.aggregate([
    {
      $match: {
        centreId: cId,
        $or: [
          { paidDate: { $gte: earliestDate } },
          { createdAt: { $gte: earliestDate } },
        ],
      },
    },
    {
      $facet: {
        collectionsByMonth: [
          {
            $match: {
              paidAmount: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: {
                $cond: [
                  { $ne: ["$paidDate", null] },
                  { $dateToString: { format: "%Y-%m", date: "$paidDate" } },
                  { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                ],
              },
              total: { $sum: "$paidAmount" },
            },
          },
        ],
        invoicedByMonth: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m", date: "$createdAt" },
              },
              total: { $sum: "$amount" },
            },
          },
        ],
      },
    },
  ]);

  const collectionsData = monthlyAgg[0]?.collectionsByMonth || [];
  const invoicedData = monthlyAgg[0]?.invoicedByMonth || [];

  const collectionMap = new Map(
    collectionsData.map((item) => [item._id, item.total])
  );
  const invoicedMap = new Map(
    invoicedData.map((item) => [item._id, item.total])
  );

  // Find max value across all months for proportional height
  let maxBarAmount = 0;
  for (const m of past6Months) {
    const col = collectionMap.get(m.key) || 0;
    const inv = invoicedMap.get(m.key) || 0;
    if (col > maxBarAmount) maxBarAmount = col;
    if (inv > maxBarAmount) maxBarAmount = inv;
  }

  const collectionBars = past6Months.map((m) => {
    const collected = collectionMap.get(m.key) || 0;
    const invoiced = invoicedMap.get(m.key) || 0;
    const heightPercent =
      maxBarAmount > 0 ? Math.round((collected / maxBarAmount) * 100) : 0;
    const invoicedHeightPercent =
      maxBarAmount > 0 ? Math.round((invoiced / maxBarAmount) * 100) : 0;

    return {
      month: m.monthName,
      key: m.key,
      current: collected,
      previous: invoiced,
      heightPercent,
      invoicedHeightPercent,
    };
  });

  return {
    metrics: {
      totalStudents,
      activeStudents,
      activeBatches: batches.length,
      attendanceRate,
      presentToday,
      absentToday,
      lateToday,
      markedToday,
      totalMarkedEver,
      overallAttendanceRate,
      overallPresent,
      overallAbsent,
      latestAttendanceDate: latestAttendanceRecord
        ? latestAttendanceRecord.date.toISOString().slice(0, 10)
        : null,
      totalCollected: finances.totalCollected,
      totalPending,
      totalInvoiced: finances.totalInvoiced,
      paidCount: finances.paidCount,
      pendingCount: finances.pendingCount,
      partialCount: finances.partialCount,
      overdueCount: finances.overdueCount,
    },
    collectionBars,
    maxBarAmount,
    activeBatches: batchesWithCounts,
    recentActivity: recentFees.map((fee) => ({
      id: String(fee._id),
      studentName: fee.studentId?.name || "Student",
      admissionNumber: fee.studentId?.admissionNumber || "—",
      title: fee.title,
      amount: fee.paidAmount || fee.amount,
      status: fee.status,
      date: fee.paidDate || fee.createdAt,
    })),
    recentAdmissions: recentStudents.map((st) => ({
      id: String(st._id),
      name: st.name,
      admissionNumber: st.admissionNumber,
      batchName: st.batchId?.name || "Unassigned",
      phone: st.phone,
      status: st.status,
    })),
  };
}
