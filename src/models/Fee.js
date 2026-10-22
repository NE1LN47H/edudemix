import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Centre",
      required: true,
      index: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Tuition Fee",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    paidDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["paid", "partial", "pending", "overdue"],
      default: "pending",
      index: true,
    },

    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card", "bank_transfer", "cheque", "none"],
      default: "none",
    },

    receiptNumber: {
      type: String,
      trim: true,
      default: "",
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

feeSchema.index({ centreId: 1, createdAt: -1 });

const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);

export default Fee;
