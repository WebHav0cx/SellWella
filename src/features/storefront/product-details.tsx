"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useMerchantStore } from "@/features/merchant/store";
import { ProductImage } from "@/components/ui/product-image";
import { formatMoney } from "@/lib/format-money";
import { useStoreCart } from "./cart-store";
export function StoreProductDetails({ productId }: { productId: number }) {
  const products = useMerchantStore((state) => state.products);
  const hydrated = useMerchantStore((state) => state.hydrated);
  const slug = useStoreCart((state) => state.slug);
  const add = useStoreCart((state) => state.add);
  const [variant, setVariant] = useState("Standard");
  const product = products.find(
    (item) => item.id === productId && item.published,
  );
  if (!hydrated)
    return (
      <main className="store-empty" aria-busy="true">
        Loading product…
      </main>
    );
  if (!product)
    return (
      <main className="store-empty">
        <h1>Product unavailable</h1>
        <Link href={`/store/${slug}`}>Return to shop</Link>
      </main>
    );
  const available = product.onHand - product.reserved;
  return (
    <main className="store-product-page">
      <Link className="store-back" href={`/store/${slug}`}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to shop
      </Link>
      <div className="store-product-detail">
        <div className="store-detail-image">
          <ProductImage product={product} />
        </div>
        <div className="store-detail-copy">
          <span>{product.category}</span>
          <h1>{product.name}</h1>
          <strong>{formatMoney(product.price)}</strong>
          <p>
            A versatile, thoughtfully selected piece designed to fit beautifully
            into your everyday wardrobe.
          </p>
          <label>
            Choose option
            <select
              value={variant}
              onChange={(event) => setVariant(event.target.value)}
            >
              <option>Standard</option>
              <option>Black</option>
              <option>Brown</option>
            </select>
          </label>
          <div className="store-availability">{available} available now</div>
          <button
            className="store-primary"
            disabled={available <= 0}
            onClick={() =>
              add(product, variant)
                ? toast.success("Added to your bag")
                : toast.error("Your bag already contains all available stock.")
            }
          >
            Add to bag
          </button>
          <div className="store-policy">
            <strong>Delivery & pickup</strong>
            <p>Choose delivery or free store pickup during checkout.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
