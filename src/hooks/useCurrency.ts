import { useState, useEffect, useCallback, useRef } from 'react';
import { Currency, ExchangeRate } from '../types';
import { CURRENCIES, CURRENCY_MAP } from '../data/CurrenciesFile.ts';

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE_URL        = 'https://open.er-api.com/v6/latest';
const REFRESH_INTERVAL_MS = 60_000;

const SUPPORTED: Currency[] = CURRENCIES.map(c => c.code);

// ─── Fallback estático (valores aproximados) ──────────────────────────────────
const FALLBACK_FROM_USD: Record<Currency, number> = {
  USD: 1,
  EUR: 0.920,
  GBP: 0.790,
  JPY: 149.50,
  CHF: 0.900,
  MXN: 17.20,
  COP: 3950.00,
  ARS: 870.00,
  CLP: 920.00,
  PEN: 3.72,
  CAD: 1.360,
  AUD: 1.530,
  CNY: 7.240,
  BRL: 4.980,
  TRY: 32.10,
};

// ─── Tipos ────────────────────────────────────────────────────────────────────
type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseCurrencyReturn {
  rates: ExchangeRate;
  convert: (amount: number, from: Currency, to: Currency) => number;
  setBaseCurrency: (currency: Currency) => void;
  status: FetchStatus;
  error: string | null;
  refetch: () => void;
  isUsingFallback: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function filterSupported(apiRates: Record<string, number>): Record<Currency, number> {
  return SUPPORTED.reduce((acc, code) => {
    acc[code] = apiRates[code] ?? FALLBACK_FROM_USD[code];
    return acc;
  }, {} as Record<Currency, number>);
}

function rebase(
  ratesFromUsd: Record<Currency, number>,
  newBase: Currency,
): Record<Currency, number> {
  const pivot = ratesFromUsd[newBase];
  if (!pivot) return ratesFromUsd;
  return SUPPORTED.reduce((acc, code) => {
    acc[code] = code === newBase ? 1 : ratesFromUsd[code] / pivot;
    return acc;
  }, {} as Record<Currency, number>);
}

export function formatAmount(value: number, currency: Currency, locale = 'es-CO'): string {
  const meta = CURRENCY_MAP[currency];
  const opts: Intl.NumberFormatOptions = meta.noDecimals
    ? { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    : { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return value.toLocaleString(locale, opts);
}

export function formatRate(rate: number, toCurrency: Currency, locale = 'es-CO'): string {
  const meta = CURRENCY_MAP[toCurrency];
  if (meta.noDecimals) {
    return rate.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  const maxDec = rate < 0.01 ? 6 : rate < 1 ? 4 : 2;
  return rate.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: maxDec });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCurrency(): UseCurrencyReturn {
  const [rates, setRates] = useState<ExchangeRate>({
    base: 'USD',
    rates: { ...FALLBACK_FROM_USD },
    lastUpdate: new Date(),
  });

  const [status,          setStatus]          = useState<FetchStatus>('idle');
  const [error,           setError]           = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const rawUsdRef = useRef<Record<Currency, number> | null>(null);

  const fetchRates = useCallback(async (base: Currency) => {
    setStatus('loading');
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/${base}`, {
        signal: AbortSignal.timeout(8_000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const data = await res.json();
      if (data.result !== 'success') throw new Error(data['error-type'] ?? 'API error');

      const filtered = filterSupported(data.rates as Record<string, number>);

      if (base === 'USD') rawUsdRef.current = filtered;

      setRates({
        base,
        rates: { ...filtered, [base]: 1 },
        lastUpdate: new Date(data.time_last_update_utc ?? Date.now()),
      });
      setStatus('success');
      setIsUsingFallback(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      console.warn('[useCurrency] Fallback activo:', msg);
      setError(msg);
      setStatus('error');
      setIsUsingFallback(true);

      setRates(prev => ({
        base: prev.base,
        rates: rebase(FALLBACK_FROM_USD, prev.base),
        lastUpdate: new Date(),
      }));
    }
  }, []);

  useEffect(() => {
    fetchRates(rates.base);
    const id = setInterval(() => fetchRates(rates.base), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates.base, fetchRates]);

  const setBaseCurrency = useCallback((currency: Currency) => {
    if (rawUsdRef.current) {
      setRates({
        base: currency,
        rates: rebase(rawUsdRef.current, currency),
        lastUpdate: new Date(),
      });
    } else {
      setRates(prev => ({ ...prev, base: currency }));
    }
  }, []);

  const convert = useCallback(
    (amount: number, from: Currency, to: Currency): number => {
      if (from === to) return amount;
      if (rates.base === from) return amount * (rates.rates[to] ?? 1);
      if (rawUsdRef.current) {
        const toUsd = 1 / (rawUsdRef.current[from] ?? 1);
        return amount * toUsd * (rawUsdRef.current[to] ?? 1);
      }
      const toUsd = 1 / (FALLBACK_FROM_USD[from] ?? 1);
      return amount * toUsd * (FALLBACK_FROM_USD[to] ?? 1);
    },
    [rates],
  );

  return {
    rates,
    convert,
    setBaseCurrency,
    status,
    error,
    refetch: () => fetchRates(rates.base),
    isUsingFallback,
  };
}