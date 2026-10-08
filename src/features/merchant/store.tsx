"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import {
  createCommerceStore,
  COMMERCE_STORAGE_KEY,
  type MerchantState,
} from "./commerce-store";
import { savedCommerceSchema } from "./commerce-schemas";
const StoreContext = createContext<ReturnType<
  typeof createCommerceStore
> | null>(null);
export function MerchantStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createCommerceStore);
  useEffect(() => {
    const restore = (stored: string | null) => {
      if (!stored) return;
      try {
        const result = savedCommerceSchema.safeParse(JSON.parse(stored));
        if (result.success) store.setState(result.data);
      } catch {
        /* Ignore malformed demo data. */
      }
    };
    try {
      restore(localStorage.getItem(COMMERCE_STORAGE_KEY));
    } catch {
      /* Storage may be unavailable. */
    }
    store.setState({ hydrated: true });
    const unsubscribe = store.subscribe(
      ({ products, customers, orders, activities }) => {
        try {
          localStorage.setItem(
            COMMERCE_STORAGE_KEY,
            JSON.stringify({ products, customers, orders, activities }),
          );
        } catch {
          /* In-memory demo actions remain available. */
        }
      },
    );
    const sync = (event: StorageEvent) => {
      if (event.key === COMMERCE_STORAGE_KEY) restore(event.newValue);
    };
    window.addEventListener("storage", sync);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", sync);
    };
  }, [store]);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
export function useMerchantStore<T>(selector: (state: MerchantState) => T): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error("MerchantStoreProvider is required.");
  return useStore(store, selector);
}
