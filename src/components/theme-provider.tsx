"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createStore, useStore } from "zustand";
import { THEME_STORAGE_KEY } from "@/lib/theme-preference";

type Theme = "light" | "dark";
type ThemeState = { theme: Theme; setTheme: (theme: Theme) => void };

function createThemeStore() {
  return createStore<ThemeState>()((set) => ({
    theme: "light",
    setTheme: (theme) => {
      document.documentElement.dataset.theme = theme;
      set({ theme });
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        /* The toggle still works when storage is unavailable. */
      }
    },
  }));
}

const ThemeContext = createContext<ReturnType<typeof createThemeStore> | null>(
  null,
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createThemeStore);

  useEffect(() => {
    store
      .getState()
      .setTheme(
        document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      );
    const syncTheme = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        store.getState().setTheme(event.newValue === "dark" ? "dark" : "light");
      }
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, [store]);

  return (
    <ThemeContext.Provider value={store}>{children}</ThemeContext.Provider>
  );
}

export function useTheme<T>(selector: (state: ThemeState) => T) {
  const store = useContext(ThemeContext);
  if (!store) throw new Error("ThemeProvider is required.");
  return useStore(store, selector);
}
