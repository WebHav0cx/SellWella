"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { SellWellaLogo } from "@/components/common/sellwella-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useOnboarding } from "./store";
import { BusinessStep } from "./business-step";
import { StoreStep } from "./store-step";
import { ProductStep } from "./product-step";
import { ReviewStep } from "./review-step";
const stepCopy = [
  {
    title: "Tell us about your business",
    description:
      "Start with the basics. You can update these details later from Settings.",
  },
  {
    title: "Make your store yours",
    description:
      "Create an illustrative storefront identity customers will recognise.",
  },
  {
    title: "Let’s add your first product",
    description:
      "This product will appear in your shared catalogue, inventory and public demo store.",
  },
  {
    title: "You’re almost ready!",
    description:
      "Review your setup and enter your connected commerce workspace.",
  },
];
export function OnboardingPage() {
  const data = useOnboarding((state) => state.data);
  const hydrated = useOnboarding((state) => state.hydrated);
  const copy = stepCopy[data.step - 1];
  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        <SellWellaLogo />
        <span>Progress saved in this browser · Demo setup</span>
        <ThemeToggle />
        <Link href="/login">Save & exit</Link>
      </header>
      <div className="onboarding-progress">
        {[1, 2, 3, 4].map((step) => (
          <div
            className={data.step >= step ? "active" : ""}
            key={step}
            aria-current={data.step === step ? "step" : undefined}
          >
            <i>
              {data.step > step ? <Check size={16} aria-hidden="true" /> : step}
            </i>
            <span>{["Business", "Store", "Products", "Finish"][step - 1]}</span>
          </div>
        ))}
      </div>
      <main className="onboarding-main">
        {!hydrated ? (
          <p aria-busy="true">Loading saved setup…</p>
        ) : (
          <>
            <section className="onboarding-copy">
              <span>STEP {data.step} OF 4</span>
              <h1>{copy.title}</h1>
              <p>{copy.description}</p>
            </section>
            {data.step === 1 ? (
              <BusinessStep />
            ) : data.step === 2 ? (
              <StoreStep />
            ) : data.step === 3 ? (
              <ProductStep />
            ) : (
              <ReviewStep />
            )}
          </>
        )}
      </main>
    </div>
  );
}
