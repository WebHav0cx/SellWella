import { formatMoney } from "@/lib/format-money";
import { ProductImage } from "@/components/ui/product-image";
import type { Product } from "@/features/merchant/data";
import type { CartLine } from "./cart-store";
export function StoreOrderSummary({
  subtotal,
  deliveryFee,
  lines,
  children,
}: {
  subtotal: number;
  deliveryFee?: number;
  lines?: (CartLine & { product: Product })[];
  children?: React.ReactNode;
}) {
  return (
    <aside className="store-order-summary">
      <h2>Order summary</h2>
      {lines?.map((line) => (
        <div
          className="checkout-mini-item"
          key={`${line.productId}-${line.variant}`}
        >
          <ProductImage product={line.product} />
          <span>
            {line.product.name}
            <small>
              {line.variant} · Qty {line.quantity}
            </small>
          </span>
          <strong>{formatMoney(line.product.price * line.quantity)}</strong>
        </div>
      ))}
      <span>
        Subtotal<strong>{formatMoney(subtotal)}</strong>
      </span>
      <span>
        Delivery
        <strong>
          {deliveryFee === undefined
            ? "Calculated at checkout"
            : formatMoney(deliveryFee)}
        </strong>
      </span>
      <div className="store-total">
        Total<strong>{formatMoney(subtotal + (deliveryFee ?? 0))}</strong>
      </div>
      {children}
    </aside>
  );
}
