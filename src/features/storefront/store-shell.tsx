"use client";
import Link from "next/link";
import { useOnboarding } from "@/features/onboarding/store";
import { nameInitials } from "@/lib/name-initials";
import { ShoppingBag } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { StoreCartProvider, useStoreCart } from "./cart-store";
function StoreHeader() {
  const name =
    useOnboarding((state) => state.data.business.name) || "Amina’s Fashion";
  const slug = useStoreCart((state) => state.slug);
  const count = useStoreCart((state) =>
    state.cart.reduce((sum, line) => sum + line.quantity, 0),
  );
  return (
    <header className="store-header">
      <Link className="store-brand" href={`/store/${slug}`}>
        <span>{nameInitials(name)}</span>
        <strong>{name}</strong>
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
  const name =
    useOnboarding((state) => state.data.business.name) || "Amina’s Fashion";
  const colour = useOnboarding((state) => state.data.store.colour);
  return (
    <StoreCartProvider key={slug} slug={slug}>
      <div className="store-app" data-brand={colour}>
        <StoreHeader />
        {children}
        <footer className="store-footer" id="store-about">
          <strong>{name}</strong>
          <span>Powered by SellWella · Demo storefront</span>
        </footer>
      </div>
    </StoreCartProvider>
  );
}
