import { z } from "zod";

export const createFeeSchema = z.object({
  studentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Valid student ID is required"),

  batchId: z
    .union([z.string().regex(/^[0-9a-fA-F]{24}$/), z.literal(""), z.null()])
    .optional()
    .default(null),

  title: z
    .string()
    .trim()
    .min(2, "Fee title is required")
    .max(100)
    .default("Monthly Tuition Fee"),

  amount: z
    .coerce
    .number()
    .min(1, "Fee amount must be greater than 0"),

  paidAmount: z
    .coerce
    .number()
    .min(0, "Paid amount cannot be negative")
    .default(0),

  dueDate: z
    .string()
    .min(1, "Due date is required"),

  paidDate: z
    .string()
    .optional()
    .nullable(),

  paymentMode: z
    .enum(["cash", "upi", "card", "bank_transfer", "cheque", "none"])
    .optional()
    .default("none"),

  remarks: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default(""),
});

export const recordPaymentSchema = z.object({
  amount: z
    .coerce
    .number()
    .min(1, "Payment amount must be greater than 0"),

  paymentMode: z
    .enum(["cash", "upi", "card", "bank_transfer", "cheque"]),

  paidDate: z
    .string()
    .optional(),

  remarks: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default(""),
});
