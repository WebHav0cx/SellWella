"use client";

import { MerchantStoreProvider } from "@/features/merchant/store";
import { DemoSessionProvider } from "@/features/auth/session-provider";
import { OnboardingProvider } from "@/features/onboarding/store";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

function ThemeToaster() {
  const theme = useTheme((state) => state.theme);
  return <Toaster theme={theme} richColors position="top-right" />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DemoSessionProvider>
        <OnboardingProvider>
          <MerchantStoreProvider>{children}</MerchantStoreProvider>
        </OnboardingProvider>
      </DemoSessionProvider>
      <ThemeToaster />
    </ThemeProvider>
  );
}
