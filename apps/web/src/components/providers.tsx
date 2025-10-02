"use client";

import { I18nProviderClient } from "@/lib/translations/client";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({
  children,
  locale = "es",
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProviderClient locale={locale}>{children}</I18nProviderClient>

      <Toaster richColors />
    </ThemeProvider>
  );
}

