import {
  SupportedCurrency,
  SUPPORTED_CURRENCIES_LABELS,
  useCurrencyPreference,
} from "./preferences";

// Hook to get currency symbol and a formatter based on user preference or override
export function useMoneyFormatter(override?: SupportedCurrency) {
  const { currency } = useCurrencyPreference();
  const cur = override ?? currency;
  const symbol = SUPPORTED_CURRENCIES_LABELS[cur] ?? "$";
  const format = (value?: number | null) =>
    `${symbol}${(value ?? 0).toFixed(2)}`;
  return { symbol, format } as const;
}

