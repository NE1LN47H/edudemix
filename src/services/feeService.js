import mongoose from "mongoose";
import Fee from "@/models/Fee";
import Student from "@/models/Student";
import connectToDatabase from "@/lib/mongodb";
import {
  createFeeSchema,
  recordPaymentSchema,
} from "@/validators/feeValidator";

function generateReceiptNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `REC-${dateStr}-${randomPart}`;
}

export async function createFee(centreId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  const data = createFeeSchema.parse(input);

  await connectToDatabase();

  const student = await Student.findOne({
    _id: data.studentId,
    centreId,
  }).select("_id batchId");

  if (!student) {
    throw new Error("STUDENT_NOT_FOUND");
  }

  let status = "pending";
  let receiptNumber = "";
  let paidDate = data.paidDate ? new Date(data.paidDate) : null;

  if (data.paidAmount >= data.amount) {
    status = "paid";
    receiptNumber = generateReceiptNumber();
    if (!paidDate) paidDate = new Date();
  } else if (data.paidAmount > 0) {
    status = "partial";
    receiptNumber = generateReceiptNumber();
    if (!paidDate) paidDate = new Date();
  }

  const fee = await Fee.create({
    centreId,
    studentId: student._id,
    batchId: data.batchId || student.batchId || null,
    title: data.title,
    amount: data.amount,
    paidAmount: data.paidAmount,
    dueDate: new Date(data.dueDate),
    paidDate,
    status,
    paymentMode: data.paymentMode || "none",
    receiptNumber,
    remarks: data.remarks || "",
  });

  return fee.populate([
    { path: "studentId", select: "name admissionNumber phone" },
    { path: "batchId", select: "name courseName" },
  ]);
}

export async function getFees(
  centreId,
  { search = "", status = "", page = 1, limit = 10 } = {}
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

  if (status && ["paid", "partial", "pending", "overdue"].includes(status)) {
    filter.status = status;
  }

  const trimmedSearch = String(search).trim();
  if (trimmedSearch) {
    const escapedSearch = trimmedSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    // Find student IDs matching search
    const matchingStudents = await Student.find({
      centreId,
      $or: [
        { name: { $regex: escapedSearch, $options: "i" } },
        { admissionNumber: { $regex: escapedSearch, $options: "i" } },
      ],
    }).select("_id");

    const studentIds = matchingStudents.map((s) => s._id);

    filter.$or = [
      { receiptNumber: { $regex: escapedSearch, $options: "i" } },
      { title: { $regex: escapedSearch, $options: "i" } },
      { studentId: { $in: studentIds } },
    ];
  }

  const [fees, total, statsAgg] = await Promise.all([
    Fee.find(filter)
      .populate("studentId", "name admissionNumber phone")
      .populate("batchId", "name courseName")
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),

    Fee.countDocuments(filter),

    // Calculate overall stats for this centre
    Fee.aggregate([
      { $match: { centreId: new mongoose.Types.ObjectId(centreId) } },
      {
        $group: {
          _id: null,
          totalInvoiced: { $sum: "$amount" },
          totalCollected: { $sum: "$paidAmount" },
          paidCount: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          partialCount: {
            $sum: { $cond: [{ $eq: ["$status", "partial"] }, 1, 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const stats = statsAgg[0] || {
    totalInvoiced: 0,
    totalCollected: 0,
    paidCount: 0,
    partialCount: 0,
    pendingCount: 0,
  };

  stats.totalPending = Math.max(0, stats.totalInvoiced - stats.totalCollected);

  return {
    fees,
    stats,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

export async function recordFeePayment(centreId, feeId, input) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  if (!mongoose.isValidObjectId(feeId)) {
    throw new Error("INVALID_FEE_ID");
  }

  const data = recordPaymentSchema.parse(input);

  await connectToDatabase();

  const fee = await Fee.findOne({
    _id: feeId,
    centreId,
  });

  if (!fee) {
    throw new Error("FEE_NOT_FOUND");
  }

  const newPaidAmount = fee.paidAmount + data.amount;
  const status = newPaidAmount >= fee.amount ? "paid" : "partial";
  const receiptNumber = fee.receiptNumber || generateReceiptNumber();
  const paidDate = data.paidDate ? new Date(data.paidDate) : new Date();

  fee.paidAmount = newPaidAmount;
  fee.status = status;
  fee.receiptNumber = receiptNumber;
  fee.paymentMode = data.paymentMode;
  fee.paidDate = paidDate;
  if (data.remarks) {
    fee.remarks = data.remarks;
  }

  await fee.save();

  return fee.populate([
    { path: "studentId", select: "name admissionNumber phone" },
    { path: "batchId", select: "name courseName" },
  ]);
}

export async function deleteFee(centreId, feeId) {
  if (!mongoose.isValidObjectId(centreId)) {
    throw new Error("INVALID_CENTRE_ID");
  }

  if (!mongoose.isValidObjectId(feeId)) {
    throw new Error("INVALID_FEE_ID");
  }

  await connectToDatabase();

  const fee = await Fee.findOneAndDelete({
    _id: feeId,
    centreId,
  });

  if (!fee) {
    throw new Error("FEE_NOT_FOUND");
  }

  return { success: true, id: feeId };
}
