"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductForm } from "./schemas";
import { FieldError } from "@/components/ui/field-error";
import { Drawer } from "@/components/ui/drawer";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { ProductImage } from "@/components/ui/product-image";
import { formatMoney } from "@/lib/format-money";
import { useMerchantStore } from "@/features/merchant/store";

export function ProductsPage() {
  const products = useMerchantStore((state) => state.products);
  const setProducts = useMerchantStore((state) => state.setProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset: setForm,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "Bags",
      sku: "",
      price: "",
      cost: "",
      stock: "",
      threshold: "3",
      published: true,
    },
  });

  const categories = [
    "All categories",
    ...new Set(products.map((item) => item.category)),
  ];
  const filtered = products.filter(
    (product) =>
      (category === "All categories" || product.category === category) &&
      `${product.name} ${product.sku}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const lowStock = products.filter(
    (product) => product.onHand - product.reserved <= product.threshold,
  ).length;
  const inventoryValue = products.reduce(
    (total, product) => total + product.cost * product.onHand,
    0,
  );

  const createProduct = (form: ProductForm) => {
    const nextId = Math.max(0, ...products.map((product) => product.id)) + 1;
    setProducts((current) => [
      {
        id: nextId,
        name: form.name.trim(),
        category: form.category,
        sku: form.sku.trim() || `AF-${String(nextId).padStart(3, "0")}`,
        price: Number(form.price),
        cost: Number(form.cost || 0),
        onHand: Number(form.stock),
        reserved: 0,
        threshold: Number(form.threshold || 0),
        published: form.published,
        image: "",
      },
      ...current,
    ]);
    setForm({
      name: "",
      category: "Bags",
      sku: "",
      price: "",
      cost: "",
      stock: "",
      threshold: "3",
      published: true,
    });
    setDrawerOpen(false);
    toast.success("Product saved");
  };

  const toggleVisibility = (id: number) =>
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? { ...product, published: !product.published }
          : product,
      ),
    );

  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Commerce</p>
          <h1>Products</h1>
          <p className="subtitle">
            Manage the catalogue shared by your storefront, orders and
            inventory.
          </p>
        </div>
        <div className="module-actions">
          <button className="secondary-button">Import CSV</button>
          <button className="create-button" onClick={() => setDrawerOpen(true)}>
            <Icon name="plus" size={18} /> Add product
          </button>
        </div>
      </section>

      <section className="module-stats">
        <article>
          <span>Total products</span>
          <strong>{products.length}</strong>
          <small>Across {categories.length - 1} categories</small>
        </article>
        <article>
          <span>Published</span>
          <strong>{products.filter((item) => item.published).length}</strong>
          <small>Visible on your storefront</small>
        </article>
        <article>
          <span>Low stock</span>
          <strong className={lowStock ? "warning-text" : ""}>{lowStock}</strong>
          <small>At or below reorder level</small>
        </article>
        <article>
          <span>Stock value</span>
          <strong>{formatMoney(inventoryValue)}</strong>
          <small>Based on recorded costs</small>
        </article>
      </section>

      <section className="catalogue-panel">
        <div className="catalogue-toolbar">
          <label className="field-search">
            <Icon name="search" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products or SKU"
              aria-label="Search products or SKU"
            />
          </label>
          <select
            aria-label="Filter products by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="view-toggle" aria-label="Catalogue view">
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
            <button
              className={view === "table" ? "active" : ""}
              onClick={() => setView("table")}
            >
              Table
            </button>
          </div>
        </div>

        <div className="results-summary">
          <span>{filtered.length} products</span>
          <span>Catalogue updates are reflected across SellWella</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <span>
              <Icon name="products" size={26} />
            </span>
            <h2>No products found</h2>
            <p>Try another search or add a new product to your catalogue.</p>
            <button
              className="create-button"
              onClick={() => setDrawerOpen(true)}
            >
              Add product
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="product-grid">
            {filtered.map((product) => {
              const available = product.onHand - product.reserved;
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-media">
                    <ProductImage product={product} />
                    <span
                      className={`visibility-pill ${
                        product.published ? "live" : "hidden"
                      }`}
                    >
                      {product.published ? "Published" : "Hidden"}
                    </span>
                    <button
                      className="media-more"
                      aria-label={`More options for ${product.name}`}
                    >
                      <Icon name="more" size={18} />
                    </button>
                  </div>
                  <div className="product-card-body">
                    <span className="product-category">{product.category}</span>
                    <h2>{product.name}</h2>
                    <p>{product.sku}</p>
                    <div className="product-price-row">
                      <strong>{formatMoney(product.price)}</strong>
                      <span
                        className={
                          available <= product.threshold
                            ? "stock-low"
                            : "stock-good"
                        }
                      >
                        {available} available
                      </span>
                    </div>
                    <button
                      className="card-action"
                      onClick={() => toggleVisibility(product.id)}
                    >
                      {product.published
                        ? "Hide from store"
                        : "Publish to store"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="catalogue-table-wrap">
            <div className="catalogue-table">
              <div className="catalogue-head">
                <span>Product</span>
                <span>SKU</span>
                <span>Price</span>
                <span>Available</span>
                <span>Storefront</span>
                <span />
              </div>
              {filtered.map((product) => (
                <div className="catalogue-row" key={product.id}>
                  <span className="table-product">
                    <i>
                      <ProductImage product={product} />
                    </i>
                    <b>
                      {product.name}
                      <small>{product.category}</small>
                    </b>
                  </span>
                  <span>{product.sku}</span>
                  <strong>{formatMoney(product.price)}</strong>
                  <span>{product.onHand - product.reserved}</span>
                  <span
                    className={`visibility-pill ${
                      product.published ? "live" : "hidden"
                    }`}
                  >
                    {product.published ? "Published" : "Hidden"}
                  </span>
                  <button
                    className="row-action"
                    onClick={() => toggleVisibility(product.id)}
                  >
                    {product.published ? "Hide" : "Publish"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {drawerOpen && (
        <Drawer
          onClose={() => setDrawerOpen(false)}
          label="product form"
          className="form-drawer"
        >
          <div className="drawer-header">
            <div>
              <span>New product</span>
              <h2>Add to your catalogue</h2>
            </div>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
          <form noValidate onSubmit={handleSubmit(createProduct)}>
            <div className="form-section">
              <h3>Basic information</h3>
              <label>
                Product name
                <input
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                  placeholder="e.g. Classic Tote Bag"
                />
                <FieldError error={errors.name} id="name-error" />
              </label>
              <div className="form-row">
                <label>
                  Category
                  <select
                    {...register("category")}
                    aria-invalid={!!errors.category}
                    aria-describedby="category-error"
                  >
                    <option>Bags</option>
                    <option>Shoes</option>
                    <option>Dresses</option>
                    <option>Accessories</option>
                    <option>Other</option>
                  </select>
                  <FieldError error={errors.category} id="category-error" />
                </label>
                <label>
                  SKU <span>Optional</span>
                  <input
                    {...register("sku")}
                    aria-invalid={!!errors.sku}
                    aria-describedby="sku-error"
                    placeholder="Auto-generated"
                  />
                  <FieldError error={errors.sku} id="sku-error" />
                </label>
              </div>
            </div>
            <div className="form-section">
              <h3>Pricing</h3>
              <div className="form-row">
                <label>
                  Selling price (₦)
                  <input
                    type="number"
                    min="0"
                    {...register("price")}
                    aria-invalid={!!errors.price}
                    aria-describedby="price-error"
                    placeholder="0"
                  />
                  <FieldError error={errors.price} id="price-error" />
                </label>
                <label>
                  Cost price (₦)
                  <input
                    type="number"
                    min="0"
                    {...register("cost")}
                    aria-invalid={!!errors.cost}
                    aria-describedby="cost-error"
                    placeholder="0"
                  />
                  <FieldError error={errors.cost} id="cost-error" />
                </label>
              </div>
            </div>
            <div className="form-section">
              <h3>Inventory</h3>
              <div className="form-row">
                <label>
                  Opening stock
                  <input
                    type="number"
                    min="0"
                    {...register("stock")}
                    aria-invalid={!!errors.stock}
                    aria-describedby="stock-error"
                    placeholder="0"
                  />
                  <FieldError error={errors.stock} id="stock-error" />
                </label>
                <label>
                  Low-stock alert
                  <input
                    type="number"
                    min="0"
                    {...register("threshold")}
                    aria-invalid={!!errors.threshold}
                    aria-describedby="threshold-error"
                  />
                  <FieldError error={errors.threshold} id="threshold-error" />
                </label>
              </div>
              <label className="check-label">
                <input
                  type="checkbox"
                  {...register("published")}
                  aria-invalid={!!errors.published}
                  aria-describedby="published-error"
                />
                <FieldError error={errors.published} id="published-error" />
                <span>
                  <strong>Publish to storefront</strong>
                  <small>Customers can see this product immediately.</small>
                </span>
              </label>
            </div>
            <div className="drawer-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDrawerOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="create-button"
              >
                Save product
              </button>
            </div>
          </form>
        </Drawer>
      )}
    </div>
  );
}
