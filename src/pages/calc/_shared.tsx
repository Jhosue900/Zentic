// ─── _shared.tsx ─────────────────────────────────────────────────────────────
// Tipos, contexto de moneda, helpers de formato y hook useFormattedInput
// compartidos entre todas las calculadoras individuales.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, createContext, useContext } from 'react';

// ── Tipos re-exportados ───────────────────────────────────────────────────────
export type Currency =
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF'
  | 'MXN' | 'COP' | 'ARS' | 'CLP' | 'PEN'
  | 'CAD' | 'AUD' | 'CNY' | 'BRL' | 'TRY';

export type TaxOperation = 'add' | 'remove';
export type ContributionTiming = 'beginning' | 'end';

// ── Mapa mínimo de monedas (usa el tuyo de CurrenciesFile si prefieres) ───────
export interface CurrencyMeta {
  symbol: string;
  name: string;
  flag: string;
  locale: string;
  noDecimals?: boolean;
}

export const CURRENCY_MAP: Record<Currency, CurrencyMeta> = {
  USD: { symbol: '$',  name: 'Dólar Estadounidense', flag: '🇺🇸', locale: 'en-US' },
  EUR: { symbol: '€',  name: 'Euro',                  flag: '🇪🇺', locale: 'es-ES' },
  GBP: { symbol: '£',  name: 'Libra Esterlina',       flag: '🇬🇧', locale: 'en-GB' },
  JPY: { symbol: '¥',  name: 'Yen Japonés',           flag: '🇯🇵', locale: 'ja-JP', noDecimals: true },
  CHF: { symbol: 'Fr', name: 'Franco Suizo',          flag: '🇨🇭', locale: 'de-CH' },
  MXN: { symbol: '$',  name: 'Peso Mexicano',         flag: '🇲🇽', locale: 'es-MX' },
  COP: { symbol: '$',  name: 'Peso Colombiano',       flag: '🇨🇴', locale: 'es-CO', noDecimals: true },
  ARS: { symbol: '$',  name: 'Peso Argentino',        flag: '🇦🇷', locale: 'es-AR' },
  CLP: { symbol: '$',  name: 'Peso Chileno',          flag: '🇨🇱', locale: 'es-CL', noDecimals: true },
  PEN: { symbol: 'S/', name: 'Sol Peruano',           flag: '🇵🇪', locale: 'es-PE' },
  CAD: { symbol: '$',  name: 'Dólar Canadiense',      flag: '🇨🇦', locale: 'en-CA' },
  AUD: { symbol: '$',  name: 'Dólar Australiano',     flag: '🇦🇺', locale: 'en-AU' },
  CNY: { symbol: '¥',  name: 'Yuan Chino',            flag: '🇨🇳', locale: 'zh-CN' },
  BRL: { symbol: 'R$', name: 'Real Brasileño',        flag: '🇧🇷', locale: 'pt-BR' },
  TRY: { symbol: '₺',  name: 'Lira Turca',           flag: '🇹🇷', locale: 'tr-TR' },
};

export const CURRENCY_GROUPS = [
  { label: 'Big 5 — Mercados globales', codes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'] as Currency[] },
  { label: 'Latinoamérica',             codes: ['MXN', 'COP', 'ARS', 'CLP', 'PEN'] as Currency[] },
  { label: 'Turismo y comercio',        codes: ['CAD', 'AUD', 'CNY', 'BRL', 'TRY'] as Currency[] },
];

// ── Context global de moneda ──────────────────────────────────────────────────
export const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
}>({ currency: 'USD', setCurrency: () => {}, symbol: '$' });

export const useCurrency = () => useContext(CurrencyContext);

// ── Helpers de formato ────────────────────────────────────────────────────────
export const getLocaleByCurrency = (currency: Currency): string =>
  CURRENCY_MAP[currency]?.locale ?? 'en-US';

export const formatNumberByCurrency = (value: number, currency: Currency): string => {
  if (isNaN(value)) return '0';
  const meta = CURRENCY_MAP[currency];
  const locale = meta?.locale ?? 'en-US';
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: meta?.noDecimals ? 0 : 2,
  });
};

export const formatNumberLiveByCurrency = (value: string, currency: Currency): string => {
  if (!value) return '';
  const cleanValue = value.replace(/[^0-9]/g, '');
  if (cleanValue === '') return '';
  const number = parseInt(cleanValue, 10);
  return formatNumberByCurrency(number, currency);
};

export const formatDecimalLiveByCurrency = (value: string, currency: Currency): string => {
  if (!value) return '';
  let cleanValue = value.replace(/[^0-9.]/g, '');
  const parts = cleanValue.split('.');
  if (parts.length > 2) cleanValue = parts[0] + '.' + parts.slice(1).join('');
  const number = parseFloat(cleanValue);
  if (isNaN(number)) return '';
  const locale = getLocaleByCurrency(currency);
  return number.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const parseFormattedNumberByCurrency = (value: string, currency: Currency): number => {
  if (!value) return 0;
  const locale = getLocaleByCurrency(currency);
  const isCommaDecimal =
    locale.startsWith('es') || locale.startsWith('de') || locale.startsWith('pt') ||
    locale.startsWith('tr') || locale.startsWith('it') || locale.startsWith('fr');
  let cleanValue = value;
  if (isCommaDecimal) {
    cleanValue = cleanValue.replace(/\./g, '');
    cleanValue = cleanValue.replace(',', '.');
  } else {
    cleanValue = cleanValue.replace(/,/g, '');
  }
  cleanValue = cleanValue.replace(/[^0-9.-]/g, '');
  return parseFloat(cleanValue) || 0;
};

export const formatResult = (value: number, currency: Currency): string =>
  formatNumberByCurrency(value, currency);

// ── Hook useFormattedInput ────────────────────────────────────────────────────
export const useFormattedInput = (initialValue: string, isDecimal = false) => {
  const { currency } = useCurrency();
  const [value, setValue] = useState(initialValue);
  const [rawValue, setRawValue] = useState(() =>
    parseFormattedNumberByCurrency(initialValue, currency)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = isDecimal
      ? formatDecimalLiveByCurrency(inputValue, currency)
      : formatNumberLiveByCurrency(inputValue, currency);
    setValue(formatted);
    setRawValue(parseFormattedNumberByCurrency(formatted, currency));
  };

  useEffect(() => {
    const newFormatted = isDecimal
      ? formatDecimalLiveByCurrency(rawValue.toString(), currency)
      : formatNumberLiveByCurrency(rawValue.toString(), currency);
    setValue(newFormatted);
  }, [currency]);

  return { value, rawValue, handleChange, setValue };
};

// ── Selector global de moneda (componente reutilizable) ───────────────────────
export function CurrencySelector({
  globalCurrency,
  setGlobalCurrency,
  language,
}: {
  globalCurrency: Currency;
  setGlobalCurrency: (c: Currency) => void;
  language: string;
}) {
  return (
    <div className="mb-6 flex justify-end">
      <div className="w-full sm:w-72">
        <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="global-currency">
          {language === 'es' ? 'Moneda' : 'Currency'}
        </label>
        <select
          id="global-currency"
          value={globalCurrency}
          onChange={(e) => setGlobalCurrency(e.target.value as Currency)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100"
        >
          {CURRENCY_GROUPS.map((g) => (
            <optgroup key={g.label} label={g.label} className="text-slate-400">
              {g.codes.map((code) => {
                const m = CURRENCY_MAP[code];
                return (
                  <option key={code} value={code} className="text-slate-100">
                    {m.flag} {code} — {m.name}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'es' ? 'Se aplica a esta calculadora' : 'Applies to this calculator'}
        </p>
      </div>
    </div>
  );
}

// ── FAQ accordion reutilizable ────────────────────────────────────────────────
export function FaqSection({
  faqs,
  language,
}: {
  faqs: { q_es: string; q_en: string; a_es: string; a_en: string }[];
  language: 'es' | 'en';
}) {
  if (!faqs || faqs.length === 0) return null;

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q_es, q_en, a_es, a_en }) => ({
      '@type': 'Question',
      name: language === 'es' ? q_es : q_en,
      acceptedAnswer: { '@type': 'Answer', text: language === 'es' ? a_es : a_en },
    })),
  });

  return (
    <section
      className="mt-10"
      aria-label={language === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <h2 className="text-xl font-bold text-slate-200 mb-5">
        {language === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
      </h2>
      <div className="space-y-4">
        {faqs.map(({ q_es, q_en, a_es, a_en }) => (
          <details
            key={language === 'es' ? q_es : q_en}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 group"
          >
            <summary className="cursor-pointer font-medium text-slate-200 list-none flex justify-between items-center">
              {language === 'es' ? q_es : q_en}
              <span className="text-emerald-400 ml-4 text-lg group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {language === 'es' ? a_es : a_en}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ── Breadcrumb SEO component ──────────────────────────────────────────────────
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  const schemaItems = items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    ...(item.href ? { item: `https://zentic.app${item.href}` } : {}),
  }));

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaItems,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {item.href ? (
                <a href={item.href} className="hover:text-emerald-400 transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-slate-300">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}