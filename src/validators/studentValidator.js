
import { z } from "zod";

export const createStudentSchema = z.object({
  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required")
    .max(30),

  name: z
    .string()
    .trim()
    .min(2, "Student name must contain at least 2 characters")
    .max(100),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),

  guardianName: z.string().trim().max(100).optional().default(""),

  guardianPhone: z
    .string()
    .trim()
    .regex(/^$|^[0-9]{10}$/, "Enter a valid 10-digit guardian number")
    .optional()
    .default(""),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .optional()
    .default(""),

  batchId: z
    .union([z.string().regex(/^[0-9a-fA-F]{24}$/), z.literal("")])
    .optional()
    .default(""),

  admissionDate: z
    .string()
    .optional(),

  status: z
    .enum(["active", "inactive", "completed"])
    .optional()
    .default("active"),

  address: z.string().trim().max(500).optional().default(""),
});
