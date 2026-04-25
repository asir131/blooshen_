import { z } from "zod";
import { detectPlaceholderText } from "@/lib/utils";

const noPlaceholder = (msg = "Contains placeholder text") =>
  (val: string) => detectPlaceholderText(val).length === 0 || msg;

export const listingSchema = z.object({
  vin: z
    .string()
    .length(17, "VIN must be exactly 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/i, "Invalid VIN format (no I, O, Q allowed)")
    .refine((v) => detectPlaceholderText(v).length === 0, "VIN contains placeholder text"),
  make: z
    .string()
    .min(1, "Make is required")
    .max(50, "Make must be under 50 chars")
    .refine((v) => noPlaceholder()(v) === true, "Make contains placeholder text"),
  model: z
    .string()
    .min(1, "Model is required")
    .max(50, "Model must be under 50 chars"),
  year: z
    .number({ invalid_type_error: "Year is required" })
    .int()
    .min(1900, "Year must be ≥ 1900")
    .max(2030, "Year must be ≤ 2030"),
  mileage: z
    .number({ invalid_type_error: "Mileage is required" })
    .int()
    .min(0, "Mileage cannot be negative"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be positive")
    .min(500, "Price must be at least $500")
    .max(500_000, "Price must be at most $500,000"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .refine((v) => detectPlaceholderText(v).length === 0, "Description contains placeholder text"),
  seller_type: z.enum(["dealer", "private", "broker"], {
    required_error: "Seller type is required",
  }),
  body_style: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  condition: z.enum(["new", "used", "certified"], {
    required_error: "Condition is required",
  }),
});

export type ListingFormValues = z.infer<typeof listingSchema>;

export const BODY_STYLES = [
  "Sedan",
  "SUV",
  "Truck",
  "Coupe",
  "Convertible",
  "Wagon",
  "Hatchback",
  "Van",
  "Minivan",
];
