// Main brand color tokens
export const BRAND = {
  primary: "#4ade80",
  primaryActive: "#15803d",
};

export const NAV_THEME = {
  light: {
    background: "#f3f4f6",
    backgroundAlt: "#ffffff",
    border: "#e5e7eb",
    card: "#ffffff",
    notification: "#f87171",
    primary: BRAND.primary,
    text: "#111827",
    textSecondary: "#4b5563",
  },
  dark: {
    background: "#09090b",
    backgroundAlt: "#18181b",
    border: "#27272a",
    card: "#18181b",
    notification: "#f87171",
    primary: BRAND.primary,
    text: "#f9fafb",
    textSecondary: "#9ca3af",
  },
};

export type AppTheme = typeof NAV_THEME.light & { mode: "light" | "dark" };

export function getAppTheme(mode: "light" | "dark"): AppTheme {
  return { ...(NAV_THEME as any)[mode], mode };
}
