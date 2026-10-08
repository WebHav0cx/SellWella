import { ShoppingBag } from "lucide-react";
import type { OnboardingProgress } from "./schema";
export const brandClasses = {
  terracotta: "bg-primary",
  emerald: "bg-emerald-600",
  violet: "bg-violet-600",
  neutral: "bg-neutral-900",
};
export function BrandPreview({ data }: { data: OnboardingProgress }) {
  return (
    <div className="onboarding-store-preview">
      <span>LIVE ILLUSTRATIVE PREVIEW</span>
      <div>
        <header>
          <i className={brandClasses[data.store.colour]}>
            {data.business.name.slice(0, 2).toUpperCase()}
          </i>
          <strong>{data.business.name || "Your Store"}</strong>
          <b>
            <ShoppingBag size={16} aria-hidden="true" /> 0
          </b>
        </header>
        <main className="bg-primary-soft">
          <small>NEW COLLECTION</small>
          <h2>
            {data.store.description ||
              "Tell customers what makes your business special."}
          </h2>
          <button disabled className={brandClasses[data.store.colour]}>
            Shop now
          </button>
        </main>
        <footer>
          <span>Featured products</span>
          <i />
          <i />
          <i />
        </footer>
      </div>
      <small>sellwella.demo/store/{data.store.slug || "your-store"}</small>
    </div>
  );
}
