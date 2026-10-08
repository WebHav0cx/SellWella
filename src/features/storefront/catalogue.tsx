"use client";
import { useState } from "react";
import Link from "next/link";
import { useMerchantStore } from "@/features/merchant/store";
import { ProductImage } from "@/components/ui/product-image";
import { useStoreCart } from "./cart-store";
import { StoreProductCard } from "./product-card";
export function StoreCatalogue() {
  const products = useMerchantStore((state) => state.products);
  const slug = useStoreCart((state) => state.slug);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const published = products.filter((product) => product.published);
  const categories = [
    "All",
    ...new Set(published.map((product) => product.category)),
  ];
  const visible = published.filter(
    (product) =>
      (category === "All" || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <main className="store-main">
      <section className="store-hero">
        <div>
          <span>New collection · Lagos</span>
          <h1>Everyday pieces, beautifully chosen.</h1>
          <p>
            Thoughtful fashion essentials for work, weekends and everything in
            between.
          </p>
          <Link className="store-primary" href="#store-products">
            Shop the collection
          </Link>
        </div>
        <div className="hero-product">
          {published[0] && <ProductImage product={published[0]} />}
          <span>Curated by Amina</span>
        </div>
      </section>
      <section className="store-benefits">
        <span>
          <strong>Secure checkout</strong>
          <small>No real payment is processed</small>
        </span>
        <span>
          <strong>Delivery across Lagos</strong>
          <small>Pickup also available</small>
        </span>
        <span>
          <strong>Live availability</strong>
          <small>Connected to store inventory</small>
        </span>
      </section>
      <section className="store-catalogue" id="store-products">
        <div className="store-section-heading">
          <div>
            <span>Shop the edit</span>
            <h2>Featured products</h2>
          </div>
          <p>{visible.length} pieces available</p>
        </div>
        <div className="store-filters">
          <input
            aria-label="Search the collection"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the collection"
          />
          <div>
            {categories.map((item) => (
              <button
                type="button"
                aria-pressed={category === item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="store-product-grid">
          {visible.map((product) => (
            <StoreProductCard key={product.id} product={product} slug={slug} />
          ))}
        </div>
        {!visible.length && (
          <div className="store-empty">
            <h2>No matching products</h2>
            <p>Try another search or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
