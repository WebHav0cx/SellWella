"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createStore, useStore } from "zustand";
import { readDemoSession } from "./demo-session";
import type { DemoSession } from "./schemas";
const Context = createContext<ReturnType<typeof createSessionStore> | null>(
  null,
);
function createSessionStore() {
  return createStore<{ session: DemoSession | null }>()(() => ({
    session: null,
  }));
}
export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createSessionStore);
  useEffect(() => {
    const restore = () => store.setState({ session: readDemoSession() });
    restore();
    window.addEventListener("sellwella-demo-session-changed", restore);
    return () =>
      window.removeEventListener("sellwella-demo-session-changed", restore);
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useDemoSession<T>(
  selector: (state: { session: DemoSession | null }) => T,
) {
  const store = useContext(Context);
  if (!store) throw new Error("DemoSessionProvider is required.");
  return useStore(store, selector);
}
