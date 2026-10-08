"use client";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { useState } from "react";

import { Icon } from "@/components/ui/icon";

import { formatMoney } from "@/lib/format-money";
import { useMerchantStore } from "@/features/merchant/store";
import { type BusinessOrder } from "@/features/merchant/data";
export function PaymentsPage({
  onOpenOrder,
  initialTab = "transactions",
}: {
  onOpenOrder: (order: BusinessOrder) => void;
  initialTab?: "transactions" | "links";
}) {
  const orders = useMerchantStore((state) => state.orders);
  const [tab, setTab] = useState<"transactions" | "links">(initialTab);
  const [status, setStatus] = useState("All");
  const transactions = orders.filter((order) => order.orderStatus !== "Draft");
  const visible = transactions.filter(
    (order) => status === "All" || order.paymentStatus === status,
  );
  const collected = transactions
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + order.total, 0);
  const pending = transactions
    .filter((order) => order.paymentStatus === "Pending")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Finance</p>
          <h1>Payments</h1>
          <p className="subtitle">
            Track customer collections and payment requests across your orders.
          </p>
        </div>
        <button
          className="create-button"
          onClick={() => orders[0] && onOpenOrder(orders[0])}
        >
          <Icon name="plus" size={18} /> Create from order
        </button>
      </section>
      <div className="demo-banner horizontal">
        <strong>Demo payment environment</strong>
        <p>
          No provider is connected. Records below demonstrate transaction states
          and cannot move real money.
        </p>
      </div>
      <section className="module-stats">
        <article>
          <span>Confirmed collections</span>
          <strong>{formatMoney(collected)}</strong>
          <small>Demo payments marked paid</small>
        </article>
        <article>
          <span>Pending payments</span>
          <strong className="warning-text">{formatMoney(pending)}</strong>
          <small>Outstanding order balances</small>
        </article>
        <article>
          <span>Refunded</span>
          <strong>{formatMoney(0)}</strong>
          <small>No refund records</small>
        </article>
        <article>
          <span>Pending settlements</span>
          <strong>Unavailable</strong>
          <small>Connect a payment provider</small>
        </article>
      </section>
      <div className="module-tabs payment-tabs">
        <button
          className={tab === "transactions" ? "active" : ""}
          onClick={() => setTab("transactions")}
        >
          Transactions
        </button>
        <button
          className={tab === "links" ? "active" : ""}
          onClick={() => setTab("links")}
        >
          Payment links
        </button>
        <button disabled>Reconciliation</button>
        <button disabled>Refunds</button>
        <button disabled>Settlements</button>
      </div>
      <section className="catalogue-panel">
        {tab === "transactions" ? (
          <>
            <div className="catalogue-toolbar">
              <div className="status-filter">
                {["All", "Paid", "Pending", "Refunded"].map((item) => (
                  <button
                    className={status === item ? "active" : ""}
                    onClick={() => setStatus(item)}
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="payment-table">
              <div className="payment-head">
                <span>Reference</span>
                <span>Customer</span>
                <span>Order</span>
                <span>Method</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
                <span />
              </div>
              {visible.map((order) => (
                <div className="payment-row" key={order.id}>
                  <strong>DEMO-{order.id}</strong>
                  <span>{order.customerName}</span>
                  <button onClick={() => onOpenOrder(order)}>
                    {order.number}
                  </button>
                  <span>
                    {order.paymentStatus === "Paid"
                      ? "Demo card"
                      : "Awaiting payment"}
                  </span>
                  <strong>{formatMoney(order.total)}</strong>
                  <span
                    className={`order-badge ${order.paymentStatus.toLowerCase()}`}
                  >
                    {order.paymentStatus}
                  </span>
                  <span>{order.createdAt}</span>
                  <button
                    className="row-action"
                    onClick={() => onOpenOrder(order)}
                  >
                    View order
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="payment-table links-table">
            <div className="payment-head">
              <span>Link reference</span>
              <span>Customer</span>
              <span>Order</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Created</span>
              <span />
              <span />
            </div>
            {orders
              .filter((order) => order.paymentLink)
              .map((order) => (
                <div className="payment-row" key={order.id}>
                  <strong>{order.number}-LINK</strong>
                  <span>{order.customerName}</span>
                  <button onClick={() => onOpenOrder(order)}>
                    {order.number}
                  </button>
                  <strong>{formatMoney(order.total)}</strong>
                  <span
                    className={`order-badge ${order.paymentStatus.toLowerCase()}`}
                  >
                    {order.paymentStatus}
                  </span>
                  <span>{order.createdAt}</span>
                  <button
                    className="row-action"
                    onClick={() => copyToClipboard(order.paymentLink ?? "")}
                  >
                    Copy
                  </button>
                  <button
                    className="row-action"
                    onClick={() => onOpenOrder(order)}
                  >
                    View
                  </button>
                </div>
              ))}
            {!orders.some((order) => order.paymentLink) && (
              <div className="empty-state compact">
                <h2>No payment links</h2>
                <p>
                  Create an order-specific payment request from the Orders
                  module.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
