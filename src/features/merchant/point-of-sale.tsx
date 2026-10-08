"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { posSchema, type PosForm } from "./connected-schemas";
import { FieldError } from "@/components/ui/field-error";
import { SaleReceipt } from "./sale-receipt";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useMerchantStore } from "./store";
import { formatMoney } from "@/lib/format-money";
import { QuantityControl } from "@/components/ui/quantity-control";
import { ProductImage } from "@/components/ui/product-image";
import { Icon } from "@/components/ui/icon";

import type { BusinessOrder, Product } from "./data";
export function PointOfSalePage() {
  const products = useMerchantStore((state) => state.products);
  const customers = useMerchantStore((state) => state.customers);
  const createOrder = useMerchantStore((state) => state.createOrder);

  const router = useRouter();
  const navigate = (href: string) => router.push(href);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PosForm>({
    resolver: zodResolver(posSchema),
    defaultValues: { customerId: customers[0]?.id ?? 0, paymentMethod: "Cash" },
  });
  const { paymentMethod = "Cash" } = useWatch({ control });
  const [receipt, setReceipt] = useState<BusinessOrder | null>(null);
  const [error, setError] = useState("");
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
  const visible = products.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase()),
  );
  const lines = products
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({ product, quantity: cart[product.id] }));
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  const add = (product: Product) => {
    const available = product.onHand - product.reserved;
    const next = (cart[product.id] ?? 0) + 1;
    if (next > available) {
      setError(`Only ${available} units are available.`);
      return;
    }
    setError("");
    setCart((current) => ({ ...current, [product.id]: next }));
  };

  const completeSale = (values: PosForm) => {
    const result = createOrder({
      customerId: values.customerId,
      source: "POS",
      items: lines.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity,
      })),
      mode: "paid",
      paymentMethod:
        values.paymentMethod === "Cash"
          ? "POS cash"
          : "POS demo digital payment",
    });
    if (!result.ok || !result.order) {
      setError(result.error ?? "Sale could not be completed.");
      return;
    }
    setReceipt(result.order);
    setCart({});
  };

  if (receipt)
    return (
      <SaleReceipt
        order={receipt}
        onNewSale={() => setReceipt(null)}
        onViewOrder={(id) => navigate(`/orders?order=${id}`)}
      />
    );

  return (
    <div className="pos-page">
      <section className="pos-products">
        <div className="pos-heading">
          <div>
            <span>Point of Sale</span>
            <h1>Quick Sale</h1>
            <p>Cashier: Amina · Main Store · Demo register open</p>
          </div>
          <button disabled>Close register</button>
        </div>
        <input
          className="pos-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search or scan product name / SKU"
          placeholder="Search or scan product name / SKU"
        />
        <div className="pos-categories">
          {categories.map((item) => (
            <button
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="pos-grid">
          {visible.map((product) => {
            const available = product.onHand - product.reserved;
            return (
              <button
                onClick={() => add(product)}
                disabled={available <= 0}
                key={product.id}
              >
                <ProductImage product={product} />
                <span>
                  <strong>{product.name}</strong>
                  <b>{formatMoney(product.price)}</b>
                  <small>{available} available</small>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <aside className="pos-cart">
        <div className="pos-cart-head">
          <div>
            <h2>Current sale</h2>
            <span>
              {lines.reduce((sum, line) => sum + line.quantity, 0)} items
            </span>
          </div>
          <button onClick={() => setCart({})}>Clear</button>
        </div>
        <div className="pos-customer">
          <label>
            Customer
            <select
              {...register("customerId", { valueAsNumber: true })}
              aria-invalid={!!errors.customerId}
              aria-describedby="pos-customer-error"
            >
              {customers.map((customer) => (
                <option value={customer.id} key={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="pos-lines">
          {lines.length ? (
            lines.map((line) => (
              <div key={line.product.id}>
                <ProductImage product={line.product} />
                <span>
                  <strong>{line.product.name}</strong>
                  <small>{formatMoney(line.product.price)}</small>
                </span>
                <QuantityControl
                  value={line.quantity}
                  label={line.product.name}
                  max={line.product.onHand - line.product.reserved}
                  onDecrease={() =>
                    setCart((current) => ({
                      ...current,
                      [line.product.id]: Math.max(0, line.quantity - 1),
                    }))
                  }
                  onIncrease={() => add(line.product)}
                />
                <strong>
                  {formatMoney(line.product.price * line.quantity)}
                </strong>
              </div>
            ))
          ) : (
            <div className="pos-empty">
              <Icon name="store" size={32} />
              <h3>No products added</h3>
              <p>Select a product to begin the sale.</p>
            </div>
          )}
        </div>
        <div className="pos-payment">
          <h3>Payment method</h3>
          <div>
            {["Cash", "Demo digital"].map((item) => (
              <button
                className={paymentMethod === item ? "active" : ""}
                onClick={() =>
                  setValue(
                    "paymentMethod",
                    item === "Cash" ? "Cash" : "Demo digital",
                  )
                }
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          {paymentMethod === "Demo digital" && (
            <p>No payment provider will be contacted.</p>
          )}
        </div>
        <FieldError error={errors.customerId} id="pos-customer-error" />
        {error && (
          <p role="alert" className="pos-error">
            {error}
          </p>
        )}
        <div className="pos-total">
          <span>
            Total<strong>{formatMoney(total)}</strong>
          </span>
          <button
            disabled={!lines.length || isSubmitting}
            onClick={handleSubmit(completeSale)}
          >
            Complete {paymentMethod.toLowerCase()} sale
          </button>
          <small>
            Completing this sale updates orders, customer history and inventory.
          </small>
        </div>
      </aside>
    </div>
  );
}
