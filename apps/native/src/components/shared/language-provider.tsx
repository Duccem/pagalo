import { ReactNode, useEffect } from "react";
import { setLocale } from "@/lib/i18n";
import { useLanguagePreference } from "@/lib/preferences";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguagePreference();

  useEffect(() => {
    setLocale(language);
  }, [language]);

  return <>{children}</>;
}

export default LanguageProvider;

