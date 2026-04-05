import { CurrencyMeta } from '../types/index.ts';

/**
 * Catálogo centralizado de las 15 divisas soportadas.
 * Cambia aquí los metadatos sin tocar el hook ni el componente.
 */
export const CURRENCIES: CurrencyMeta[] = [
  // ── Big 5 ────────────────────────────────────────────────────────────────
  {
    code: 'USD', symbol: '$',  name: 'US Dollar',
    nameLong: 'Dólar Estadounidense', flag: '🇺🇸', locale: 'en-US',
  },
  {
    code: 'EUR', symbol: '€',  name: 'Euro',
    nameLong: 'Euro',                 flag: '🇪🇺', locale: 'de-DE',
  },
  {
    code: 'GBP', symbol: '£',  name: 'British Pound',
    nameLong: 'Libra Esterlina',      flag: '🇬🇧', locale: 'en-GB',
  },
  {
    code: 'JPY', symbol: '¥',  name: 'Japanese Yen',
    nameLong: 'Yen Japonés',          flag: '🇯🇵', locale: 'ja-JP', noDecimals: true,
  },
  {
    code: 'CHF', symbol: 'Fr', name: 'Swiss Franc',
    nameLong: 'Franco Suizo',         flag: '🇨🇭', locale: 'de-CH',
  },
  // ── Latam ─────────────────────────────────────────────────────────────────
  {
    code: 'MXN', symbol: '$',  name: 'Peso Mexicano',
    nameLong: 'Peso Mexicano',        flag: '🇲🇽', locale: 'es-MX',
  },
  {
    code: 'COP', symbol: '$',  name: 'Peso Colombiano',
    nameLong: 'Peso Colombiano',      flag: '🇨🇴', locale: 'es-CO', noDecimals: true,
  },
  {
    code: 'ARS', symbol: '$',  name: 'Peso Argentino',
    nameLong: 'Peso Argentino',       flag: '🇦🇷', locale: 'es-AR', noDecimals: true,
  },
  {
    code: 'CLP', symbol: '$',  name: 'Peso Chileno',
    nameLong: 'Peso Chileno',         flag: '🇨🇱', locale: 'es-CL', noDecimals: true,
  },
  {
    code: 'PEN', symbol: 'S/', name: 'Sol Peruano',
    nameLong: 'Sol Peruano',          flag: '🇵🇪', locale: 'es-PE',
  },
  // ── Otros ─────────────────────────────────────────────────────────────────
  {
    code: 'CAD', symbol: '$',  name: 'Canadian Dollar',
    nameLong: 'Dólar Canadiense',     flag: '🇨🇦', locale: 'en-CA',
  },
  {
    code: 'AUD', symbol: '$',  name: 'Australian Dollar',
    nameLong: 'Dólar Australiano',    flag: '🇦🇺', locale: 'en-AU',
  },
  {
    code: 'CNY', symbol: '¥',  name: 'Chinese Yuan',
    nameLong: 'Yuan Chino',           flag: '🇨🇳', locale: 'zh-CN',
  },
  {
    code: 'BRL', symbol: 'R$', name: 'Real Brasileño',
    nameLong: 'Real Brasileño',       flag: '🇧🇷', locale: 'pt-BR',
  },
  {
    code: 'TRY', symbol: '₺',  name: 'Lira Turca',
    nameLong: 'Lira Turca',           flag: '🇹🇷', locale: 'tr-TR', noDecimals: true,
  },
];

export const CURRENCY_MAP = Object.fromEntries(
  CURRENCIES.map(c => [c.code, c])
) as Record<import('../types/index.ts').Currency, CurrencyMeta>;