
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Centre",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "teacher", "accountant"],
      default: "teacher",
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// The same email can exist in different centres,
// but only once within a particular centre.
userSchema.index(
  { centreId: 1, email: 1 },
  { unique: true }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;
