import { z } from "zod";

export const loginSchema = z.object({
  centreSlug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/),

  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1).max(128),
});

export const registerCentreSchema = z.object({
  centreName: z.string().trim().min(2).max(150),

  centreSlug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),

  ownerName: z.string().trim().min(2).max(100),

  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),

  password: z.string().min(8).max(128),

  phone: z.string().trim().max(30).optional().default(""),
});