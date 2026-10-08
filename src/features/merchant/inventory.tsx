"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustmentSchema, type AdjustmentForm } from "./schemas";
import { FieldError } from "@/components/ui/field-error";
import { Drawer } from "@/components/ui/drawer";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { ProductImage } from "@/components/ui/product-image";

import { useMerchantStore } from "@/features/merchant/store";
import { type Product } from "@/features/merchant/data";
export function InventoryPage() {
  const products = useMerchantStore((state) => state.products);
  const setProducts = useMerchantStore((state) => state.setProducts);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All stock");
  const [adjusting, setAdjusting] = useState<Product | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdjustmentForm>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: { quantity: "", reason: "New stock received" },
  });
  const [error, setError] = useState("");

  const getStatus = (product: Product) => {
    const available = product.onHand - product.reserved;
    if (available <= 0) return "Out of stock";
    if (available <= product.threshold) return "Low stock";
    return "In stock";
  };
  const filtered = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.sku}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      matchesSearch && (status === "All stock" || getStatus(product) === status)
    );
  });
  const totalUnits = products.reduce((sum, product) => sum + product.onHand, 0);
  const reserved = products.reduce((sum, product) => sum + product.reserved, 0);

  const applyAdjustment = ({ quantity }: AdjustmentForm) => {
    const change = Number(quantity);
    if (!adjusting || !quantity || change === 0) {
      setError("Enter a quantity to add or remove.");
      return;
    }
    if (adjusting.onHand + change < adjusting.reserved) {
      setError("On-hand stock cannot be lower than units already reserved.");
      return;
    }
    setProducts((current) =>
      current.map((product) =>
        product.id === adjusting.id
          ? { ...product, onHand: product.onHand + change }
          : product,
      ),
    );
    setAdjusting(null);
    reset();
    setError("");
    toast.success("Stock adjustment saved");
  };

  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Commerce</p>
          <h1>Inventory</h1>
          <p className="subtitle">
            Know what is on hand, reserved for checkout and available to sell.
          </p>
        </div>
        <button
          className="create-button"
          onClick={() => products[0] && setAdjusting(products[0])}
        >
          <Icon name="plus" size={18} /> Adjust stock
        </button>
      </section>

      <section className="inventory-summary">
        <article>
          <span>Units on hand</span>
          <strong>{totalUnits}</strong>
          <small>Physical recorded stock</small>
        </article>
        <article>
          <span>Reserved</span>
          <strong>{reserved}</strong>
          <small>Held for active checkouts</small>
        </article>
        <article>
          <span>Available</span>
          <strong>{totalUnits - reserved}</strong>
          <small>Ready to sell now</small>
        </article>
        <article>
          <span>Needs attention</span>
          <strong className="warning-text">
            {
              products.filter((product) => getStatus(product) !== "In stock")
                .length
            }
          </strong>
          <small>Low or out-of-stock items</small>
        </article>
      </section>

      <section className="catalogue-panel inventory-panel">
        <div className="catalogue-toolbar">
          <label className="field-search">
            <Icon name="search" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search inventory or SKU"
              aria-label="Search inventory or SKU"
            />
          </label>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All stock</option>
            <option>In stock</option>
            <option>Low stock</option>
            <option>Out of stock</option>
          </select>
          <button className="secondary-button">Stock history</button>
        </div>
        <div className="inventory-table-wrap">
          <div className="inventory-table">
            <div className="inventory-head">
              <span>Product</span>
              <span>On hand</span>
              <span>Reserved</span>
              <span>Available</span>
              <span>Status</span>
              <span />
            </div>
            {filtered.map((product) => {
              const available = product.onHand - product.reserved;
              const stockStatus = getStatus(product);
              return (
                <div className="inventory-row" key={product.id}>
                  <span className="table-product">
                    <i>
                      <ProductImage product={product} />
                    </i>
                    <b>
                      {product.name}
                      <small>{product.sku}</small>
                    </b>
                  </span>
                  <strong>{product.onHand}</strong>
                  <span>{product.reserved}</span>
                  <strong>{available}</strong>
                  <span
                    className={`stock-status ${stockStatus.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {stockStatus}
                  </span>
                  <button
                    className="row-action"
                    onClick={() => {
                      setAdjusting(product);
                      reset();
                      setError("");
                    }}
                  >
                    Adjust
                  </button>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state compact">
              <h2>No inventory matches</h2>
              <p>Change your search or stock filter.</p>
            </div>
          )}
        </div>
      </section>

      {adjusting && (
        <Drawer
          onClose={() => setAdjusting(null)}
          label="stock adjustment"
          className="form-drawer narrow"
        >
          <div className="drawer-header">
            <div>
              <span>Inventory adjustment</span>
              <h2>{adjusting.name}</h2>
            </div>
            <button onClick={() => setAdjusting(null)} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
          <form noValidate onSubmit={handleSubmit(applyAdjustment)}>
            <div className="stock-snapshot">
              <span>
                <small>On hand</small>
                <strong>{adjusting.onHand}</strong>
              </span>
              <span>
                <small>Reserved</small>
                <strong>{adjusting.reserved}</strong>
              </span>
              <span>
                <small>Available</small>
                <strong>{adjusting.onHand - adjusting.reserved}</strong>
              </span>
            </div>
            <div className="form-section">
              <h3>Record a stock change</h3>
              <label>
                Quantity change
                <input
                  autoFocus
                  type="number"
                  {...register("quantity")}
                  aria-invalid={!!errors.quantity}
                  aria-describedby="quantity-error"
                  placeholder="Use - to remove stock"
                />
                <FieldError error={errors.quantity} id="quantity-error" />
              </label>
              <label>
                Reason
                <select
                  {...register("reason")}
                  aria-invalid={!!errors.reason}
                  aria-describedby="reason-error"
                >
                  <option>New stock received</option>
                  <option>Stock count correction</option>
                  <option>Damaged item</option>
                  <option>Customer return</option>
                  <option>Internal use</option>
                </select>
              </label>
              <p className="field-help">
                This adjustment will be recorded against Amina Okafor with the
                selected reason.
              </p>
            </div>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="drawer-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setAdjusting(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="create-button"
              >
                Save adjustment
              </button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
}
