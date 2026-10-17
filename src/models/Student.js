
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    admissionNumber: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    guardianName: {
      type: String,
      trim: true,
      default: "",
    },

    guardianPhone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index(
  { centreId: 1, admissionNumber: 1 },
  { unique: true }
);

const Student =
  mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

export default Student;
