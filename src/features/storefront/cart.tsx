"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ProductImage } from "@/components/ui/product-image";
import { QuantityControl } from "@/components/ui/quantity-control";
import { formatMoney } from "@/lib/format-money";
import { useStoreCart, useCartDetails } from "./cart-store";
import { StoreOrderSummary } from "./order-summary";
export function StoreCart() {
  const slug = useStoreCart((state) => state.slug);
  const change = useStoreCart((state) => state.change);
  const { lines, subtotal } = useCartDetails();
  return (
    <main className="store-checkout-layout">
      <section>
        <Link className="store-back" href={`/store/${slug}`}>
          <ArrowLeft size={16} aria-hidden="true" /> Continue shopping
        </Link>
        <h1>Your bag</h1>
        {lines.length ? (
          lines.map((line) => {
            const available = line.product.onHand - line.product.reserved;
            const otherUnits = lines
              .filter(
                (other) =>
                  other.productId === line.productId &&
                  other.variant !== line.variant,
              )
              .reduce((sum, other) => sum + other.quantity, 0);
            const update = (quantity: number) => {
              if (!change(line, quantity, line.product))
                toast.error("That quantity is no longer available.");
            };
            return (
              <div
                className="store-cart-line"
                key={`${line.productId}-${line.variant}`}
              >
                <ProductImage product={line.product} />
                <span>
                  <strong>{line.product.name}</strong>
                  <small>{line.variant}</small>
                  <button type="button" onClick={() => update(0)}>
                    Remove
                  </button>
                </span>
                <QuantityControl
                  value={line.quantity}
                  label={line.product.name}
                  max={Math.max(0, available - otherUnits)}
                  onDecrease={() => update(line.quantity - 1)}
                  onIncrease={() => update(line.quantity + 1)}
                />
                <strong>
                  {formatMoney(line.product.price * line.quantity)}
                </strong>
              </div>
            );
          })
        ) : (
          <div className="store-empty">
            <h2>Your bag is empty</h2>
            <p>Explore the collection and add something you love.</p>
          </div>
        )}
      </section>
      <StoreOrderSummary subtotal={subtotal}>
        {lines.length > 0 && (
          <Link className="store-primary" href={`/store/${slug}/checkout`}>
            Continue to checkout
          </Link>
        )}
        <small>Stock is validated again when your order is created.</small>
      </StoreOrderSummary>
    </main>
  );
}
