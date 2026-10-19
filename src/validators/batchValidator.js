
import { z } from "zod";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const createBatchSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Batch name must contain at least 2 characters")
      .max(100, "Batch name cannot exceed 100 characters"),

    courseName: z
      .string()
      .trim()
      .min(2, "Course name must contain at least 2 characters")
      .max(100, "Course name cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .default(""),

    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine((value) => {
        const date = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === value;
      }, "Enter a valid start date"),

    endDate: z
      .string()
      .min(1, "End date is required")
      .refine((value) => {
        const date = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === value;
      }, "Enter a valid end date"),

    scheduleDays: z
      .array(z.enum(DAYS))
      .max(7, "Select valid class days")
      .optional()
      .default([]),

    startTime: z
      .string()
      .regex(/^$|([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid start time")
      .optional()
      .default(""),

    endTime: z
      .string()
      .regex(/^$|([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid end time")
      .optional()
      .default(""),

    capacity: z
      .coerce
      .number()
      .int("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1")
      .max(10000, "Capacity is too large")
      .default(30),

    status: z
      .enum(["active", "inactive", "completed"])
      .default("active"),
  })
  .refine(
    (data) => data.endDate >= data.startDate,
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    }
  )
  .refine(
    (data) =>
      !data.startTime ||
      !data.endTime ||
      data.endTime > data.startTime,
    {
      message: "End time must be later than start time",
      path: ["endTime"],
    }
  );
