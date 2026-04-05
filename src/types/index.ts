export type Currency =
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF'
  | 'MXN' | 'COP' | 'ARS' | 'CLP' | 'PEN'
  | 'CAD' | 'AUD' | 'CNY' | 'BRL' | 'TRY';

export interface CurrencyMeta {
  code: Currency;
  symbol: string;
  name: string;
  nameLong: string;
  flag: string;
  locale: string;
  noDecimals?: boolean;
}

export interface ExchangeRate {
  base: Currency;
  rates: Record<Currency, number>;
  lastUpdate: Date;
}

export interface TaxCalculation {
  gross: number;
  tax: number;
  net: number;
  taxRate: number;
}

export interface CompoundInterestResult {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

// Interfaz para traducciones de noticias
export interface NewsTranslations {
  es: string;
  en: string;
}

export interface NewsItem {
  id: string;
  title: NewsTranslations;    // Ahora es objeto con es/en
  excerpt: NewsTranslations;   // Ahora es objeto con es/en
  category: NewsTranslations;  // Ahora es objeto con es/en
  date: string;
  author: string;
  source: string;
  content: NewsTranslations;   // Ahora es objeto con es/en
  image?: string;
}