import { z } from "zod";
import { customerSchema } from "./schemas";
const quantity = z.number().int().positive();
const amount = z.number().finite().nonnegative();
export const fulfilmentStatusSchema = z.enum([
  "Unfulfilled",
  "Processing",
  "Ready",
  "Ready to Pack",
  "Packed",
  "Ready for Dispatch",
  "Delivered",
]);
export const createOrderSchema = z
  .object({
    customerId: quantity.optional(),
    customer: customerSchema
      .pick({ name: true, phone: true })
      .extend({
        email: z.union([z.email(), z.literal("")]).optional(),
        location: z.string().optional(),
      })
      .optional(),
    source: z.string().trim().min(1),
    items: z
      .array(
        z.object({
          productId: quantity,
          quantity,
          variant: z.string().optional(),
        }),
      )
      .min(1, "Add at least one product."),
    deliveryFee: amount.optional(),
    mode: z.enum(["draft", "order", "link", "paid"]).optional(),
    paymentMethod: z.string().optional(),
    deliveryMethod: z.enum(["Home delivery", "Store pickup"]).optional(),
  })
  .refine(
    (input) => input.customerId || input.customer,
    "Select a valid customer.",
  );
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export const savedCommerceSchema = z.object({
  products: z.array(
    z
      .object({
        id: quantity,
        name: z.string(),
        category: z.string(),
        sku: z.string(),
        price: amount,
        cost: amount,
        onHand: z.number().int().nonnegative(),
        reserved: z.number().int().nonnegative(),
        threshold: z.number().int().nonnegative(),
        published: z.boolean(),
        image: z.string(),
        description: z.string().optional(),
        imageName: z.string().optional(),
      })
      .refine((p) => p.reserved <= p.onHand),
  ),
  customers: z.array(
    z.object({
      id: quantity,
      name: z.string(),
      initials: z.string(),
      phone: z.string(),
      email: z.string(),
      source: z.string(),
      orders: z.number().int().nonnegative(),
      spend: amount,
      lastActivity: z.string(),
      segment: z.enum(["New", "Returning", "VIP", "Inactive"]),
      location: z.string(),
      notes: z.string(),
    }),
  ),
  orders: z.array(
    z.object({
      id: quantity,
      number: z.string(),
      customerId: quantity,
      customerName: z.string(),
      source: z.string(),
      items: z.array(
        z.object({
          productId: quantity,
          name: z.string(),
          quantity,
          unitPrice: amount,
          variant: z.string().optional(),
        }),
      ),
      subtotal: amount,
      deliveryFee: amount,
      total: amount,
      orderStatus: z.enum([
        "Draft",
        "Awaiting Payment",
        "Processing",
        "Completed",
        "Cancelled",
      ]),
      paymentStatus: z.enum(["Pending", "Paid", "Refunded"]),
      fulfilmentStatus: fulfilmentStatusSchema,
      createdAt: z.string(),
      paymentLink: z.string().optional(),
      paymentMethod: z.string().optional(),
      deliveryMethod: z.enum(["Home delivery", "Store pickup"]).optional(),
    }),
  ),
  activities: z.array(
    z.object({
      id: quantity,
      type: z.enum([
        "product",
        "inventory",
        "order",
        "payment",
        "customer",
        "fulfilment",
      ]),
      title: z.string(),
      description: z.string(),
      createdAt: z.string(),
      read: z.boolean(),
      priority: z.enum(["info", "attention", "success"]),
      destination: z
        .string()
        .refine((value) => value.startsWith("/") && !value.startsWith("//")),
    }),
  ),
});
export type ActivityEvent = z.infer<
  typeof savedCommerceSchema
>["activities"][number];
