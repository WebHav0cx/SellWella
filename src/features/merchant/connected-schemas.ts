import { z } from "zod";
import { customerSchema } from "./schemas";
export const replySchema = z.object({
  composer: z
    .string()
    .trim()
    .min(1, "Write a reply before sending.")
    .max(2000, "Keep the reply under 2,000 characters."),
});
export type ReplyForm = z.infer<typeof replySchema>;
export const posSchema = z.object({
  customerId: z.number().int().positive("Select a customer."),
  paymentMethod: z.enum(["Cash", "Demo digital"]),
});
export type PosForm = z.infer<typeof posSchema>;
export const checkoutSchema = customerSchema
  .pick({ name: true, phone: true, email: true })
  .extend({
    address: z
      .string()
      .trim()
      .min(1, "Enter delivery or pickup contact details."),
    delivery: z.enum(["Home delivery", "Store pickup"]),
  });
export type CheckoutForm = z.infer<typeof checkoutSchema>;
