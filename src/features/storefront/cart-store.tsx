"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, useStore } from "zustand";
import { useMerchantStore } from "@/features/merchant/store";
import type { Product } from "@/features/merchant/data";
export type CartLine = { productId: number; quantity: number; variant: string };
type CartState = {
  slug: string;
  cart: CartLine[];
  add: (product: Product, variant: string) => boolean;
  change: (line: CartLine, quantity: number, product: Product) => boolean;
  clear: () => void;
};
function createCart(slug: string) {
  return createStore<CartState>()((set, get) => ({
    slug,
    cart: [],
    clear: () => set({ cart: [] }),
    add: (product, variant) => {
      const cart = get().cart;
      const count = cart
        .filter((line) => line.productId === product.id)
        .reduce((sum, line) => sum + line.quantity, 0);
      if (!product.published || count >= product.onHand - product.reserved)
        return false;
      const existing = cart.find(
        (line) => line.productId === product.id && line.variant === variant,
      );
      set({
        cart: existing
          ? cart.map((line) =>
              line === existing
                ? { ...line, quantity: line.quantity + 1 }
                : line,
            )
          : [...cart, { productId: product.id, quantity: 1, variant }],
      });
      return true;
    },
    change: (line, quantity, product) => {
      if (!Number.isSafeInteger(quantity) || quantity < 0) return false;
      const cart = get().cart;
      const others = cart
        .filter(
          (item) =>
            item.productId === product.id && item.variant !== line.variant,
        )
        .reduce((sum, item) => sum + item.quantity, 0);
      if (quantity > 0 && quantity + others > product.onHand - product.reserved)
        return false;
      set({
        cart:
          quantity === 0
            ? cart.filter(
                (item) =>
                  !(
                    item.productId === line.productId &&
                    item.variant === line.variant
                  ),
              )
            : cart.map((item) =>
                item.productId === line.productId &&
                item.variant === line.variant
                  ? { ...item, quantity }
                  : item,
              ),
      });
      return true;
    },
  }));
}
const Context = createContext<ReturnType<typeof createCart> | null>(null);
export function StoreCartProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [store] = useState(() => createCart(slug));
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useStoreCart<T>(selector: (state: CartState) => T) {
  const store = useContext(Context);
  if (!store) throw new Error("StoreCartProvider is required.");
  return useStore(store, selector);
}
export function useCartDetails() {
  const products = useMerchantStore((state) => state.products);
  const cart = useStoreCart((state) => state.cart);
  const lines = cart.flatMap((line) => {
    const product = products.find(
      (item) => item.id === line.productId && item.published,
    );
    return product ? [{ ...line, product }] : [];
  });
  return {
    lines,
    subtotal: lines.reduce(
      (sum, line) => sum + line.quantity * line.product.price,
      0,
    ),
  };
}
