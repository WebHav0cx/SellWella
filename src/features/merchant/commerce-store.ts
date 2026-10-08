import type { SetStateAction } from "react";
import { createStore } from "zustand/vanilla";
import {
  initialProducts,
  initialCustomers,
  initialBusinessOrders,
  type Product,
  type Customer,
  type BusinessOrder,
  type OrderItem,
} from "./data";
import { initialActivities } from "./activity-data";
import {
  createOrderSchema,
  fulfilmentStatusSchema,
  type ActivityEvent,
  type CreateOrderInput,
} from "./commerce-schemas";
import { formatMoney } from "../../lib/format-money";

export const COMMERCE_STORAGE_KEY = "sellwella-demo-commerce-v2";
export type ActionResult =
  | { ok: true; order: BusinessOrder; error?: never }
  | { ok: false; error: string; order?: never };
type ActivityInput = Omit<ActivityEvent, "id" | "createdAt" | "read">;
export type CommerceData = {
  products: Product[];
  customers: Customer[];
  orders: BusinessOrder[];
  activities: ActivityEvent[];
};
export type MerchantState = CommerceData & {
  hydrated: boolean;
  setProducts: (update: SetStateAction<Product[]>) => void;
  setCustomers: (update: SetStateAction<Customer[]>) => void;
  setOrders: (update: SetStateAction<BusinessOrder[]>) => void;
  createOrder: (input: CreateOrderInput) => ActionResult;
  confirmDemoPayment: (id: number, method?: string) => ActionResult;
  cancelOrder: (id: number) => ActionResult;
  updateFulfilment: (
    id: number,
    status: BusinessOrder["fulfilmentStatus"],
  ) => ActionResult;
  addActivity: (event: ActivityInput) => void;
  markActivityRead: (id: number) => void;
  markAllActivitiesRead: () => void;
};
function activity(
  events: ActivityEvent[],
  input: ActivityInput,
): ActivityEvent[] {
  return [
    {
      ...input,
      id: Math.max(0, ...events.map((event) => event.id)) + 1,
      createdAt: "Just now",
      read: false,
    },
    ...events,
  ];
}
function customerPurchase(
  customers: Customer[],
  order: BusinessOrder,
): Customer[] {
  return customers.map((customer) =>
    customer.id === order.customerId
      ? {
          ...customer,
          orders: customer.orders + 1,
          spend: customer.spend + order.total,
          lastActivity: "Just now",
          segment: customer.orders >= 4 ? "VIP" : "Returning",
        }
      : customer,
  );
}
function quantities(items: OrderItem[]) {
  const result = new Map<number, number>();
  for (const item of items)
    result.set(
      item.productId,
      (result.get(item.productId) ?? 0) + item.quantity,
    );
  return result;
}
export function createCommerceStore() {
  return createStore<MerchantState>()((set, get) => ({
    ...structuredClone({
      products: initialProducts,
      customers: initialCustomers,
      orders: initialBusinessOrders,
      activities: initialActivities,
    }),
    hydrated: false,
    setProducts: (update) =>
      set((state) => ({
        products:
          typeof update === "function" ? update(state.products) : update,
        activities: activity(state.activities, {
          type: "inventory",
          title: "Product or inventory updated",
          description:
            "A catalogue or stock record changed in the merchant workspace.",
          priority: "info",
          destination: "/inventory",
        }),
      })),
    setCustomers: (update) =>
      set((state) => ({
        customers:
          typeof update === "function" ? update(state.customers) : update,
        activities: activity(state.activities, {
          type: "customer",
          title: "Customer record updated",
          description: "A customer profile changed.",
          priority: "info",
          destination: "/customers",
        }),
      })),
    setOrders: (update) =>
      set((state) => ({
        orders: typeof update === "function" ? update(state.orders) : update,
        activities: activity(state.activities, {
          type: "order",
          title: "Order record updated",
          description: "An order record changed.",
          priority: "info",
          destination: "/orders",
        }),
      })),
    addActivity: (input) =>
      set((state) => ({ activities: activity(state.activities, input) })),
    markActivityRead: (id) =>
      set((state) => ({
        activities: state.activities.map((event) =>
          event.id === id ? { ...event, read: true } : event,
        ),
      })),
    markAllActivitiesRead: () =>
      set((state) => ({
        activities: state.activities.map((event) => ({ ...event, read: true })),
      })),
    createOrder: (raw) => {
      const parsed = createOrderSchema.safeParse(raw);
      if (!parsed.success)
        return {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Check the order details.",
        };
      const input = parsed.data;
      const state = get();
      const items: OrderItem[] = [];
      for (const requested of input.items) {
        const product = state.products.find(
          (item) => item.id === requested.productId,
        );
        if (!product || (input.source === "Storefront" && !product.published))
          return { ok: false, error: "One or more products are unavailable." };
        const existing = items.find(
          (item) =>
            item.productId === requested.productId &&
            item.variant === requested.variant,
        );
        if (existing) existing.quantity += requested.quantity;
        else
          items.push({
            productId: product.id,
            name: product.name,
            quantity: requested.quantity,
            unitPrice: product.price,
            variant: requested.variant,
          });
      }
      const requestedQuantities = quantities(items);
      for (const [id, quantity] of requestedQuantities) {
        const product = state.products.find((item) => item.id === id);
        if (!product || quantity > product.onHand - product.reserved)
          return {
            ok: false,
            error: `Only ${product ? product.onHand - product.reserved : 0} units of ${product?.name ?? "this product"} are available.`,
          };
      }
      let customer = state.customers.find(
        (item) => item.id === input.customerId,
      );
      let customers = state.customers;
      if (!customer && input.customer) {
        const contact = input.customer;
        const normalizedPhone = contact.phone.replace(/[^\d]/g, "");
        customer = customers.find(
          (item) => item.phone.replace(/[^\d]/g, "") === normalizedPhone,
        );
        if (!customer) {
          const parts = contact.name.trim().split(/\s+/);
          customer = {
            id: Math.max(0, ...customers.map((item) => item.id)) + 1,
            name: contact.name.trim(),
            initials:
              `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase(),
            phone: contact.phone,
            email: contact.email || "No email provided",
            source: input.source,
            orders: 0,
            spend: 0,
            lastActivity: "Just now",
            segment: "New",
            location: contact.location || "Not provided",
            notes: "Created during storefront checkout.",
          };
          customers = [customer, ...customers];
        }
      }
      if (!customer) return { ok: false, error: "Select a valid customer." };
      const id = Math.max(128, ...state.orders.map((item) => item.id)) + 1;
      const number = `SW-${String(id).padStart(5, "0")}`;
      const mode = input.mode ?? "order";
      const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      const deliveryFee = input.deliveryFee ?? 0;
      const order: BusinessOrder = {
        id,
        number,
        customerId: customer.id,
        customerName: customer.name,
        source: input.source,
        items,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        orderStatus:
          mode === "draft"
            ? "Draft"
            : mode === "paid"
              ? "Processing"
              : "Awaiting Payment",
        paymentStatus: mode === "paid" ? "Paid" : "Pending",
        fulfilmentStatus: mode === "paid" ? "Ready to Pack" : "Unfulfilled",
        createdAt: "Just now",
        paymentLink:
          mode === "link" ? `https://sellwella.demo/pay/${number}` : undefined,
        paymentMethod: input.paymentMethod,
        deliveryMethod: input.deliveryMethod,
      };
      let activities = activity(state.activities, {
        type: "order",
        title: "Order created",
        description: `${number} created from ${input.source}.`,
        priority: "info",
        destination: `/orders?order=${id}`,
      });
      if (mode === "paid") {
        customers = customerPurchase(customers, order);
        activities = activity(activities, {
          type: "payment",
          title: `${input.paymentMethod ?? "Demo"} sale completed`,
          description: `${formatMoney(order.total)} recorded for ${number}.`,
          priority: "success",
          destination: `/orders?order=${id}`,
        });
        activities = activity(activities, {
          type: "fulfilment",
          title: "Order ready to pack",
          description: `${number} entered the fulfilment queue.`,
          priority: "attention",
          destination: "/fulfilment",
        });
      }
      const products = state.products.map((product) => {
        const quantity = requestedQuantities.get(product.id) ?? 0;
        return mode === "paid"
          ? { ...product, onHand: product.onHand - quantity }
          : mode === "draft"
            ? product
            : { ...product, reserved: product.reserved + quantity };
      });
      set({
        products,
        customers,
        orders: [order, ...state.orders],
        activities,
      });
      return { ok: true, order };
    },
    confirmDemoPayment: (id, method = "Digital payment") => {
      const state = get();
      const order = state.orders.find((item) => item.id === id);
      if (!order) return { ok: false, error: "Order not found." };
      if (order.paymentStatus !== "Pending")
        return { ok: false, error: "This order cannot be paid again." };
      if (order.orderStatus === "Cancelled")
        return { ok: false, error: "A cancelled order cannot be paid." };
      const amounts = quantities(order.items);
      const reserved = order.orderStatus !== "Draft";
      for (const [productId, quantity] of amounts) {
        const product = state.products.find((item) => item.id === productId);
        if (
          !product ||
          product.onHand < quantity ||
          (reserved
            ? product.reserved < quantity
            : product.onHand - product.reserved < quantity)
        )
          return { ok: false, error: "The order no longer has enough stock." };
      }
      const updated: BusinessOrder = {
        ...order,
        paymentStatus: "Paid",
        paymentMethod: method,
        orderStatus: "Processing",
        fulfilmentStatus: "Ready to Pack",
      };
      let activities = activity(state.activities, {
        type: "payment",
        title: "Payment confirmed",
        description: `${formatMoney(order.total)} recorded for ${order.number}.`,
        priority: "success",
        destination: `/orders?order=${id}`,
      });
      activities = activity(activities, {
        type: "fulfilment",
        title: "Order ready to pack",
        description: `${order.number} entered the fulfilment queue.`,
        priority: "attention",
        destination: "/fulfilment",
      });
      set({
        orders: state.orders.map((item) => (item.id === id ? updated : item)),
        customers: customerPurchase(state.customers, order),
        products: state.products.map((product) => ({
          ...product,
          onHand: product.onHand - (amounts.get(product.id) ?? 0),
          reserved:
            product.reserved - (reserved ? (amounts.get(product.id) ?? 0) : 0),
        })),
        activities,
      });
      return { ok: true, order: updated };
    },
    cancelOrder: (id) => {
      const state = get();
      const order = state.orders.find((item) => item.id === id);
      if (!order) return { ok: false, error: "Order not found." };
      if (order.paymentStatus !== "Pending")
        return {
          ok: false,
          error: "Paid or refunded orders require a refund workflow.",
        };
      if (order.orderStatus === "Cancelled") return { ok: true, order };
      const amounts = quantities(order.items);
      const updated: BusinessOrder = { ...order, orderStatus: "Cancelled" };
      set({
        orders: state.orders.map((item) => (item.id === id ? updated : item)),
        products: state.products.map((product) => ({
          ...product,
          reserved: Math.max(
            0,
            product.reserved -
              (order.orderStatus === "Draft"
                ? 0
                : (amounts.get(product.id) ?? 0)),
          ),
        })),
        activities: activity(state.activities, {
          type: "order",
          title: "Order cancelled",
          description: `${order.number} was cancelled and its stock reservation released.`,
          priority: "info",
          destination: `/orders?order=${id}`,
        }),
      });
      return { ok: true, order: updated };
    },
    updateFulfilment: (id, status) => {
      const state = get();
      const order = state.orders.find((item) => item.id === id);
      if (!order) return { ok: false, error: "Order not found." };
      if (order.paymentStatus !== "Paid" || order.orderStatus === "Cancelled")
        return { ok: false, error: "Only paid orders can enter fulfilment." };
      if (!fulfilmentStatusSchema.safeParse(status).success)
        return { ok: false, error: "Invalid fulfilment status." };
      const updated: BusinessOrder = {
        ...order,
        fulfilmentStatus: status,
        orderStatus: status === "Delivered" ? "Completed" : "Processing",
      };
      set({
        orders: state.orders.map((item) => (item.id === id ? updated : item)),
        activities: activity(state.activities, {
          type: "fulfilment",
          title: `Order ${status.toLowerCase()}`,
          description: `${order.number} moved to ${status}.`,
          priority: status === "Delivered" ? "success" : "info",
          destination: "/fulfilment",
        }),
      });
      return { ok: true, order: updated };
    },
  }));
}
