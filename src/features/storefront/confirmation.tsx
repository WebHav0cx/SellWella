"use client";
import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useMerchantStore } from "@/features/merchant/store";
import { useStoreCart } from "./cart-store";
import { formatMoney } from "@/lib/format-money";
export function StoreConfirmation({ orderId }: { orderId: number }) {
  const orders = useMerchantStore((state) => state.orders);
  const hydrated = useMerchantStore((state) => state.hydrated);
  const pay = useMerchantStore((state) => state.confirmDemoPayment);
  const slug = useStoreCart((state) => state.slug);
  const order = orders.find(
    (item) => item.id === orderId && item.source === "Storefront",
  );
  if (!hydrated)
    return (
      <main className="store-empty" aria-busy="true">
        Loading order…
      </main>
    );
  if (!order)
    return (
      <main className="store-empty">
        <h1>Order not found</h1>
        <Link href={`/store/${slug}`}>Return to shop</Link>
      </main>
    );
  const paid = order.paymentStatus === "Paid";
  const cancelled = order.orderStatus === "Cancelled";
  return (
    <main className="store-confirmation">
      <span className="confirmation-mark">
        {paid ? (
          <CheckCircle size={32} aria-hidden="true" />
        ) : (
          <Clock size={32} aria-hidden="true" />
        )}
      </span>
      <p>
        {paid
          ? "Demo payment confirmed"
          : cancelled
            ? "Order cancelled"
            : "Order reserved"}
      </p>
      <h1>
        {paid
          ? "Thank you for your order."
          : cancelled
            ? "This order has been cancelled."
            : "Your order is awaiting demo payment."}
      </h1>
      <p>
        Order {order.number} · {formatMoney(order.total)}
      </p>
      <div className="confirmation-card">
        <span>
          Payment status<strong>{order.paymentStatus}</strong>
        </span>
        <span>
          Fulfilment<strong>{order.fulfilmentStatus}</strong>
        </span>
        <span>
          Delivery<strong>{order.deliveryMethod ?? "Home delivery"}</strong>
        </span>
      </div>
      {order.paymentStatus === "Pending" && !cancelled && (
        <button
          className="store-primary"
          onClick={() => {
            const result = pay(order.id, "Storefront demo payment");
            if (result.ok) toast.success("Demo payment confirmed");
            else toast.error(result.error);
          }}
        >
          Confirm demo payment
        </button>
      )}
      <Link className="store-secondary" href={`/store/${slug}`}>
        Return to store
      </Link>
      <small>No external payment provider was contacted.</small>
    </main>
  );
}
