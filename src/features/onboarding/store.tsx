"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { createStore, useStore } from "zustand";
import {
  defaultOnboarding,
  readOnboardingProgress,
  onboardingProgressSchema,
  ONBOARDING_KEY,
  type OnboardingProgress,
} from "./schema";
type OnboardingState = {
  data: OnboardingProgress;
  hydrated: boolean;
  update: (update: SetStateAction<OnboardingProgress>) => void;
};
function createOnboardingStore() {
  return createStore<OnboardingState>()((set, get) => ({
    data: structuredClone(defaultOnboarding),
    hydrated: false,
    update: (update) => {
      const next = onboardingProgressSchema.safeParse(
        typeof update === "function" ? update(get().data) : update,
      );
      if (!next.success) return;
      set({ data: next.data });
      try {
        localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next.data));
      } catch {
        /* In-memory setup remains available. */
      }
    },
  }));
}
const Context = createContext<ReturnType<typeof createOnboardingStore> | null>(
  null,
);
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createOnboardingStore);
  useEffect(() => {
    store.setState({ data: readOnboardingProgress(), hydrated: true });
    const sync = (event: StorageEvent) => {
      if (event.key === ONBOARDING_KEY)
        store.setState({ data: readOnboardingProgress() });
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useOnboarding<T>(selector: (state: OnboardingState) => T) {
  const store = useContext(Context);
  if (!store) throw new Error("OnboardingProvider is required.");
  return useStore(store, selector);
}
