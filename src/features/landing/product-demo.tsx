"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { useState } from "react";
export function ProductDemo() {
  const [preview, setPreview] = useState("Dashboard");
  const previewTabs = [
    "Dashboard",
    "Products",
    "Orders",
    "Inventory",
    "Storefront",
  ];
  return (
    <section className="product-demo">
      <div className="landing-section-heading light">
        <span>PRODUCT DEMONSTRATION</span>
        <h2>See the connected workspace in action.</h2>
        <p>
          Explore illustrative product surfaces or enter the live browser
          demonstration.
        </p>
      </div>
      <div className="demo-tabs">
        {previewTabs.map((item) => (
          <button
            className={preview === item ? "active" : ""}
            onClick={() => setPreview(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="demo-window">
        <header>
          <i />
          <i />
          <i />
          <span>app.sellwella.demo/{preview.toLowerCase()}</span>
        </header>
        <div className="demo-window-body">
          <aside>
            <Image src="/sellwella-mark.svg" alt="" width={30} height={30} />
            {["Overview", "Inbox", "Orders", "Products", "Inventory"].map(
              (item) => (
                <span
                  className={
                    preview === item ||
                    (preview === "Dashboard" && item === "Overview")
                      ? "active"
                      : ""
                  }
                  key={item}
                >
                  {item}
                </span>
              ),
            )}
          </aside>
          <main>
            <span>Product demonstration</span>
            <h3>{preview}</h3>
            <div className="demo-metrics">
              <article>
                <small>Sales</small>
                <strong>₦485K</strong>
              </article>
              <article>
                <small>Orders</small>
                <strong>32</strong>
              </article>
              <article>
                <small>Available stock</small>
                <strong>47</strong>
              </article>
            </div>
            <div className="demo-placeholder">
              <i />
              <i />
              <i />
              <i />
            </div>
          </main>
        </div>
      </div>
      <Link className="demo-enter" href="/app">
        Enter Workspace <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
