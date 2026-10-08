"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useMerchantStore } from "./store";

import { Icon } from "@/components/ui/icon";

export function ActivityCentrePage() {
  const activities = useMerchantStore((state) => state.activities);
  const markActivityRead = useMerchantStore((state) => state.markActivityRead);
  const markAllActivitiesRead = useMerchantStore(
    (state) => state.markAllActivitiesRead,
  );

  const router = useRouter();
  const navigate = (href: string) => router.push(href);
  const [filter, setFilter] = useState("All");
  const filtered = activities.filter(
    (event) =>
      filter === "All" ||
      (filter === "Needs Attention" && event.priority === "attention") ||
      event.type === filter.toLowerCase(),
  );
  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Workspace</p>
          <h1>Activity Centre</h1>
          <p className="subtitle">
            Important business events and tasks requiring your attention.
          </p>
        </div>
        <button className="secondary-button" onClick={markAllActivitiesRead}>
          Mark all read
        </button>
      </section>
      <div className="activity-layout">
        <aside className="activity-filters">
          {[
            "All",
            "Needs Attention",
            "Order",
            "Payment",
            "Inventory",
            "Customer",
            "Fulfilment",
          ].map((item) => (
            <button
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item}
              <span>{item === "All" ? activities.length : ""}</span>
            </button>
          ))}
        </aside>
        <section className="activity-feed">
          <div className="activity-date">Recent activity</div>
          {filtered.map((event) => (
            <button
              className={`activity-item ${
                event.read ? "" : "unread"
              } ${event.priority}`}
              onClick={() => {
                markActivityRead(event.id);
                navigate(event.destination);
              }}
              key={event.id}
            >
              <i>
                <Icon
                  name={
                    event.type === "inventory"
                      ? "inventory"
                      : event.type === "fulfilment"
                        ? "package"
                        : event.type === "payment"
                          ? "payments"
                          : event.type === "customer"
                            ? "customers"
                            : event.type === "product"
                              ? "products"
                              : "orders"
                  }
                />
              </i>
              <span>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
                <small>{event.createdAt}</small>
              </span>
              <b>View</b>
            </button>
          ))}
          {!filtered.length && (
            <div className="empty-state compact">
              <h2>No activity in this view</h2>
              <p>New connected commerce events will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
