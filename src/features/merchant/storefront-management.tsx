"use client";

import { useRouter } from "next/navigation";

import { useMerchantStore } from "./store";
import { formatMoney } from "@/lib/format-money";

import { ProductImage } from "@/components/ui/product-image";
import { copyToClipboard } from "@/lib/copy-to-clipboard";

export function StorefrontManagementPage() {
  const products = useMerchantStore((state) => state.products);
  const orders = useMerchantStore((state) => state.orders);

  const router = useRouter();
  const navigate = (href: string) => router.push(href);
  const published = products.filter((product) => product.published);
  const storefrontOrders = orders.filter(
    (order) => order.source === "Storefront",
  );
  return (
    <div className="module-page">
      <section className="module-header">
        <div>
          <p className="module-kicker">Commerce</p>
          <h1>Online Storefront</h1>
          <p className="subtitle">
            Manage and preview the public shopping experience connected to your
            catalogue.
          </p>
        </div>
        <button
          className="create-button"
          onClick={() =>
            window.open(
              "/store/aminas-fashion",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          Open public store
        </button>
      </section>
      <div className="demo-banner horizontal">
        <strong>Published demo store</strong>
        <p>
          This public storefront uses browser-persisted demo products, stock,
          customers and orders.
        </p>
      </div>
      <section className="module-stats">
        <article>
          <span>Store status</span>
          <strong>Published</strong>
          <small>Public demo route is active</small>
        </article>
        <article>
          <span>Published products</span>
          <strong>{published.length}</strong>
          <small>Visible to shoppers</small>
        </article>
        <article>
          <span>Storefront orders</span>
          <strong>{storefrontOrders.length}</strong>
          <small>Connected to Orders</small>
        </article>
        <article>
          <span>Store revenue</span>
          <strong>
            {formatMoney(
              storefrontOrders
                .filter((order) => order.paymentStatus === "Paid")
                .reduce((sum, order) => sum + order.total, 0),
            )}
          </strong>
          <small>Confirmed demo payments</small>
        </article>
      </section>
      <section className="store-management-grid">
        <div className="store-preview-card">
          <div className="preview-browser">
            <span>sellwella.demo/store/aminas-fashion</span>
          </div>
          <div className="preview-hero">
            <span>AMINA&apos;S FASHION</span>
            <h2>Everyday pieces, beautifully chosen.</h2>
            <button onClick={() => navigate("/store/aminas-fashion")}>
              Preview store
            </button>
          </div>
          <div className="preview-products">
            {published.slice(0, 3).map((product) => (
              <div key={product.id}>
                <ProductImage product={product} />
              </div>
            ))}
          </div>
        </div>
        <aside className="store-management-actions">
          <h2>Store setup</h2>
          {[
            "Design & Branding",
            "Products & Collections",
            "Checkout",
            "Shipping & Pickup",
            "Domain & SEO",
          ].map((item, index) => (
            <div className="setup-row" key={item}>
              <span>{index + 1}</span>
              <strong>
                {item}
                <small>{index < 2 ? "Configured" : "Demo defaults"}</small>
              </strong>
              <b>Ready</b>
            </div>
          ))}
          <div className="store-url-card">
            <strong>Public store URL</strong>
            <p>sellwella.demo/store/aminas-fashion</p>
            <button
              onClick={() =>
                copyToClipboard(
                  `${window.location.origin}/store/aminas-fashion`,
                  "Store URL",
                )
              }
            >
              Copy URL
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
