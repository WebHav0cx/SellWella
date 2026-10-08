"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { createStore, useStore } from "zustand";
import {
  initialProducts,
  initialCustomers,
  initialBusinessOrders,
  type Product,
  type Customer,
  type BusinessOrder,
} from "./data";

type MerchantState = {
  products: Product[];
  customers: Customer[];
  orders: BusinessOrder[];
  setProducts: (update: SetStateAction<Product[]>) => void;
  setCustomers: (update: SetStateAction<Customer[]>) => void;
  setOrders: (update: SetStateAction<BusinessOrder[]>) => void;
};

function createMerchantStore() {
  return createStore<MerchantState>()((set) => ({
    products: initialProducts,
    customers: initialCustomers,
    orders: initialBusinessOrders,
    setProducts: (update) =>
      set((state) => ({
        products:
          typeof update === "function" ? update(state.products) : update,
      })),
    setCustomers: (update) =>
      set((state) => ({
        customers:
          typeof update === "function" ? update(state.customers) : update,
      })),
    setOrders: (update) =>
      set((state) => ({
        orders: typeof update === "function" ? update(state.orders) : update,
      })),
  }));
}

const StoreContext = createContext<ReturnType<
  typeof createMerchantStore
> | null>(null);

export function MerchantStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createMerchantStore);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useMerchantStore<T>(selector: (state: MerchantState) => T): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error("MerchantStoreProvider is required.");
  return useStore(store, selector);
}
