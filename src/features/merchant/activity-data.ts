import type { ActivityEvent } from "./commerce-schemas";
export const initialActivities: ActivityEvent[] = [
  {
    id: 1,
    type: "payment",
    title: "Demo payment confirmed",
    description: "₦31,000 recorded for order SW-00128.",
    createdAt: "12 minutes ago",
    read: false,
    priority: "success",
    destination: "/orders?order=128",
  },
  {
    id: 2,
    type: "inventory",
    title: "Low stock warning",
    description: "Blue Linen Dress has only 1 unit available.",
    createdAt: "35 minutes ago",
    read: false,
    priority: "attention",
    destination: "/inventory",
  },
  {
    id: 3,
    type: "order",
    title: "Order ready to pack",
    description: "Order SW-00128 is in the fulfilment queue.",
    createdAt: "1 hour ago",
    read: true,
    priority: "info",
    destination: "/fulfilment",
  },
];
