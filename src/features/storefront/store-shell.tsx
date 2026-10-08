"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { StoreCartProvider, useStoreCart } from "./cart-store";
function StoreHeader() {
  const slug = useStoreCart((state) => state.slug);
  const count = useStoreCart((state) =>
    state.cart.reduce((sum, line) => sum + line.quantity, 0),
  );
  return (
    <header className="store-header">
      <Link className="store-brand" href={`/store/${slug}`}>
        <span>AF</span>
        <strong>Amina&apos;s Fashion</strong>
      </Link>
      <nav aria-label="Store navigation">
        <Link href={`/store/${slug}`}>Shop</Link>
        <Link href={`/store/${slug}#store-products`}>New arrivals</Link>
        <Link href={`/store/${slug}#store-about`}>About</Link>
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link className="store-cart-button" href={`/store/${slug}/cart`}>
          <ShoppingBag size={18} aria-hidden="true" /> Bag <span>{count}</span>
        </Link>
      </div>
    </header>
  );
}
export function StorefrontShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <StoreCartProvider key={slug} slug={slug}>
      <div className="store-app">
        <StoreHeader />
        {children}
        <footer className="store-footer" id="store-about">
          <strong>Amina&apos;s Fashion</strong>
          <span>Powered by SellWella · Demo storefront</span>
        </footer>
      </div>
    </StoreCartProvider>
  );
}
