"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Circle } from "lucide-react";
import { SellWellaLogo } from "@/components/common/sellwella-logo";
import { useMerchantStore } from "@/features/merchant/store";
import { useOnboarding } from "./store";
import { onboardingComplete } from "./schema";
export function OnboardingCompletePage() {
  const data = useOnboarding((state) => state.data);
  const hydrated = useOnboarding((state) => state.hydrated);
  const products = useMerchantStore((state) => state.products);
  if (!hydrated)
    return (
      <div className="focused-public-page" aria-busy="true">
        Loading setup…
      </div>
    );
  if (!onboardingComplete(data))
    return (
      <div className="focused-public-page">
        <SellWellaLogo />
        <div className="focused-card">
          <h1>Complete your business setup</h1>
          <Link className="auth-submit" href="/onboarding">
            Continue setup
          </Link>
        </div>
      </div>
    );
  const checklist = [
    ["Business created", true],
    ["Storefront configured", true],
    ["Products added", data.addedProductIds.length > 0 || products.length > 0],
    ["Payments setup", false],
    ["Sales channels connected", false],
  ] as const;
  return (
    <div className="onboarding-complete-page">
      <SellWellaLogo />
      <main>
        <Image
          className="complete-mark"
          src="/sellwella-mark.svg"
          alt=""
          width={64}
          height={64}
        />
        <p>SETUP COMPLETE</p>
        <h1>Welcome to SellWella!</h1>
        <h2>Your business workspace is ready. Let’s make selling easier.</h2>
        <div className="complete-checklist">
          {checklist.map(([label, complete]) => (
            <span className={complete ? "done" : ""} key={label}>
              {complete ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Circle size={18} aria-hidden="true" />
              )}
              {label}
              <small>{complete ? "Ready" : "Not connected"}</small>
            </span>
          ))}
        </div>
        <div className="complete-actions">
          <Link href="/app">
            Go to Dashboard <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/products">Add More Products</Link>
          <Link href={`/store/${data.store.slug}`}>Preview Store</Link>
          <Link href="/settings">Set Up Payments</Link>
        </div>
        <small>
          Payment and messaging integrations remain unconfigured in this
          demonstration.
        </small>
      </main>
    </div>
  );
}
