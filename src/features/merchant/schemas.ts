import { z } from "zod";
const nonNegative = z
  .string()
  .refine(
    (value) =>
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0,
    "Enter a valid non-negative number.",
  );
const optionalAmount = z
  .string()
  .refine(
    (value) =>
      value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0),
    "Enter a valid non-negative amount.",
  );
const units = nonNegative.refine(
  (value) => Number.isSafeInteger(Number(value)),
  "Enter a whole number.",
);
export const productSchema = z.object({
  name: z.string().trim().min(1, "Enter a product name."),
  category: z.string().min(1),
  sku: z.string().trim(),
  price: nonNegative,
  cost: optionalAmount,
  stock: units,
  threshold: units,
  published: z.boolean(),
});
export type ProductForm = z.infer<typeof productSchema>;
export const customerSchema = z.object({
  name: z.string().trim().min(1, "Enter the customer's name."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, "Enter a valid phone number."),
  email: z.union([z.email(), z.literal("")]),
  source: z.string().min(1),
  location: z.string().trim(),
});
export type CustomerForm = z.infer<typeof customerSchema>;
export const adjustmentSchema = z.object({
  quantity: z
    .string()
    .refine(
      (value) =>
        value.trim() !== "" &&
        Number.isSafeInteger(Number(value)) &&
        Number(value) !== 0,
      "Enter a non-zero whole number.",
    ),
  reason: z.string().min(1, "Select a reason."),
});
export type AdjustmentForm = z.infer<typeof adjustmentSchema>;
export const orderSchema = z.object({
  customerId: z.number().int().positive("Select a customer."),
  source: z.string().min(1),
  deliveryFee: optionalAmount,
  notes: z.string(),
});
export type OrderForm = z.infer<typeof orderSchema>;
