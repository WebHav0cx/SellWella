"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMerchantStore } from "./store";
import { formatMoney } from "@/lib/format-money";

import type { BusinessOrder } from "./data";
const fulfilmentStages: BusinessOrder["fulfilmentStatus"][] = [
  "Ready to Pack",
  "Packed",
  "Ready for Dispatch",
  "Delivered",
];

export function FulfilmentPage() {
  const orders = useMerchantStore((state) => state.orders);
  const updateFulfilment = useMerchantStore((state) => state.updateFulfilment);

  const router = useRouter();
  const navigate = (href: string) => router.push(href);
  const [view, setView] = useState<"board" | "table">("board");
  const fulfilmentOrders: BusinessOrder[] = orders
    .filter(
      (order) =>
        order.paymentStatus === "Paid" && order.orderStatus !== "Cancelled",
    )
    .map((order): BusinessOrder =>
      fulfilmentStages.includes(order.fulfilmentStatus)
        ? order
        : { ...order, fulfilmentStatus: "Ready to Pack" },
    );
  const advance = (order: BusinessOrder) => {
    const index = fulfilmentStages.indexOf(order.fulfilmentStatus);
    const next =
      fulfilmentStages[Math.min(fulfilmentStages.length - 1, index + 1)];
    const result = updateFulfilment(order.id, next);
    if (result.ok) toast.success(`${order.number} moved to ${next}.`);
    else toast.error(result.error);
  };
  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Operations</p>
          <h1>Deliveries & Fulfilment</h1>
          <p className="subtitle">
            Move paid orders from preparation to successful delivery.
          </p>
        </div>
        <div className="view-toggle">
          <button
            className={view === "board" ? "active" : ""}
            onClick={() => setView("board")}
          >
            Board
          </button>
          <button
            className={view === "table" ? "active" : ""}
            onClick={() => setView("table")}
          >
            Table
          </button>
        </div>
      </section>
      <section className="module-stats">
        <article>
          <span>Ready to pack</span>
          <strong>
            {
              fulfilmentOrders.filter(
                (order) => order.fulfilmentStatus === "Ready to Pack",
              ).length
            }
          </strong>
          <small>Paid and ready</small>
        </article>
        <article>
          <span>Packed</span>
          <strong>
            {
              fulfilmentOrders.filter(
                (order) => order.fulfilmentStatus === "Packed",
              ).length
            }
          </strong>
          <small>Awaiting dispatch</small>
        </article>
        <article>
          <span>Ready for dispatch</span>
          <strong>
            {
              fulfilmentOrders.filter(
                (order) => order.fulfilmentStatus === "Ready for Dispatch",
              ).length
            }
          </strong>
          <small>Courier handoff next</small>
        </article>
        <article>
          <span>Delivered</span>
          <strong>
            {
              fulfilmentOrders.filter(
                (order) => order.fulfilmentStatus === "Delivered",
              ).length
            }
          </strong>
          <small>Completed orders</small>
        </article>
      </section>
      {view === "board" ? (
        <div className="fulfilment-board">
          {fulfilmentStages.map((stage) => (
            <section key={stage}>
              <div className="fulfilment-stage-head">
                <strong>{stage}</strong>
                <span>
                  {
                    fulfilmentOrders.filter(
                      (order) => order.fulfilmentStatus === stage,
                    ).length
                  }
                </span>
              </div>
              {fulfilmentOrders
                .filter((order) => order.fulfilmentStatus === stage)
                .map((order) => (
                  <article key={order.id}>
                    <div>
                      <strong>{order.number}</strong>
                      <span>{order.source}</span>
                    </div>
                    <h3>{order.customerName}</h3>
                    <p>
                      {order.items
                        .map((item) => `${item.quantity}× ${item.name}`)
                        .join(", ")}
                    </p>
                    <small>{formatMoney(order.total)}</small>
                    <div>
                      <button
                        onClick={() => navigate(`/orders?order=${order.id}`)}
                      >
                        View
                      </button>
                      {stage !== "Delivered" && (
                        <button onClick={() => advance(order)}>
                          Move forward
                        </button>
                      )}
                    </div>
                  </article>
                ))}
            </section>
          ))}
        </div>
      ) : (
        <section className="catalogue-panel">
          <div className="fulfilment-table">
            <div className="fulfilment-row head">
              <span>Order</span>
              <span>Customer</span>
              <span>Items</span>
              <span>Value</span>
              <span>Status</span>
              <span />
            </div>
            {fulfilmentOrders.map((order) => (
              <div className="fulfilment-row" key={order.id}>
                <strong>{order.number}</strong>
                <span>{order.customerName}</span>
                <span>{order.items.length} line(s)</span>
                <strong>{formatMoney(order.total)}</strong>
                <span>{order.fulfilmentStatus}</span>
                <button
                  disabled={order.fulfilmentStatus === "Delivered"}
                  className="row-action"
                  onClick={() => advance(order)}
                >
                  Advance
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
