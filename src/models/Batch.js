
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Centre",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Batch name is required"],
      trim: true,
      maxlength: 100,
    },

    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    scheduleDays: {
      type: [
        {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],
      default: [],
    },

    startTime: {
      type: String,
      trim: true,
      default: "",
    },

    endTime: {
      type: String,
      trim: true,
      default: "",
    },

    capacity: {
      type: Number,
      min: 1,
      default: 30,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate batch names within the same coaching centre.
batchSchema.index(
  { centreId: 1, name: 1 },
  { unique: true }
);

const Batch =
  mongoose.models.Batch || mongoose.model("Batch", batchSchema);

export default Batch;
