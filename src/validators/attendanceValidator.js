
import { z } from "zod";

export const markAttendanceSchema = z.object({
  batchId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid batch ID"),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00.000Z`);

      return (
        !Number.isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === value
      );
    }, "Enter a valid calendar date"),

  attendance: z
    .array(
      z.object({
        studentId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID"),

        status: z.enum(["present", "absent", "late"]),

        remarks: z
          .string()
          .trim()
          .max(300, "Remarks cannot exceed 300 characters")
          .optional()
          .default(""),
      })
    )
    .min(1, "Select at least one student")
    .max(500, "Too many attendance records"),
});
