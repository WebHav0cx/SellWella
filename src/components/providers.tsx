"use client";

import { MerchantStoreProvider } from "@/features/merchant/store";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

function ThemeToaster() {
  const theme = useTheme((state) => state.theme);
  return <Toaster theme={theme} richColors position="top-right" />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MerchantStoreProvider>{children}</MerchantStoreProvider>
      <ThemeToaster />
    </ThemeProvider>
  );
}
