import { z } from "zod";
import { customerSchema, productSchema } from "../merchant/schemas";
export const ONBOARDING_KEY = "sellwella-demo-onboarding-v1";
export const businessCategories = [
  "Fashion & Accessories",
  "Beauty & Personal Care",
  "Electronics",
  "Food & Beverages",
  "Home & Lifestyle",
  "General Retail",
  "Other",
] as const;
export const salesChannels = [
  "WhatsApp",
  "Instagram",
  "Facebook",
  "Physical Shop",
  "Website",
  "Other",
] as const;
export const brandThemes = [
  "terracotta",
  "emerald",
  "violet",
  "neutral",
] as const;
export const businessSchema = z.object({
  name: z.string().trim().min(1, "Enter your business name."),
  category: z.enum(businessCategories, {
    error: "Choose a business category.",
  }),
  phone: customerSchema.shape.phone,
  location: z.string().trim().min(1, "Enter your business location."),
  type: z.string().min(1),
  channels: z
    .array(z.enum(salesChannels))
    .min(1, "Choose at least one sales channel."),
});
export type BusinessForm = z.infer<typeof businessSchema>;
export const storeSchema = z.object({
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and single hyphens.",
    )
    .min(3, "Use at least 3 characters.")
    .max(40, "Use no more than 40 characters."),
  description: z.string().max(400),
  colour: z.enum(brandThemes),
  logoName: z.string(),
  coverName: z.string(),
});
export type StoreForm = z.infer<typeof storeSchema>;
export const firstProductSchema = productSchema
  .pick({ name: true, category: true, price: true, cost: true, stock: true })
  .extend({ description: z.string().max(2000), imageName: z.string() });
export type FirstProductForm = z.infer<typeof firstProductSchema>;
export const onboardingProgressSchema = z.object({
  step: z.number().int().min(1).max(4),
  complete: z.boolean(),
  business: businessSchema.extend({
    name: z.string(),
    category: z.string(),
    phone: z.string(),
    location: z.string(),
    channels: z.array(z.enum(salesChannels)),
  }),
  store: storeSchema.extend({ slug: z.string().max(80) }),
  addedProductIds: z.array(z.number().int().positive()),
});
export type OnboardingProgress = z.infer<typeof onboardingProgressSchema>;
export const defaultOnboarding: OnboardingProgress = {
  step: 1,
  complete: false,
  business: {
    name: "Amina's Fashion",
    category: "",
    phone: "",
    location: "Lagos",
    type: "Sole Proprietor",
    channels: ["WhatsApp"],
  },
  store: {
    slug: "aminas-fashion",
    description: "Everyday fashion and accessories, thoughtfully chosen.",
    colour: "terracotta",
    logoName: "",
    coverName: "",
  },
  addedProductIds: [],
};
export function readOnboardingProgress(): OnboardingProgress {
  try {
    const result = onboardingProgressSchema.safeParse(
      JSON.parse(localStorage.getItem(ONBOARDING_KEY) ?? "null"),
    );
    return result.success ? result.data : structuredClone(defaultOnboarding);
  } catch {
    return structuredClone(defaultOnboarding);
  }
}
export function onboardingComplete(data: OnboardingProgress) {
  return (
    data.complete &&
    businessSchema.safeParse(data.business).success &&
    storeSchema.safeParse(data.store).success
  );
}
