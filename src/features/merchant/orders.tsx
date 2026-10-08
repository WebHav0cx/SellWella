"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, type OrderForm } from "./schemas";
import { FieldError } from "@/components/ui/field-error";
import { Drawer } from "@/components/ui/drawer";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { ProductImage } from "@/components/ui/product-image";
import { formatMoney } from "@/lib/format-money";
import { useMerchantStore } from "@/features/merchant/store";
import { type Product, type BusinessOrder } from "@/features/merchant/data";
export function OrdersPage({
  initialOrderId,
  initialCreating = false,
}: {
  initialOrderId?: number;
  initialCreating?: boolean;
}) {
  const products = useMerchantStore((state) => state.products);
  const customers = useMerchantStore((state) => state.customers);
  const orders = useMerchantStore((state) => state.orders);
  const setOrders = useMerchantStore((state) => state.setOrders);
  const createCommerceOrder = useMerchantStore((state) => state.createOrder);
  const payOrder = useMerchantStore((state) => state.confirmDemoPayment);
  const cancelCommerceOrder = useMerchantStore((state) => state.cancelOrder);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All orders");
  const [payment, setPayment] = useState("All payments");
  const [selectedId, setSelectedId] = useState<number | null>(
    initialOrderId ?? null,
  );
  const selected = orders.find((order) => order.id === selectedId) ?? null;
  const [creating, setCreating] = useState(initialCreating);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: customers[0]?.id ?? 0,
      source: "WhatsApp",
      deliveryFee: "0",
      notes: "",
    },
  });
  const { deliveryFee = "0" } = useWatch({ control });
  const [error, setError] = useState("");
  const setNotice = (message: string) => toast.info(message);

  const filtered = orders.filter((order) => {
    const matchesSearch = `${order.number} ${order.customerName}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      matchesSearch &&
      (status === "All orders" || order.orderStatus === status) &&
      (payment === "All payments" || order.paymentStatus === payment)
    );
  });
  const draftItems = products
    .filter((product) => (quantities[product.id] ?? 0) > 0)
    .map((product) => ({
      productId: product.id,
      name: product.name,
      quantity: quantities[product.id],
      unitPrice: product.price,
    }));
  const subtotal = draftItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const draftTotal = subtotal + Number(deliveryFee || 0);

  const changeQuantity = (product: Product, change: number) => {
    const available = product.onHand - product.reserved;
    const next = Math.max(0, (quantities[product.id] ?? 0) + change);
    if (next > available) {
      setError(`Only ${available} units of ${product.name} are available.`);
      return;
    }
    setError("");
    setQuantities((current) => ({ ...current, [product.id]: next }));
  };

  const resetBuilder = () => {
    setQuantities({});
    reset();
    setError("");
    setCreating(false);
  };

  const createOrder = (mode: "draft" | "order" | "link", values: OrderForm) => {
    const result = createCommerceOrder({
      customerId: values.customerId,
      source: values.source,
      items: draftItems,
      deliveryFee: Number(values.deliveryFee || 0),
      mode,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success(
      `${result.order.number} created successfully${mode === "link" ? " with a demo payment link" : ""}.`,
    );
    resetBuilder();
  };
  const confirmDemoPayment = (order: BusinessOrder) => {
    const result = payOrder(order.id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSelectedId(result.order.id);
    toast.success(`${order.number} marked paid in demo mode.`);
  };
  const cancelOrder = (order: BusinessOrder) => {
    const result = cancelCommerceOrder(order.id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSelectedId(result.order.id);
    toast.info(`${order.number} cancelled and its reservation released.`);
  };

  if (selected) {
    return (
      <div className="module-page">
        <button className="back-button" onClick={() => setSelectedId(null)}>
          <Icon name="back" size={16} /> Back to orders
        </button>
        <section className="order-detail-head">
          <div>
            <p className="module-kicker">{selected.source} order</p>
            <h1>Order {selected.number}</h1>
            <p className="subtitle">
              {selected.customerName} · Created {selected.createdAt}
            </p>
          </div>
          <div className="detail-statuses">
            <span
              className={`order-badge ${selected.paymentStatus.toLowerCase()}`}
            >
              Payment: {selected.paymentStatus}
            </span>
            <span
              className={`order-badge ${selected.fulfilmentStatus.toLowerCase()}`}
            >
              Fulfilment: {selected.fulfilmentStatus}
            </span>
          </div>
        </section>
        <div className="order-detail-grid">
          <div className="order-detail-main">
            <section className="profile-block">
              <div className="block-heading">
                <h2>Order items</h2>
                <button>Print receipt</button>
              </div>
              <div className="detail-items">
                {selected.items.map((item) => (
                  <div key={item.productId}>
                    <span className="detail-product-icon">
                      <Icon name="products" size={18} />
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>Quantity {item.quantity}</small>
                    </span>
                    <strong>
                      {formatMoney(item.quantity * item.unitPrice)}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <span>
                  Subtotal <strong>{formatMoney(selected.subtotal)}</strong>
                </span>
                <span>
                  Delivery <strong>{formatMoney(selected.deliveryFee)}</strong>
                </span>
                <span className="grand-total">
                  Total <strong>{formatMoney(selected.total)}</strong>
                </span>
              </div>
            </section>
            <section className="profile-block">
              <div className="block-heading">
                <h2>Order timeline</h2>
              </div>
              <div className="customer-timeline">
                <div className="timeline-item">
                  <span>
                    <Icon name="orders" size={16} />
                  </span>
                  <div>
                    <strong>Order created</strong>
                    <p>Created through {selected.source}</p>
                  </div>
                  <small>{selected.createdAt}</small>
                </div>
                <div className="timeline-item">
                  <span>
                    <Icon name="inventory" size={16} />
                  </span>
                  <div>
                    <strong>
                      Inventory{" "}
                      {selected.paymentStatus === "Paid"
                        ? "committed"
                        : "reserved"}
                    </strong>
                    <p>
                      {selected.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}{" "}
                      unit(s) connected to this order
                    </p>
                  </div>
                  <small>Current</small>
                </div>
                {selected.paymentStatus === "Paid" && (
                  <div className="timeline-item">
                    <span>
                      <Icon name="payments" size={16} />
                    </span>
                    <div>
                      <strong>Payment confirmed</strong>
                      <p>Demo confirmation — no external provider event</p>
                    </div>
                    <small>Current</small>
                  </div>
                )}
              </div>
            </section>
          </div>
          <aside className="order-actions-panel">
            <div className="demo-banner">
              <strong>Demo transaction mode</strong>
              <p>
                No payment provider is connected. Confirmation only updates
                local demonstration data.
              </p>
            </div>
            {selected.paymentStatus === "Pending" && (
              <button
                className="create-button full-button"
                onClick={() => confirmDemoPayment(selected)}
              >
                Confirm demo payment
              </button>
            )}
            {selected.paymentLink ? (
              <div className="payment-link-box">
                <span>Demo payment link</span>
                <strong>{selected.paymentLink}</strong>
                <button
                  onClick={() => copyToClipboard(selected.paymentLink ?? "")}
                >
                  Copy link
                </button>
              </div>
            ) : (
              selected.paymentStatus === "Pending" && (
                <button
                  className="secondary-button full-button"
                  onClick={() => {
                    const link = `https://sellwella.demo/pay/${selected.number}`;
                    setOrders((current) =>
                      current.map((item) =>
                        item.id === selected.id
                          ? { ...item, paymentLink: link }
                          : item,
                      ),
                    );
                    setNotice(
                      "Demo payment link generated. It cannot collect a real payment.",
                    );
                  }}
                >
                  Generate demo payment link
                </button>
              )
            )}
            <button className="secondary-button full-button">
              Contact customer
            </button>
            <button
              className="danger-button full-button"
              onClick={() => cancelOrder(selected)}
            >
              Cancel order
            </button>
            <div className="profile-block order-customer-card">
              <div className="block-heading">
                <h2>Customer</h2>
              </div>
              <strong>{selected.customerName}</strong>
              <p>Customer record #{selected.customerId}</p>
              <button>View customer profile</button>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Sales & Customers</p>
          <h1>Orders</h1>
          <p className="subtitle">
            Manage sales from every channel in one transaction system.
          </p>
        </div>
        <div className="module-actions">
          <button className="secondary-button">Export orders</button>
          <button className="create-button" onClick={() => setCreating(true)}>
            <Icon name="plus" size={18} /> Create order
          </button>
        </div>
      </section>
      <section className="module-stats">
        <article>
          <span>Total orders</span>
          <strong>{orders.length}</strong>
          <small>Across every sales channel</small>
        </article>
        <article>
          <span>Awaiting payment</span>
          <strong className="warning-text">
            {orders.filter((item) => item.paymentStatus === "Pending").length}
          </strong>
          <small>
            {formatMoney(
              orders
                .filter((item) => item.paymentStatus === "Pending")
                .reduce((sum, item) => sum + item.total, 0),
            )}{" "}
            outstanding
          </small>
        </article>
        <article>
          <span>Processing</span>
          <strong>
            {orders.filter((item) => item.orderStatus === "Processing").length}
          </strong>
          <small>Paid orders in progress</small>
        </article>
        <article>
          <span>Fulfilled</span>
          <strong>
            {
              orders.filter((item) => item.fulfilmentStatus === "Delivered")
                .length
            }
          </strong>
          <small>Successfully delivered</small>
        </article>
      </section>
      <section className="catalogue-panel">
        <div className="catalogue-toolbar">
          <label className="field-search">
            <Icon name="search" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order or customer"
              aria-label="Search order or customer"
            />
          </label>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All orders</option>
            <option>Draft</option>
            <option>Awaiting Payment</option>
            <option>Processing</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <select
            aria-label="Filter by payment status"
            value={payment}
            onChange={(event) => setPayment(event.target.value)}
          >
            <option>All payments</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Refunded</option>
          </select>
        </div>
        <div className="orders-list-wrap">
          <div className="orders-list-table">
            <div className="orders-list-head">
              <span>Order</span>
              <span>Customer</span>
              <span>Source</span>
              <span>Items</span>
              <span>Amount</span>
              <span>Payment</span>
              <span>Fulfilment</span>
              <span>Date</span>
              <span />
            </div>
            {filtered.map((order) => (
              <div className="orders-list-row" key={order.id}>
                <button onClick={() => setSelectedId(order.id)}>
                  {order.number}
                </button>
                <strong>{order.customerName}</strong>
                <span>{order.source}</span>
                <span>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  item(s)
                </span>
                <strong>{formatMoney(order.total)}</strong>
                <span
                  className={`order-badge ${order.paymentStatus.toLowerCase()}`}
                >
                  {order.paymentStatus}
                </span>
                <span
                  className={`order-badge ${order.fulfilmentStatus.toLowerCase()}`}
                >
                  {order.fulfilmentStatus}
                </span>
                <span>{order.createdAt}</span>
                <button
                  className="row-action"
                  onClick={() => setSelectedId(order.id)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state compact">
              <h2>No orders found</h2>
              <p>Change your filters or create a new order.</p>
              <button
                className="create-button"
                onClick={() => setCreating(true)}
              >
                Create order
              </button>
            </div>
          )}
        </div>
      </section>

      {creating && (
        <Drawer
          onClose={resetBuilder}
          label="order builder"
          className="order-builder"
        >
          <div className="drawer-header">
            <div>
              <span>New sale</span>
              <h2>Create order</h2>
            </div>
            <button onClick={resetBuilder} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
          <div className="order-builder-body">
            <div className="builder-form">
              <div className="form-section">
                <h3>Customer and channel</h3>
                <div className="form-row">
                  <label>
                    Customer
                    <select
                      {...register("customerId", { valueAsNumber: true })}
                      aria-invalid={!!errors.customerId}
                      aria-describedby="customerId-error"
                    >
                      {customers.map((customer) => (
                        <option value={customer.id} key={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Sales channel
                    <select
                      {...register("source")}
                      aria-invalid={!!errors.source}
                      aria-describedby="source-error"
                    >
                      <option>WhatsApp</option>
                      <option>Instagram</option>
                      <option>Website</option>
                      <option>POS</option>
                      <option>Manual</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="form-section">
                <h3>Add products</h3>
                <div className="builder-products">
                  {products.map((product) => {
                    const available = product.onHand - product.reserved;
                    const quantity = quantities[product.id] ?? 0;
                    return (
                      <div key={product.id}>
                        <span className="builder-thumb">
                          <ProductImage product={product} />
                        </span>
                        <span>
                          <strong>{product.name}</strong>
                          <small>
                            {formatMoney(product.price)} · {available} available
                          </small>
                        </span>
                        <div className="quantity-control">
                          <button
                            type="button"
                            aria-label={`Remove one ${product.name}`}
                            onClick={() => changeQuantity(product, -1)}
                          >
                            <Icon name="minus" size={14} />
                          </button>
                          <b>{quantity}</b>
                          <button
                            type="button"
                            aria-label={`Add one ${product.name}`}
                            onClick={() => changeQuantity(product, 1)}
                            disabled={quantity >= available}
                          >
                            <Icon name="plus" size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="form-section">
                <h3>Delivery and notes</h3>
                <label>
                  Delivery fee (₦)
                  <input
                    type="number"
                    min="0"
                    {...register("deliveryFee")}
                    aria-invalid={!!errors.deliveryFee}
                    aria-describedby="deliveryFee-error"
                  />
                </label>
                <label>
                  Order notes
                  <textarea
                    {...register("notes")}
                    aria-invalid={!!errors.notes}
                    aria-describedby="notes-error"
                    placeholder="Packaging, delivery or customer notes"
                  />
                </label>
              </div>
            </div>
            <aside className="builder-summary">
              <h3>Order summary</h3>
              {draftItems.length ? (
                draftItems.map((item) => (
                  <div className="summary-item" key={item.productId}>
                    <span>
                      {item.name}
                      <small>
                        {item.quantity} × {formatMoney(item.unitPrice)}
                      </small>
                    </span>
                    <strong>
                      {formatMoney(item.quantity * item.unitPrice)}
                    </strong>
                  </div>
                ))
              ) : (
                <p className="summary-empty">
                  Add products to build this order.
                </p>
              )}
              <div className="summary-totals">
                <span>
                  Subtotal<strong>{formatMoney(subtotal)}</strong>
                </span>
                <span>
                  Delivery
                  <strong>{formatMoney(Number(deliveryFee || 0))}</strong>
                </span>
                <span className="grand-total">
                  Total<strong>{formatMoney(draftTotal)}</strong>
                </span>
              </div>
              <div className="reservation-note">
                <Icon name="inventory" size={17} />
                <p>
                  Creating an unpaid order reserves stock. Draft orders do not
                  reserve inventory.
                </p>
              </div>
              <FieldError error={errors.customerId} id="customerId-error" />
              <FieldError error={errors.deliveryFee} id="deliveryFee-error" />
              {error && (
                <p role="alert" className="form-error builder-error">
                  {error}
                </p>
              )}
              <button
                className="create-button full-button"
                disabled={isSubmitting}
                onClick={handleSubmit((values) => createOrder("link", values))}
              >
                Create & generate link
              </button>
              <button
                className="secondary-button full-button"
                disabled={isSubmitting}
                onClick={handleSubmit((values) => createOrder("order", values))}
              >
                Create order
              </button>
              <button
                className="text-only-button"
                disabled={isSubmitting}
                onClick={handleSubmit((values) => createOrder("draft", values))}
              >
                Save as draft
              </button>
            </aside>
          </div>
        </Drawer>
      )}
    </div>
  );
}
