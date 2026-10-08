"use client";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useMerchantStore } from "@/features/merchant/store";
import { useOnboarding } from "./store";
import { businessSchema, storeSchema } from "./schema";
import { brandClasses } from "./brand-preview";
export function ReviewStep() {
  const router = useRouter();
  const data = useOnboarding((state) => state.data);
  const update = useOnboarding((state) => state.update);
  const products = useMerchantStore((state) => state.products);
  const finish = () => {
    if (!businessSchema.safeParse(data.business).success) {
      update((current) => ({ ...current, step: 1 }));
      toast.error("Complete the required business details.");
      return;
    }
    if (!storeSchema.safeParse(data.store).success) {
      update((current) => ({ ...current, step: 2 }));
      toast.error("Check your store URL.");
      return;
    }
    update((current) => ({ ...current, complete: true, step: 4 }));
    toast.success("Workspace setup complete");
    router.push("/onboarding/complete");
  };
  return (
    <section className="onboarding-card onboarding-review">
      <div className="setup-summary">
        <article className="complete">
          <Check aria-hidden="true" />
          <span>
            <strong>Business details</strong>
            <small>
              {data.business.name} · {data.business.category}
            </small>
          </span>
          <button
            onClick={() => update((current) => ({ ...current, step: 1 }))}
          >
            Edit
          </button>
        </article>
        <article className="complete">
          <Check aria-hidden="true" />
          <span>
            <strong>Storefront identity</strong>
            <small>sellwella.demo/store/{data.store.slug}</small>
          </span>
          <button
            onClick={() => update((current) => ({ ...current, step: 2 }))}
          >
            Edit
          </button>
        </article>
        <article
          className={data.addedProductIds.length ? "complete" : "optional"}
        >
          {data.addedProductIds.length ? (
            <Check aria-hidden="true" />
          ) : (
            <Minus aria-hidden="true" />
          )}
          <span>
            <strong>Products</strong>
            <small>
              {data.addedProductIds.length
                ? `${data.addedProductIds.length} product added during setup`
                : "No new onboarding product added"}
            </small>
          </span>
          <button
            onClick={() => update((current) => ({ ...current, step: 3 }))}
          >
            Review
          </button>
        </article>
        {["Payment provider", "Messaging integrations"].map((label) => (
          <article className="not-connected" key={label}>
            <TriangleAlert aria-hidden="true" />
            <span>
              <strong>{label}</strong>
              <small>Not connected </small>
            </span>
            <em>Later</em>
          </article>
        ))}
      </div>
      <div className="review-business-card">
        <span>YOUR WORKSPACE</span>
        <i className={brandClasses[data.store.colour]}>
          {data.business.name.slice(0, 2).toUpperCase()}
        </i>
        <h2>{data.business.name}</h2>
        <p>
          {data.business.location} · {data.business.channels.join(", ")}
        </p>
        <strong>{products.length} total catalogue products</strong>
      </div>
      <div className="onboarding-footer full">
        <button
          className="onboarding-back"
          onClick={() => update((current) => ({ ...current, step: 3 }))}
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back
        </button>
        <button className="onboarding-next" onClick={finish}>
          Finish Setup <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
