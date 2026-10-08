import assert from "node:assert/strict";
import test from "node:test";
import { registerHooks } from "node:module";
registerHooks({ resolve(specifier, context, nextResolve) { if (specifier.startsWith(".") && context.parentURL?.includes("/src/") && !/\.[a-z]+$/i.test(specifier)) return nextResolve(`${specifier}.ts`, context); return nextResolve(specifier,context); } });
const { signupSchema, resetSchema, verificationSchema, demoSessionSchema } = await import("../src/features/auth/schemas.ts");
const { defaultOnboarding, onboardingProgressSchema, onboardingComplete, businessSchema, storeSchema, firstProductSchema } = await import("../src/features/onboarding/schema.ts");
test("signup validates passwords and consent; session metadata never includes credentials", () => {
 const form = { name: "Demo Merchant", email: "demo@example.com", password: "DemoPass123", confirm: "DemoPass123", terms: true };
 assert.equal(signupSchema.safeParse(form).success,true);
 for (const changed of [{ confirm: "different" },{ terms: false },{ email: "invalid" },{ password: "short", confirm: "short" }]) assert.equal(signupSchema.safeParse({ ...form,...changed }).success,false);
 const metadata = demoSessionSchema.parse({ name: form.name, email: form.email, verified: false, demo: true, invited: false, password: form.password, confirm: form.confirm });
 assert.equal("password" in metadata,false); assert.equal("confirm" in metadata,false);
});
test("reset and demo verification reject malformed input", () => {
 assert.equal(resetSchema.safeParse({ password: "DemoPass123", confirm: "other" }).success,false);
 for(const code of ["", "123456"]) assert.equal(verificationSchema.safeParse({ code }).success,true);
 for(const code of ["12", "abc123"]) assert.equal(verificationSchema.safeParse({ code }).success,false);
});
test("draft setup can be restored but completion requires valid business and store details", () => {
 assert.equal(onboardingProgressSchema.safeParse(defaultOnboarding).success,true);
 assert.equal(onboardingComplete({ ...defaultOnboarding, complete: true }),false);
 const business = { ...defaultOnboarding.business, category: "Fashion & Accessories", phone: "+2348012345678" };
 assert.equal(businessSchema.safeParse(business).success,true);
 assert.equal(onboardingComplete({ ...defaultOnboarding, business, complete: true }),true);
 for(const slug of ["a", "../../bad", "Bad Slug", "store--name"]) assert.equal(storeSchema.safeParse({ ...defaultOnboarding.store,slug }).success,false);
 assert.equal(onboardingProgressSchema.safeParse({ ...defaultOnboarding, step: 99 }).success,false);
});
test("first-product setup validates stock and costs without losing zero stock", () => {
 const product = { name: "Tote", category: "Bags", price: "15000", cost: "", stock: "0", description: "Cotton tote", imageName: "" };
 assert.equal(firstProductSchema.safeParse(product).success,true);
 for(const update of [{ cost: "-1" },{ stock: "1.5" },{ price: "NaN" }]) assert.equal(firstProductSchema.safeParse({ ...product,...update }).success,false);
});
