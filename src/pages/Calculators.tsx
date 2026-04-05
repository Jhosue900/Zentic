import { useState, useEffect, createContext, useContext } from 'react';
import { Calculator, DollarSign, TrendingUp, Home, CreditCard, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TaxCalculation } from '../types';
import { SEO } from '../components/SEO';
import { CURRENCY_MAP } from '../data/CurrenciesFile';
import { Currency } from '../types/index';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ─── Tipos locales ─────────────────────────────────────────────────────────────
type TaxOperation = 'add' | 'remove';

// ─── SEO Meta por calculadora (dinámico por idioma) ───────────────────────────
const getSEOMeta = (language: 'es' | 'en') => ({
  tax: {
    title: language === 'es' 
      ? 'Calculadora de IVA 2025 | 40+ Países: España, México, Colombia, Chile, Argentina'
      : 'VAT Calculator 2025 | 40+ Countries: Spain, Mexico, Colombia, Chile, Argentina',
    description: language === 'es'
      ? 'Calcula IVA, GST, VAT o impuesto al consumo al instante. Más de 40 países actualizados 2025. Agrega o quita impuestos con precisión.'
      : 'Calculate VAT, GST, or sales tax instantly. 40+ countries updated 2025. Add or remove taxes with precision.',
  },
  salary: {
    title: language === 'es'
      ? 'Calculadora de Sueldo Neto 2025 | 20+ Países: España, Chile, Colombia, México, Argentina'
      : 'Net Salary Calculator 2025 | 20+ Countries: Spain, Chile, Colombia, Mexico, Argentina',
    description: language === 'es'
      ? 'Calcula tu salario neto después de impuestos y cotizaciones sociales. Incluye IRPF, ISR, seguridad social, AFP, salud y más.'
      : 'Calculate your net salary after taxes and social security contributions. Includes income tax, social security, pension, and health insurance.',
  },
  compound: {
    title: language === 'es'
      ? 'Calculadora de Interés Compuesto 2025 | Simulador de Inversión con Aportes Mensuales'
      : 'Compound Interest Calculator 2025 | Investment Simulator with Monthly Contributions',
    description: language === 'es'
      ? 'Proyecta el crecimiento de tu inversión con interés compuesto. Incluye aportaciones mensuales, tabla anual y gráficas de evolución. Calcular rendimiento de inversión.'
      : 'Project your investment growth with compound interest. Includes monthly contributions, annual table, and evolution charts. Calculate investment returns.',
  },
  loan: {
    title: language === 'es'
      ? 'Calculadora de Capacidad de Préstamo 2025 | ¿Cuánto préstamo puedo pedir?'
      : 'Loan Affordability Calculator 2025 | How much loan can I afford?',
    description: language === 'es'
      ? 'Calcula cuánto préstamo puedes pagar según tus ingresos y gastos. Regla del 30% aplicada automáticamente. Simulador de crédito hipotecario y personal.'
      : 'Calculate how much loan you can afford based on your income and expenses. 30% rule automatically applied. Mortgage and personal loan simulator.',
  },
  debt: {
    title: language === 'es'
      ? 'Calculadora de Pago de Deudas 2025 | ¿Cuándo terminaré de pagar mi deuda?'
      : 'Debt Payoff Calculator 2025 | When will I pay off my debt?',
    description: language === 'es'
      ? 'Descubre en cuántos meses pagarás tu deuda y cuánto pagarás en intereses. Estrategias para reducir el plazo de tu deuda de tarjeta de crédito o préstamo.'
      : 'Discover how many months it will take to pay off your debt and how much interest you will pay. Strategies to reduce your credit card or loan debt term.',
  },
  savings: {
    title: language === 'es'
      ? 'Calculadora de Meta de Ahorro 2025 | ¿Cuánto debo ahorrar al mes para mi meta?'
      : 'Savings Goal Calculator 2025 | How much should I save per month to reach my goal?',
    description: language === 'es'
      ? 'Calcula cuánto necesitas ahorrar mensualmente para alcanzar tu meta financiera. Incluye rendimiento de inversión. Planifica tu jubilación, viaje o compra de casa.'
      : 'Calculate how much you need to save monthly to reach your financial goal. Includes investment returns. Plan your retirement, vacation, or home purchase.',
  },
});

// ─── Países/Regiones para IVA ─────────────────────────────────────────────────
type VatCountry =
  // Latinoamérica
  | 'mexico' | 'colombia' | 'argentina' | 'chile' | 'peru' | 'brazil'
  | 'ecuador' | 'bolivia' | 'paraguay' | 'uruguay' | 'venezuela'
  | 'guatemala' | 'honduras' | 'el_salvador' | 'costa_rica' | 'panama'
  | 'dominican_rep' | 'cuba'
  // Europa
  | 'spain' | 'uk' | 'germany' | 'france' | 'italy' | 'portugal'
  | 'netherlands' | 'belgium' | 'sweden' | 'norway' | 'denmark'
  | 'poland' | 'austria' | 'switzerland' | 'ireland' | 'greece'
  | 'romania' | 'hungary' | 'czech_rep' | 'finland'
  // Asia / Pacífico
  | 'japan' | 'china' | 'south_korea' | 'india' | 'australia'
  | 'new_zealand' | 'singapore' | 'thailand' | 'indonesia' | 'philippines'
  // Medio Oriente / África
  | 'turkey' | 'saudi_arabia' | 'uae' | 'israel' | 'south_africa' | 'egypt'
  // USA por estado
  | 'usa_ca' | 'usa_tx' | 'usa_fl' | 'usa_ny' | 'usa_wa' | 'usa_il'
  | 'usa_pa' | 'usa_oh' | 'usa_ga' | 'usa_nj' | 'usa_tn' | 'usa_none'
  // Canadá por provincia
  | 'ca_on' | 'ca_qc' | 'ca_bc' | 'ca_ab' | 'ca_nb' | 'ca_ns'
  | 'ca_nl' | 'ca_pe' | 'ca_sk' | 'ca_mb';

interface VatCountryMeta {
  label: string;
  rate: number;
  taxName: string;
  flag: string;
  note?: string;
  currency?: Currency;
}

const VAT_COUNTRIES: Record<VatCountry, VatCountryMeta> = {
  // ── Latinoamérica ─────────────────────────────────────────────────────────────
  mexico:         { label: 'México',          rate: 16,     taxName: 'IVA',   flag: '🇲🇽', currency: 'MXN' },
  colombia:       { label: 'Colombia',        rate: 19,     taxName: 'IVA',   flag: '🇨🇴', currency: 'COP' },
  argentina:      { label: 'Argentina',       rate: 21,     taxName: 'IVA',   flag: '🇦🇷', currency: 'ARS', note: 'Tasa general AFIP 2025. Tasa reducida 10.5% para ciertos bienes.' },
  chile:          { label: 'Chile',           rate: 19,     taxName: 'IVA',   flag: '🇨🇱', currency: 'CLP' },
  peru:           { label: 'Perú',            rate: 18,     taxName: 'IGV',   flag: '🇵🇪', currency: 'PEN', note: '16% IGV + 2% IPM' },
  brazil:         { label: 'Brasil',          rate: 17,     taxName: 'ICMS',  flag: '🇧🇷', currency: 'BRL', note: 'ICMS promedio. Varía por estado (12–20%). Nueva reforma tributaria 2025 en implementación gradual.' },
  ecuador:        { label: 'Ecuador',         rate: 15,     taxName: 'IVA',   flag: '🇪🇨', note: 'Subió de 12% a 15% en 2024' },
  bolivia:        { label: 'Bolivia',         rate: 13,     taxName: 'IVA',   flag: '🇧🇴' },
  paraguay:       { label: 'Paraguay',        rate: 10,     taxName: 'IVA',   flag: '🇵🇾', note: 'Tasa general. 5% para productos básicos.' },
  uruguay:        { label: 'Uruguay',         rate: 22,     taxName: 'IVA',   flag: '🇺🇾', note: 'Tasa básica 22%. Tasa mínima 10% para alimentos básicos.' },
  venezuela:      { label: 'Venezuela',       rate: 16,     taxName: 'IVA',   flag: '🇻🇪', note: 'Tasa vigente 2025. Puede variar por decreto.' },
  guatemala:      { label: 'Guatemala',       rate: 12,     taxName: 'IVA',   flag: '🇬🇹' },
  honduras:       { label: 'Honduras',        rate: 15,     taxName: 'ISV',   flag: '🇭🇳' },
  el_salvador:    { label: 'El Salvador',     rate: 13,     taxName: 'IVA',   flag: '🇸🇻' },
  costa_rica:     { label: 'Costa Rica',      rate: 13,     taxName: 'IVA',   flag: '🇨🇷' },
  panama:         { label: 'Panamá',          rate: 7,      taxName: 'ITBMS', flag: '🇵🇦', note: 'Tasa general 7%. 10% para alcohol y hoteles, 15% cigarrillos.' },
  dominican_rep:  { label: 'Rep. Dominicana', rate: 18,     taxName: 'ITBIS', flag: '🇩🇴' },
  cuba:           { label: 'Cuba',            rate: 10,     taxName: 'IVA',   flag: '🇨🇺', note: 'Sistema impositivo especial. Referencial.' },
  // ── Europa ────────────────────────────────────────────────────────────────────
  spain:          { label: 'España',          rate: 21,     taxName: 'IVA',   flag: '🇪🇸', currency: 'EUR', note: 'Tasa general 21%. Reducida 10%, superreducida 4%.' },
  uk:             { label: 'Reino Unido',     rate: 20,     taxName: 'VAT',   flag: '🇬🇧', currency: 'GBP', note: 'Tasa estándar 20%. Reducida 5%. Cero para alimentos básicos.' },
  germany:        { label: 'Alemania',        rate: 19,     taxName: 'MwSt',  flag: '🇩🇪', currency: 'EUR', note: 'Tasa estándar 19%. Reducida 7% para alimentos y libros.' },
  france:         { label: 'Francia',         rate: 20,     taxName: 'TVA',   flag: '🇫🇷', currency: 'EUR', note: 'Tasa normal 20%. Reducidas: 10%, 5.5%, 2.1%.' },
  italy:          { label: 'Italia',          rate: 22,     taxName: 'IVA',   flag: '🇮🇹', currency: 'EUR', note: 'Tasa ordinaria 22%. Reducidas: 10%, 5%, 4%.' },
  portugal:       { label: 'Portugal',        rate: 23,     taxName: 'IVA',   flag: '🇵🇹', currency: 'EUR', note: 'Tasa normal 23%. Reducida 13% y 6%. Azores y Madeira tienen tasas menores.' },
  netherlands:    { label: 'Países Bajos',    rate: 21,     taxName: 'BTW',   flag: '🇳🇱', currency: 'EUR', note: 'Tasa alta 21%. Reducida 9% para alimentos, medicamentos y libros.' },
  belgium:        { label: 'Bélgica',         rate: 21,     taxName: 'TVA',   flag: '🇧🇪', currency: 'EUR', note: 'Tasa normal 21%. Reducidas: 12%, 6%, 0%.' },
  sweden:         { label: 'Suecia',          rate: 25,     taxName: 'Moms',  flag: '🇸🇪', note: 'Tasa estándar 25%. Reducida 12% y 6%.' },
  norway:         { label: 'Noruega',         rate: 25,     taxName: 'MVA',   flag: '🇳🇴', note: 'Tasa general 25%. Reducida 15% (alimentos) y 12% (transporte, hotel).' },
  denmark:        { label: 'Dinamarca',       rate: 25,     taxName: 'Moms',  flag: '🇩🇰', note: 'Tasa única 25%, sin tasas reducidas. Una de las más altas de la UE.' },
  poland:         { label: 'Polonia',         rate: 23,     taxName: 'VAT',   flag: '🇵🇱', note: 'Tasa básica 23%. Reducidas: 8%, 5%.' },
  austria:        { label: 'Austria',         rate: 20,     taxName: 'MwSt',  flag: '🇦🇹', currency: 'EUR', note: 'Tasa normal 20%. Reducida 13% y 10%.' },
  switzerland:    { label: 'Suiza',           rate: 8.1,    taxName: 'MWST',  flag: '🇨🇭', note: 'Tasa normal 8.1% desde 2024. Reducida 2.6% y 3.8% para hotelería.' },
  ireland:        { label: 'Irlanda',         rate: 23,     taxName: 'VAT',   flag: '🇮🇪', currency: 'EUR', note: 'Tasa estándar 23%. Reducidas: 13.5%, 9%, 4.8%.' },
  greece:         { label: 'Grecia',          rate: 24,     taxName: 'ΦΠΑ',   flag: '🇬🇷', currency: 'EUR', note: 'Tasa normal 24%. Reducida 13% y 6%.' },
  romania:        { label: 'Rumanía',         rate: 19,     taxName: 'TVA',   flag: '🇷🇴', note: 'Tasa estándar 19%. Reducida 9% y 5%.' },
  hungary:        { label: 'Hungría',         rate: 27,     taxName: 'ÁFA',   flag: '🇭🇺', note: 'La tasa de IVA más alta de la UE: 27%. Reducidas: 18%, 5%.' },
  czech_rep:      { label: 'Rep. Checa',      rate: 21,     taxName: 'DPH',   flag: '🇨🇿', note: 'Tasa básica 21%. Reducidas: 12%.' },
  finland:        { label: 'Finlandia',       rate: 25.5,   taxName: 'ALV',   flag: '🇫🇮', currency: 'EUR', note: 'Subió de 24% a 25.5% en sep. 2024. Reducidas: 14%, 10%.' },
  // ── Asia / Pacífico ───────────────────────────────────────────────────────────
  japan:          { label: 'Japón',           rate: 10,     taxName: 'JCT',   flag: '🇯🇵', currency: 'JPY', note: 'Consumption Tax 10%. Tasa reducida 8% para alimentos y bebidas.' },
  china:          { label: 'China',           rate: 13,     taxName: 'VAT',   flag: '🇨🇳', currency: 'CNY', note: 'Tasa general 13%. 9% para bienes agrícolas y transporte. 6% para servicios.' },
  south_korea:    { label: 'Corea del Sur',   rate: 10,     taxName: 'VAT',   flag: '🇰🇷', note: 'Tasa única del 10%.' },
  india:          { label: 'India',           rate: 18,     taxName: 'GST',   flag: '🇮🇳', note: 'GST 18% (tasa estándar). Losas: 5%, 12%, 18%, 28%.' },
  australia:      { label: 'Australia',       rate: 10,     taxName: 'GST',   flag: '🇦🇺', note: 'GST tasa única 10%. Los alimentos básicos están exentos.' },
  new_zealand:    { label: 'Nueva Zelanda',   rate: 15,     taxName: 'GST',   flag: '🇳🇿', note: 'GST tasa única 15%.' },
  singapore:      { label: 'Singapur',        rate: 9,      taxName: 'GST',   flag: '🇸🇬', note: 'GST subió a 9% en 2024.' },
  thailand:       { label: 'Tailandia',       rate: 7,      taxName: 'VAT',   flag: '🇹🇭', note: 'Tasa reducida temporal 7% (la estándar es 10%). Vigente hasta 2026.' },
  indonesia:      { label: 'Indonesia',       rate: 11,     taxName: 'PPN',   flag: '🇮🇩', note: 'Subió de 10% a 11% en 2022. Prevista subida a 12% en 2025.' },
  philippines:    { label: 'Filipinas',       rate: 12,     taxName: 'VAT',   flag: '🇵🇭', note: 'Tasa estándar 12%.' },
  // ── Medio Oriente / África ────────────────────────────────────────────────────
  turkey:         { label: 'Turquía',         rate: 20,     taxName: 'KDV',   flag: '🇹🇷', currency: 'TRY', note: 'Subió de 18% a 20% en 2023.' },
  saudi_arabia:   { label: 'Arabia Saudita',  rate: 15,     taxName: 'VAT',   flag: '🇸🇦', note: 'VAT triplicado de 5% a 15% en 2020.' },
  uae:            { label: 'Emiratos Árabes', rate: 5,      taxName: 'VAT',   flag: '🇦🇪', note: 'Introducido en 2018. Tasa única 5%.' },
  israel:         { label: 'Israel',          rate: 18,     taxName: 'VAT',   flag: '🇮🇱', note: 'Subió de 17% a 18% en ene. 2025.' },
  south_africa:   { label: 'Sudáfrica',       rate: 15,     taxName: 'VAT',   flag: '🇿🇦', note: 'VAT subió a 15% en 2018.' },
  egypt:          { label: 'Egipto',          rate: 14,     taxName: 'VAT',   flag: '🇪🇬', note: 'Tasa estándar 14%.' },
  // ── USA por estado ─────────────────────────────────────────────────────────────
  usa_ca:   { label: 'California',   rate: 8.82, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '7.25% estatal + ~1.57% local avg.' },
  usa_tx:   { label: 'Texas',        rate: 8.19, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.25% estatal + ~1.94% local avg.' },
  usa_fl:   { label: 'Florida',      rate: 7.02, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6% estatal + ~1.02% local avg.' },
  usa_ny:   { label: 'New York',     rate: 8.52, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '4% estatal + ~4.52% local (NYC 8.875%)' },
  usa_wa:   { label: 'Washington',   rate: 9.29, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.5% estatal + ~2.79% local avg.' },
  usa_il:   { label: 'Illinois',     rate: 8.85, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.25% estatal + ~2.6% local avg.' },
  usa_pa:   { label: 'Pennsylvania', rate: 6.34, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6% estatal + ~0.34% local avg.' },
  usa_oh:   { label: 'Ohio',         rate: 7.24, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '5.75% estatal + ~1.49% local avg.' },
  usa_ga:   { label: 'Georgia',      rate: 7.38, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '4% estatal + ~3.38% local avg.' },
  usa_nj:   { label: 'New Jersey',   rate: 6.6,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.625% estatal (tasa uniforme)' },
  usa_tn:   { label: 'Tennessee',    rate: 9.55, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '7% estatal + ~2.55% local avg.' },
  usa_none: { label: 'Oregon / Delaware / Montana / NH', rate: 0, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: 'Sin impuesto sobre ventas estatal.' },
  // ── Canadá por provincia ───────────────────────────────────────────────────────
  ca_on: { label: 'Ontario',       rate: 13,     taxName: 'HST',     flag: '🇨🇦', currency: 'CAD', note: 'HST 13% (5% GST + 8% provincial)' },
  ca_qc: { label: 'Quebec',        rate: 14.975, taxName: 'GST+QST', flag: '🇨🇦', currency: 'CAD', note: '5% GST + 9.975% QST' },
  ca_bc: { label: 'Br. Columbia',  rate: 12,     taxName: 'GST+PST', flag: '🇨🇦', currency: 'CAD', note: '5% GST + 7% PST' },
  ca_ab: { label: 'Alberta',       rate: 5,      taxName: 'GST',     flag: '🇨🇦', currency: 'CAD', note: 'Solo 5% GST. Sin impuesto provincial.' },
  ca_nb: { label: 'New Brunswick', rate: 15,     taxName: 'HST',     flag: '🇨🇦', currency: 'CAD', note: 'HST 15% (5% GST + 10% provincial)' },
  ca_ns: { label: 'Nova Scotia',   rate: 14,     taxName: 'HST',     flag: '🇨🇦', currency: 'CAD', note: 'HST 14% desde abril 2025 (5% GST + 9%)' },
  ca_nl: { label: 'Newfoundland',  rate: 15,     taxName: 'HST',     flag: '🇨🇦', currency: 'CAD', note: 'HST 15% (5% GST + 10% provincial)' },
  ca_pe: { label: 'P.E. Island',   rate: 15,     taxName: 'HST',     flag: '🇨🇦', currency: 'CAD', note: 'HST 15% (5% GST + 10% provincial)' },
  ca_sk: { label: 'Saskatchewan',  rate: 11,     taxName: 'GST+PST', flag: '🇨🇦', currency: 'CAD', note: '5% GST + 6% PST' },
  ca_mb: { label: 'Manitoba',      rate: 12,     taxName: 'GST+RST', flag: '🇨🇦', currency: 'CAD', note: '5% GST + 7% RST' },
};

const VAT_GROUPS = [
  { label: '🌎 Latinoamérica — Cono Sur',     keys: ['chile','argentina','uruguay','peru','bolivia','paraguay'] as VatCountry[] },
  { label: '🌎 Latinoamérica — Andina/Caribe', keys: ['colombia','venezuela','ecuador','dominican_rep','cuba'] as VatCountry[] },
  { label: '🌎 Latinoamérica — México y CA',  keys: ['mexico','guatemala','honduras','el_salvador','costa_rica','panama'] as VatCountry[] },
  { label: '🇧🇷 Brasil',                       keys: ['brazil'] as VatCountry[] },
  { label: '🇪🇺 Europa — Zona Euro',           keys: ['spain','germany','france','italy','portugal','netherlands','belgium','austria','ireland','greece','finland'] as VatCountry[] },
  { label: '🇪🇺 Europa — Fuera del Euro',      keys: ['uk','sweden','norway','denmark','poland','switzerland','romania','hungary','czech_rep'] as VatCountry[] },
  { label: '🌏 Asia / Pacífico',               keys: ['japan','china','south_korea','india','australia','new_zealand','singapore','thailand','indonesia','philippines'] as VatCountry[] },
  { label: '🌍 Medio Oriente / África',        keys: ['turkey','saudi_arabia','uae','israel','south_africa','egypt'] as VatCountry[] },
  { label: '🇺🇸 USA — por estado',             keys: ['usa_ca','usa_tx','usa_fl','usa_ny','usa_wa','usa_il','usa_pa','usa_oh','usa_ga','usa_nj','usa_tn','usa_none'] as VatCountry[] },
  { label: '🇨🇦 Canadá — por provincia',       keys: ['ca_on','ca_qc','ca_bc','ca_ab','ca_nb','ca_ns','ca_nl','ca_pe','ca_sk','ca_mb'] as VatCountry[] },
];

// ─── Países para Salario Neto (COMENZADO - se usará en futura versión) ─────────────────────────────────
// type SalaryCountry = ... (por implementar)
// const SALARY_COUNTRIES = ... (por implementar)
// const SALARY_GROUPS = ... (por implementar)

// ─── Grupos de moneda ─────────────────────────────────────────────────────────
const CURRENCY_GROUPS = [
  { label: 'Big 5 — Mercados globales', codes: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'] as Currency[] },
  { label: 'Latinoamérica',             codes: ['MXN', 'COP', 'ARS', 'CLP', 'PEN'] as Currency[] },
  { label: 'Turismo y comercio',        codes: ['CAD', 'AUD', 'CNY', 'BRL', 'TRY'] as Currency[] },
];

// ─── Helpers de formato ───────────────────────────────────────────────────────
const getLocaleByCurrency = (currency: Currency): string =>
  CURRENCY_MAP[currency]?.locale ?? 'en-US';

const formatNumberByCurrency = (value: number, currency: Currency): string => {
  if (isNaN(value)) return '0';
  const meta = CURRENCY_MAP[currency];
  const locale = meta?.locale ?? 'en-US';
  return value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: meta?.noDecimals ? 0 : 2,
  });
};

const formatNumberLiveByCurrency = (value: string, currency: Currency): string => {
  if (!value) return '';
  const cleanValue = value.replace(/[^0-9]/g, '');
  if (cleanValue === '') return '';
  const number = parseInt(cleanValue, 10);
  return formatNumberByCurrency(number, currency);
};

const formatDecimalLiveByCurrency = (value: string, currency: Currency): string => {
  if (!value) return '';
  let cleanValue = value.replace(/[^0-9.]/g, '');
  const parts = cleanValue.split('.');
  if (parts.length > 2) cleanValue = parts[0] + '.' + parts.slice(1).join('');
  const number = parseFloat(cleanValue);
  if (isNaN(number)) return '';
  const locale = getLocaleByCurrency(currency);
  return number.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const parseFormattedNumberByCurrency = (value: string, currency: Currency): number => {
  if (!value) return 0;
  const locale = getLocaleByCurrency(currency);
  const isCommaDecimal = locale.startsWith('es') || locale.startsWith('de') || locale.startsWith('pt') || locale.startsWith('tr') || locale.startsWith('it') || locale.startsWith('fr');
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

const formatResult = (value: number, currency: Currency): string =>
  formatNumberByCurrency(value, currency);

// ─── Context para moneda global ───────────────────────────────────────────────
const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (c: Currency) => void;
  symbol: string;
}>({ currency: 'USD', setCurrency: () => {}, symbol: '$' });

export const useCurrency = () => useContext(CurrencyContext);

// ─── Hook para input con formato en vivo ──────────────────────────────────────
const useFormattedInput = (initialValue: string, isDecimal: boolean = false) => {
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

// ─── Calculators (componente raíz) ────────────────────────────────────────────
export function Calculators() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tax' | 'salary' | 'compound' | 'loan' | 'debt' | 'savings'>('compound');
  const [globalCurrency, setGlobalCurrency] = useState<Currency>('COP');
  const meta = CURRENCY_MAP[globalCurrency];
  
  // Obtener SEO dinámico según el idioma actual
  const seoMeta = getSEOMeta(language as 'es' | 'en');
  const currentSEO = seoMeta[activeTab] || seoMeta.compound;

  // Schema.org SoftwareApplication JSON-LD
  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: currentSEO.title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: currentSEO.description,
    inLanguage: language === 'es' ? 'es' : 'en',
  });

  // Hreflang tags
  const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <CurrencyContext.Provider value={{ currency: globalCurrency, setCurrency: setGlobalCurrency, symbol: meta?.symbol ?? '$' }}>
      <>
        <SEO
          title={currentSEO.title}
          description={currentSEO.description}
          type="SoftwareApplication"
        />

        {/* JSON-LD Schema.org con idioma */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJsonLd }}
        />

        {/* Hreflang tags para SEO internacional */}
        {typeof window !== 'undefined' && (
          <>
            <link rel="alternate" hrefLang="es" href={`${baseUrl}${currentUrl}?lang=es`} />
            <link rel="alternate" hrefLang="en" href={`${baseUrl}${currentUrl}?lang=en`} />
            <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${currentUrl}`} />
          </>
        )}

        <article
          className="max-w-6xl mx-auto px-4 sm:px-6"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
        >
          {/* ── H1 con keyword principal ── */}
          <header className="mb-8 text-center sm:text-left">
            <h1
              className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2"
              itemProp="name"
            >
              {t('calculators.title')}
            </h1>
            <p className="text-slate-400" itemProp="description">
              {language === 'es' 
                ? 'Calculadoras de IVA, interés compuesto, préstamos y metas de ahorro — actualizadas 2025'
                : 'VAT, compound interest, loan, and savings goal calculators — updated 2025'}
            </p>
          </header>

          {/* ── Selector global de moneda ── */}
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
                aria-label={language === 'es' ? 'Seleccionar moneda global' : 'Select global currency'}
              >
                {CURRENCY_GROUPS.map(g => (
                  <optgroup key={g.label} label={g.label} className="text-slate-400">
                    {g.codes.map(code => {
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
                {language === 'es' ? 'Se aplica a todas las calculadoras' : 'Applies to all calculators'}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
            <nav className="flex flex-wrap border-b border-slate-800" role="tablist" aria-label={language === 'es' ? 'Calculadoras financieras' : 'Financial calculators'}>
              {(
                [
                  { key: 'tax',      icon: <Calculator className="w-4 h-4 inline mr-2" />, label: language === 'es' ? 'IVA' : 'VAT',                 ariaLabel: language === 'es' ? 'Calculadora de IVA' : 'VAT Calculator' },
                  { key: 'compound', icon: <TrendingUp className="w-4 h-4 inline mr-2" />, label: language === 'es' ? 'Inversión' : 'Investment',      ariaLabel: language === 'es' ? 'Calculadora de interés compuesto' : 'Compound Interest Calculator' },
                  { key: 'loan',     icon: <Home className="w-4 h-4 inline mr-2" />,       label: language === 'es' ? 'Capacidad Préstamo' : 'Loan Affordability', ariaLabel: language === 'es' ? 'Calculadora de capacidad de préstamo' : 'Loan Affordability Calculator' },
                  { key: 'debt',     icon: <CreditCard className="w-4 h-4 inline mr-2" />, label: language === 'es' ? 'Pago Deudas' : 'Debt Payoff',     ariaLabel: language === 'es' ? 'Calculadora de pago de deudas' : 'Debt Payoff Calculator' },
                  { key: 'savings',  icon: <Target className="w-4 h-4 inline mr-2" />,     label: language === 'es' ? 'Meta Ahorro' : 'Savings Goal',     ariaLabel: language === 'es' ? 'Calculadora de meta de ahorro' : 'Savings Goal Calculator' },
                ] as const
              ).map(({ key, icon, label, ariaLabel }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  aria-label={ariaLabel}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 px-4 py-4 text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                    activeTab === key
                      ? 'bg-emerald-950/40 text-emerald-400 border-b-2 border-emerald-400'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  {icon}{label}
                </button>
              ))}
            </nav>

            <div className="p-6 sm:p-8" role="tabpanel">
              {activeTab === 'tax'      && <TaxCalculator />}
              {activeTab === 'compound' && <CompoundInterestCalculatorAdvanced />}
              {activeTab === 'loan'     && <LoanAffordabilityCalculator />}
              {activeTab === 'debt'     && <DebtPayoffCalculator />}
              {activeTab === 'savings'  && <SavingsGoalCalculator />}
            </div>
          </div>

          {/* ── FAQ Section — SEO rich snippets ── */}
          <FaqSection activeTab={activeTab} language={language as 'es' | 'en'} />
        </article>
      </>
    </CurrencyContext.Provider>
  );
}

// ─── FAQ Section para SEO (FAQPage schema) ───────────────────────────────────
const FAQ_DATA: Record<string, { q_es: string; q_en: string; a_es: string; a_en: string }[]> = {
  tax: [
    { q_es: '¿Cuál es el IVA en México 2025?', q_en: 'What is the VAT in Mexico 2025?', a_es: 'El IVA en México es del 16% como tasa general. En zonas fronterizas aplica una tasa reducida del 8%.', a_en: 'The VAT in Mexico is 16% as a general rate. Border zones have a reduced rate of 8%.' },
    { q_es: '¿Cómo se calcula el IVA?', q_en: 'How to calculate VAT?', a_es: 'Para agregar IVA: multiplica el precio base por (1 + tasa). Ejemplo con 19%: $100 × 1.19 = $119. Para quitar IVA incluido: divide el total entre (1 + tasa). Ejemplo: $119 ÷ 1.19 = $100.', a_en: 'To add VAT: multiply the base price by (1 + rate). Example with 19%: $100 × 1.19 = $119. To remove VAT: divide the total by (1 + rate). Example: $119 ÷ 1.19 = $100.' },
    { q_es: '¿Cuánto es el IVA en Chile?', q_en: 'What is the VAT in Chile?', a_es: 'El IVA en Chile es del 19%, conocido como impuesto al valor agregado. Se aplica sobre la mayoría de bienes y servicios.', a_en: 'The VAT in Chile is 19%, known as value-added tax. It applies to most goods and services.' },
    { q_es: '¿Cuál es el IVA en Colombia 2025?', q_en: 'What is the VAT in Colombia 2025?', a_es: 'En Colombia el IVA general es del 19%. Algunos productos tienen tarifas del 5% o 0%.', a_en: 'In Colombia, the general VAT is 19%. Some products have rates of 5% or 0%.' },
  ],
  salary: [],
  compound: [
    { q_es: '¿Qué es el interés compuesto?', q_en: 'What is compound interest?', a_es: 'El interés compuesto es el proceso por el cual los intereses generados se reinvierten y generan a su vez más intereses. Albert Einstein lo llamó "la octava maravilla del mundo".', a_en: 'Compound interest is the process by which generated interest is reinvested and generates more interest. Albert Einstein called it "the eighth wonder of the world".' },
    { q_es: '¿Cuánto rinde invertir $10,000 en 10 años?', q_en: 'How much does investing $10,000 yield in 10 years?', a_es: 'Depende del rendimiento anual. Con un 8% anual y sin aportaciones adicionales, $10,000 se convierten en aproximadamente $21,589 en 10 años gracias al interés compuesto.', a_en: 'It depends on the annual return. With 8% annual return and no additional contributions, $10,000 becomes approximately $21,589 in 10 years thanks to compound interest.' },
  ],
  loan: [],
  debt: [],
  savings: [],
};

function FaqSection({ activeTab, language }: { activeTab: string; language: 'es' | 'en' }) {
  const faqs = FAQ_DATA[activeTab];
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
    <section className="mt-10" aria-label={language === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      <h2 className="text-xl font-bold text-slate-200 mb-5">{language === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}</h2>
      <div className="space-y-4">
        {faqs.map(({ q_es, q_en, a_es, a_en }) => (
          <details key={language === 'es' ? q_es : q_en} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 group">
            <summary className="cursor-pointer font-medium text-slate-200 list-none flex justify-between items-center">
              {language === 'es' ? q_es : q_en}
              <span className="text-emerald-400 ml-4 text-lg group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">{language === 'es' ? a_es : a_en}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── TaxCalculator (IVA) ──────────────────────────────────────────────────────
function TaxCalculator() {
  const { symbol, currency, setCurrency } = useCurrency();
  const { language } = useLanguage();
  const [country, setCountry] = useState<VatCountry>('colombia');
  const { value: amountValue, rawValue: amount, handleChange: setAmount } = useFormattedInput('0', false);
  const [operation, setOperation] = useState<TaxOperation>('add');
  const [result, setResult] = useState<TaxCalculation | null>(null);
  const countryMeta = VAT_COUNTRIES[country];

  const handleCountryChange = (key: VatCountry) => {
    setCountry(key);
    setResult(null);
    const linked = VAT_COUNTRIES[key].currency;
    if (linked) setCurrency(linked);
  };

  const calculate = () => {
    const value = amount;
    const rate = countryMeta.rate;
    if (rate === 0) {
      setResult({ gross: value, tax: 0, net: value, taxRate: 0 });
      return;
    }
    if (operation === 'add') {
      const tax = value * (rate / 100);
      setResult({ gross: value, tax, net: value + tax, taxRate: rate });
    } else {
      const gross = value / (1 + rate / 100);
      const tax = value - gross;
      setResult({ gross, tax, net: value, taxRate: rate });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="sr-only">Calculadora de IVA por país — {countryMeta.label}</h2>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <label htmlFor="vat-country" className="block text-sm font-medium text-slate-300 mb-2">
            {language === 'es' ? 'País / Provincia / Estado' : 'Country / Province / State'}
          </label>
          <select
            id="vat-country"
            value={country}
            onChange={(e) => handleCountryChange(e.target.value as VatCountry)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100"
            aria-label={language === 'es' ? 'Seleccionar país para calcular IVA' : 'Select country to calculate VAT'}
          >
            {VAT_GROUPS.map(g => (
              <optgroup key={g.label} label={g.label} className="text-slate-400">
                {g.keys.map(key => {
                  const m = VAT_COUNTRIES[key];
                  return (
                    <option key={key} value={key} className="text-slate-100">
                      {m.flag} {m.label} — {m.rate}% {m.taxName}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
              {countryMeta.flag} {countryMeta.rate}% {countryMeta.taxName}
            </span>
            {countryMeta.note && (
              <span className="text-xs text-slate-500 italic">{countryMeta.note}</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="vat-amount" className="block text-sm font-medium text-slate-300 mb-2">
            {language === 'es' ? 'Monto' : 'Amount'} ({countryMeta.taxName === 'Sales Tax' || countryMeta.taxName === 'HST' || countryMeta.taxName === 'GST' ? (language === 'es' ? 'en moneda local' : 'in local currency') : (language === 'es' ? 'sin/con ' + countryMeta.taxName : 'without/with ' + countryMeta.taxName)})
          </label>
          <input
            id="vat-amount"
            type="text"
            inputMode="numeric"
            value={amountValue}
            onChange={setAmount}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono text-lg"
            placeholder="100"
            aria-label={language === 'es' ? 'Monto a calcular' : 'Amount to calculate'}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6" role="group" aria-label={language === 'es' ? 'Tipo de operación de IVA' : 'VAT operation type'}>
        <button
          onClick={() => setOperation('add')}
          aria-pressed={operation === 'add'}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            operation === 'add'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          + {language === 'es' ? 'Agregar' : 'Add'} {countryMeta.taxName}
        </button>
        <button
          onClick={() => setOperation('remove')}
          aria-pressed={operation === 'remove'}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            operation === 'remove'
              ? 'bg-emerald-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          − {language === 'es' ? 'Quitar' : 'Remove'} {countryMeta.taxName}
        </button>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-500 transition-all shadow-md mb-6"
        aria-label={`${language === 'es' ? 'Calcular' : 'Calculate'} ${countryMeta.taxName} ${language === 'es' ? 'para' : 'for'} ${countryMeta.label}`}
      >
        {language === 'es' ? 'Calcular' : 'Calculate'} {countryMeta.taxName}
      </button>

      {result && (
        <div
          className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-6 border border-emerald-800/50"
          aria-live="polite"
          aria-label={language === 'es' ? 'Resultado del cálculo de IVA' : 'VAT calculation result'}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <div className="text-sm text-slate-400 mb-1">{language === 'es' ? 'Base Imponible' : 'Taxable Base'}</div>
              <div className="text-2xl font-bold text-slate-100">{symbol}{formatResult(result.gross, currency)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">{countryMeta.taxName} ({result.taxRate}%)</div>
              <div className="text-2xl font-bold text-emerald-400">{symbol}{formatResult(result.tax, currency)}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">{language === 'es' ? 'Total con' : 'Total with'} {countryMeta.taxName}</div>
              <div className="text-2xl font-bold text-slate-100">{symbol}{formatResult(result.net, currency)}</div>
            </div>
          </div>
          {result.taxRate === 0 && (
            <p className="text-xs text-slate-500 mt-4 border-t border-slate-700 pt-3">
              {language === 'es' 
                ? 'Esta región no aplica impuesto sobre ventas estatal. Pueden existir impuestos locales adicionales.'
                : 'This region does not apply state sales tax. Additional local taxes may apply.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Compound Interest Calculator ─────────────────────────────────────────────
type ContributionTiming = 'beginning' | 'end';

function CompoundInterestCalculatorAdvanced() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: initialValue, rawValue: initialAmount, handleChange: setInitialAmount } = useFormattedInput('0', false);
  const { value: monthlyValue, rawValue: monthlyAdd,    handleChange: setMonthlyAdd    } = useFormattedInput('0', false);
  const { value: rateValue,    rawValue: rate,          handleChange: setRate          } = useFormattedInput('0', true);
  const { value: yearsValue,   rawValue: years,         handleChange: setYears         } = useFormattedInput('0', false);
  const [contributionTiming, setContributionTiming] = useState<ContributionTiming>('end');
  const [chartData, setChartData] = useState<Array<{ year: number; invertido: number; ganancias: number; total: number }>>([]);
  const [annualTable, setAnnualTable] = useState<Array<{ year: number; aportado: number; intereses: number; total: number }>>([]);
  const [result, setResult] = useState<{ finalAmount: number; totalInvested: number; totalInterest: number } | null>(null);

  useEffect(() => { calculateCompound(); }, [initialAmount, monthlyAdd, rate, years, contributionTiming]);

  const calculateCompound = () => {
    const P = initialAmount;
    const PMT = monthlyAdd;
    const annualRate = rate / 100;
    const yearsCount = years;
    const monthlyRate = annualRate / 12;
    const totalMonths = yearsCount * 12;
    const fvPrincipal = P * Math.pow(1 + monthlyRate, totalMonths);
    let fvContributions = 0;
    if (monthlyRate > 0 && PMT > 0) {
      const annuityFactor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      fvContributions = PMT * annuityFactor;
      if (contributionTiming === 'beginning') fvContributions *= (1 + monthlyRate);
    } else if (PMT > 0) {
      fvContributions = PMT * totalMonths;
    }
    const finalAmount = fvPrincipal + fvContributions;
    const totalInvested = P + (PMT * totalMonths);
    const totalInterest = finalAmount - totalInvested;
    const yearlyData = [];
    const yearlyTable = [];
    for (let year = 1; year <= yearsCount; year++) {
      const monthsSoFar = year * 12;
      const yearFvPrincipal = P * Math.pow(1 + monthlyRate, monthsSoFar);
      let yearFvContributions = 0;
      if (monthlyRate > 0 && PMT > 0) {
        const af = (Math.pow(1 + monthlyRate, monthsSoFar) - 1) / monthlyRate;
        yearFvContributions = PMT * af;
        if (contributionTiming === 'beginning') yearFvContributions *= (1 + monthlyRate);
      } else if (PMT > 0) {
        yearFvContributions = PMT * monthsSoFar;
      }
      const yearTotal = yearFvPrincipal + yearFvContributions;
      const yearInvested = P + (PMT * monthsSoFar);
      yearlyData.push({ year, invertido: yearInvested, ganancias: Math.max(0, yearTotal - yearInvested), total: yearTotal });
      yearlyTable.push({ year, aportado: yearInvested, intereses: Math.max(0, yearTotal - yearInvested), total: yearTotal });
    }
    setChartData(yearlyData);
    setAnnualTable(yearlyTable);
    setResult({ finalAmount, totalInvested, totalInterest });
  };

  const tooltipFormatter = (value: any): [string, string] => {
    if (value == null) return ['', ''];
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return [`${symbol}${formatResult(num, currency)}`, ''];
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="sr-only">{language === 'es' ? 'Calculadora de interés compuesto con aportaciones mensuales' : 'Compound interest calculator with monthly contributions'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="ci-initial" className="block text-sm font-medium text-slate-300 mb-2">{language === 'es' ? 'Monto Inicial' : 'Initial Amount'}</label>
          <input id="ci-initial" type="text" inputMode="numeric" value={initialValue} onChange={setInitialAmount} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono" placeholder="10.000" />
        </div>
        <div>
          <label htmlFor="ci-monthly" className="block text-sm font-medium text-slate-300 mb-2">{language === 'es' ? 'Aportación Mensual' : 'Monthly Contribution'}</label>
          <input id="ci-monthly" type="text" inputMode="numeric" value={monthlyValue} onChange={setMonthlyAdd} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono" placeholder="500" />
        </div>
        <div>
          <label htmlFor="ci-rate" className="block text-sm font-medium text-slate-300 mb-2">{language === 'es' ? 'Rendimiento Anual (%)' : 'Annual Return (%)'}</label>
          <input id="ci-rate" type="text" inputMode="decimal" value={rateValue} onChange={setRate} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono" placeholder="8" />
          <p className="text-xs text-slate-500 mt-1">{language === 'es' ? 'Promedio histórico del mercado: ~7–10% anual' : 'Historical market average: ~7–10% annually'}</p>
        </div>
        <div>
          <label htmlFor="ci-years" className="block text-sm font-medium text-slate-300 mb-2">{language === 'es' ? 'Años de inversión' : 'Investment Years'}</label>
          <input id="ci-years" type="text" inputMode="numeric" value={yearsValue} onChange={setYears} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono" placeholder="10" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-3">{language === 'es' ? 'Momento de la aportación mensual' : 'Monthly contribution timing'}</label>
          <div className="relative flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-6px)] rounded-lg bg-emerald-500 shadow-lg shadow-emerald-900/50 transition-transform duration-200 ease-in-out ${contributionTiming === 'end' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} />
            <button onClick={() => setContributionTiming('beginning')} className={`relative z-10 flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${contributionTiming === 'beginning' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {language === 'es' ? 'Al inicio del mes' : 'At month start'}
            </button>
            <button onClick={() => setContributionTiming('end')} className={`relative z-10 flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${contributionTiming === 'end' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {language === 'es' ? 'Al final del mes' : 'At month end'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {contributionTiming === 'beginning'
              ? (language === 'es' ? 'Anualidad anticipada: cada aporte genera interés desde el primer día del mes.' : 'Annuity due: each contribution earns interest from the first day of the month.')
              : (language === 'es' ? 'Anualidad vencida: modelo estándar. Cada aporte entra al final del mes.' : 'Ordinary annuity: standard model. Each contribution is made at month end.')}
          </p>
        </div>
      </div>

      {result && chartData.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: language === 'es' ? 'Valor Final' : 'Final Value', value: result.finalAmount, color: 'text-emerald-400' },
              { label: language === 'es' ? 'Total Aportado' : 'Total Contributed', value: result.totalInvested, color: 'text-slate-100' },
              { label: language === 'es' ? 'Intereses Generados' : 'Interest Earned', value: result.totalInterest, color: 'text-emerald-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
                <div className="text-xs text-slate-400 mb-1">{label}</div>
                <div className={`text-2xl font-bold ${color}`}>{symbol}{formatResult(value, currency)}</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700 mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">{language === 'es' ? 'Evolución de la inversión' : 'Investment Evolution'}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="colorInvertido" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#64748b" label={{ value: language === 'es' ? 'Años' : 'Years', position: 'bottom', fill: '#64748b' }} />
                <YAxis stroke="#64748b" tickFormatter={(v: number) => `${symbol}${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={tooltipFormatter}
                  labelFormatter={(label: any) => `${language === 'es' ? 'Año' : 'Year'} ${label}`}
                />
                <Legend />
                <Area type="monotone" dataKey="invertido" name={language === 'es' ? 'Total Aportado' : 'Total Contributed'} stroke="#3b82f6" fill="url(#colorInvertido)" strokeWidth={2} />
                <Area type="monotone" dataKey="total" name={language === 'es' ? 'Valor Total' : 'Total Value'} stroke="#10b981" fill="url(#colorTotal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700 mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">{language === 'es' ? 'Proyección año por año' : 'Year by Year Projection'}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label={language === 'es' ? 'Tabla de proyección de inversión anual' : 'Annual investment projection table'}>
                <thead>
                  <tr className="border-b border-slate-700">
                    <th scope="col" className="text-left py-3 px-4 text-slate-400">{language === 'es' ? 'Año' : 'Year'}</th>
                    <th scope="col" className="text-right py-3 px-4 text-slate-400">{language === 'es' ? 'Total Aportado' : 'Total Contributed'}</th>
                    <th scope="col" className="text-right py-3 px-4 text-slate-400">{language === 'es' ? 'Intereses' : 'Interest'}</th>
                    <th scope="col" className="text-right py-3 px-4 text-slate-400">{language === 'es' ? 'Valor Total' : 'Total Value'}</th>
                  </tr>
                </thead>
                <tbody>
                  {annualTable.map((row) => (
                    <tr key={row.year} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-200">{row.year}</td>
                      <td className="py-3 px-4 text-right text-slate-300">{symbol}{formatResult(row.aportado, currency)}</td>
                      <td className="py-3 px-4 text-right text-emerald-400">{symbol}{formatResult(row.intereses, currency)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-100">{symbol}{formatResult(row.total, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">{language === 'es' ? 'Distribución final de la inversión' : 'Final Investment Distribution'}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: language === 'es' ? 'Total Aportado' : 'Total Contributed', value: result.totalInvested },
                    { name: language === 'es' ? 'Intereses' : 'Interest', value: result.totalInterest },
                  ]}
                  cx="50%" cy="50%" labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80} dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  formatter={tooltipFormatter}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// CALCULADORA DE SALARIO NETO - COMENTADA (deshabilitada temporalmente)
// =============================================================================
// La funcionalidad de cálculo de salario neto ha sido deshabilitada temporalmente
// para futuras mejoras y actualización de tasas impositivas por país.
//
// Para habilitarla nuevamente:
// 1. Descomentar el componente SalaryCalculatorAdvanced
// 2. Descomentar la línea en el array de tabs (arriba)
// 3. Descomentar la condición en el renderizado del tabpanel
//
// =============================================================================
//
// function SalaryCalculatorAdvanced() {
//   // ... código de la calculadora de salario neto ...
// }
//
// =============================================================================

// ─── LoanAffordabilityCalculator ──────────────────────────────────────────────
function LoanAffordabilityCalculator() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: incomeValue,   rawValue: monthlyIncome,   handleChange: setMonthlyIncome   } = useFormattedInput('0', false);
  const { value: expensesValue, rawValue: monthlyExpenses, handleChange: setMonthlyExpenses } = useFormattedInput('0', false);
  const { value: loanValue,     rawValue: loanAmount,      handleChange: setLoanAmount      } = useFormattedInput('0', false);
  const { value: rateValue,     rawValue: interestRate,    handleChange: setInterestRate    } = useFormattedInput('0', true);
  const { value: termValue,     rawValue: loanTerm,        handleChange: setLoanTerm        } = useFormattedInput('0', false);
  const [result, setResult] = useState<{ monthlyPayment: number; maxAffordable: number; canAfford: boolean; disposableIncome: number; recommendation: string } | null>(null);

  useEffect(() => { calculate(); }, [monthlyIncome, monthlyExpenses, loanAmount, interestRate, loanTerm]);

  const calculate = () => {
    const income = monthlyIncome;
    const expenses = monthlyExpenses;
    const loan = loanAmount;
    const annualRate = interestRate / 100;
    const years = loanTerm;
    const disposableIncome = income - expenses;
    const monthlyRate = annualRate / 12;
    const months = years * 12;
    const monthlyPayment = loan * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const maxMonthlyPayment = disposableIncome * 0.3;
    const maxAffordable = maxMonthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));
    const canAfford = monthlyPayment <= maxMonthlyPayment;
    const recommendation = !canAfford
      ? (language === 'es' 
        ? `La cuota mensual (${symbol}${formatResult(monthlyPayment, currency)}) excede el 30% de tu capacidad de pago (${symbol}${formatResult(maxMonthlyPayment, currency)}). Te recomendamos reducir el monto a ${symbol}${formatResult(maxAffordable, currency)}.`
        : `The monthly payment (${symbol}${formatResult(monthlyPayment, currency)}) exceeds 30% of your payment capacity (${symbol}${formatResult(maxMonthlyPayment, currency)}). We recommend reducing the amount to ${symbol}${formatResult(maxAffordable, currency)}.`)
      : (language === 'es'
        ? `Puedes pagar este préstamo cómodamente. La cuota representa ${((monthlyPayment / disposableIncome) * 100).toFixed(1)}% de tu capacidad de pago.`
        : `You can comfortably afford this loan. The payment represents ${((monthlyPayment / disposableIncome) * 100).toFixed(1)}% of your payment capacity.`);
    setResult({ monthlyPayment, maxAffordable, canAfford, disposableIncome, recommendation });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="sr-only">{language === 'es' ? 'Calculadora de capacidad de préstamo' : 'Loan Affordability Calculator'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {[
          { id: 'loan-income',   label: language === 'es' ? 'Ingreso Mensual Neto' : 'Monthly Net Income',        value: incomeValue,   onChange: setMonthlyIncome,   placeholder: '3.000' },
          { id: 'loan-expenses', label: language === 'es' ? 'Gastos Mensuales Fijos' : 'Fixed Monthly Expenses', value: expensesValue, onChange: setMonthlyExpenses, placeholder: '1.000' },
          { id: 'loan-amount',   label: language === 'es' ? 'Monto del Préstamo' : 'Loan Amount',                value: loanValue,     onChange: setLoanAmount,      placeholder: '50.000' },
          { id: 'loan-rate',     label: language === 'es' ? 'Tasa de Interés Anual (%)' : 'Annual Interest Rate (%)', value: rateValue,     onChange: setInterestRate,    placeholder: '12' },
          { id: 'loan-term',     label: language === 'es' ? 'Plazo (años)' : 'Term (years)',                     value: termValue,     onChange: setLoanTerm,        placeholder: '5' },
        ].map(({ id, label, value, onChange, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <input id={id} type="text" inputMode="numeric" value={value} onChange={onChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono"
              placeholder={placeholder} />
          </div>
        ))}
      </div>
      {result && (
        <div className="space-y-4" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Cuota Mensual' : 'Monthly Payment'}</div>
              <div className="text-2xl font-bold text-emerald-400">{symbol}{formatResult(result.monthlyPayment, currency)}</div>
            </div>
            <div className={`bg-gradient-to-br rounded-xl p-4 border text-center ${result.canAfford ? 'from-emerald-950/40 border-emerald-800/50' : 'from-rose-950/40 border-rose-800/50'}`}>
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Límite 30% ingresos disponibles' : '30% of disposable income limit'}</div>
              <div className={`text-2xl font-bold ${result.canAfford ? 'text-emerald-400' : 'text-rose-400'}`}>
                {symbol}{formatResult(result.disposableIncome * 0.3, currency)}
              </div>
            </div>
          </div>
          <div className={`rounded-xl p-5 border ${result.canAfford ? 'bg-emerald-950/40 border-emerald-800/50' : 'bg-amber-950/40 border-amber-800/50'}`}>
            <h3 className="text-sm font-semibold mb-3 text-slate-200">{language === 'es' ? 'Recomendación' : 'Recommendation'}</h3>
            <p className="text-sm text-slate-300">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DebtPayoffCalculator ─────────────────────────────────────────────────────
function DebtPayoffCalculator() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: debtValue,    rawValue: debtAmount,     handleChange: setDebtAmount     } = useFormattedInput('0', false);
  const { value: rateValue,    rawValue: interestRate,   handleChange: setInterestRate   } = useFormattedInput('0', true);
  const { value: paymentValue, rawValue: monthlyPayment, handleChange: setMonthlyPayment } = useFormattedInput('0', false);
  const [result, setResult] = useState<{ monthsToPay: number; totalInterest: number; totalPaid: number; payoffDate: string; strategy: string } | null>(null);

  useEffect(() => { calculate(); }, [debtAmount, interestRate, monthlyPayment]);

  const calculate = () => {
    const debt = debtAmount;
    const annualRate = interestRate / 100;
    const monthly = monthlyPayment;
    const monthlyRate = annualRate / 12;
    let balance = debt;
    let months = 0;
    let totalInterest = 0;
    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      let principalPayment = monthly - interest;
      if (principalPayment <= 0) {
        setResult({ monthsToPay: Infinity, totalInterest: 0, totalPaid: 0, payoffDate: 'Nunca',
          strategy: language === 'es'
            ? `Tu pago mensual no cubre los intereses. Necesitas pagar al menos ${symbol}${formatResult(balance * monthlyRate + 1, currency)} mensuales.`
            : `Your monthly payment does not cover the interest. You need to pay at least ${symbol}${formatResult(balance * monthlyRate + 1, currency)} monthly.` });
        return;
      }
      if (principalPayment > balance) principalPayment = balance;
      balance -= principalPayment;
      months++;
    }
    const totalPaid = debt + totalInterest;
    const today = new Date();
    const payoffDate = new Date(today.setMonth(today.getMonth() + months));
    let strategy = '';
    if (months <= 12) {
      strategy = language === 'es' ? 'Pagarás tu deuda en menos de un año. ¡Excelente plan!' : 'You will pay off your debt in less than a year. Excellent plan!';
    } else if (months <= 24) {
      strategy = language === 'es' ? 'Buen plan. Considera aumentar tus pagos mensuales para ahorrar en intereses.' : 'Good plan. Consider increasing your monthly payments to save on interest.';
    } else {
      strategy = language === 'es'
        ? `Si aumentas tu pago mensual en ${symbol}${formatResult(monthly * 0.2, currency)}, pagarías más rápido y ahorrarías en intereses.`
        : `If you increase your monthly payment by ${symbol}${formatResult(monthly * 0.2, currency)}, you will pay off faster and save on interest.`;
    }
    setResult({ monthsToPay: months, totalInterest, totalPaid, payoffDate: payoffDate.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US'), strategy });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="sr-only">{language === 'es' ? 'Calculadora de pago de deudas' : 'Debt Payoff Calculator'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="debt-amount" className="block text-sm font-medium text-slate-300 mb-2">{language === 'es' ? 'Monto de la Deuda' : 'Debt Amount'}</label>
          <input id="debt-amount" type="text" inputMode="numeric" value={debtValue} onChange={setDebtAmount}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono" placeholder="10.000" />
        </div>
        <div>
          <label htmlFor="debt-rate" className="block text-sm font-medium text-slate-300 mb-2">{language === 'es' ? 'Tasa de Interés Anual (%)' : 'Annual Interest Rate (%)'}</label>
          <input id="debt-rate" type="text" inputMode="decimal" value={rateValue} onChange={setInterestRate}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono" placeholder="24" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="debt-payment" className="block text-sm font-medium text-slate-300 mb-2">{language === 'es' ? 'Pago Mensual' : 'Monthly Payment'}</label>
          <input id="debt-payment" type="text" inputMode="numeric" value={paymentValue} onChange={setMonthlyPayment}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono" placeholder="500" />
        </div>
      </div>
      {result && (
        <div className="space-y-4" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Tiempo de pago' : 'Payoff Time'}</div>
              <div className="text-2xl font-bold text-emerald-400">{result.monthsToPay === Infinity ? '∞' : `${result.monthsToPay} ${language === 'es' ? 'meses' : 'months'}`}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Total a Pagar' : 'Total to Pay'}</div>
              <div className="text-xl font-bold text-slate-100">{symbol}{formatResult(result.totalPaid, currency)}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Total Intereses' : 'Total Interest'}</div>
              <div className="text-xl font-bold text-rose-400">{symbol}{formatResult(result.totalInterest, currency)}</div>
            </div>
          </div>
          <div className="bg-amber-950/40 rounded-xl p-5 border border-amber-800/50">
            <h3 className="text-sm font-semibold mb-3 text-amber-400">{language === 'es' ? 'Recomendación' : 'Recommendation'}</h3>
            <p className="text-sm text-slate-300">{result.strategy}</p>
            {result.monthsToPay !== Infinity && <p className="text-xs text-slate-400 mt-3">{language === 'es' ? 'Fecha estimada de pago' : 'Estimated payoff date'}: {result.payoffDate}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SavingsGoalCalculator ────────────────────────────────────────────────────
function SavingsGoalCalculator() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: goalValue,    rawValue: goalAmount,     handleChange: setGoalAmount     } = useFormattedInput('0', false);
  const { value: monthsValue,  rawValue: months,         handleChange: setMonths         } = useFormattedInput('0', false);
  const { value: currentValue, rawValue: currentSavings, handleChange: setCurrentSavings } = useFormattedInput('0', false);
  const { value: rateValue,    rawValue: interestRate,   handleChange: setInterestRate   } = useFormattedInput('0', true);
  const [result, setResult] = useState<{ monthlyNeeded: number; totalNeeded: number; canAchieve: boolean; recommendation: string } | null>(null);

  useEffect(() => { calculate(); }, [goalAmount, months, currentSavings, interestRate]);

  const calculate = () => {
    const goal = goalAmount;
    const monthsCount = months;
    const current = currentSavings;
    const monthlyRate = (interestRate / 100) / 12;
    const remaining = goal - current;
    let monthlyNeeded: number;
    if (remaining <= 0) {
      monthlyNeeded = 0;
    } else if (monthlyRate === 0) {
      monthlyNeeded = remaining / monthsCount;
    } else {
      monthlyNeeded = remaining * monthlyRate / (Math.pow(1 + monthlyRate, monthsCount) - 1);
    }
    let recommendation = '';
    if (remaining <= 0) {
      recommendation = language === 'es'
        ? `¡Ya alcanzaste tu meta! Tienes ${symbol}${formatResult(current, currency)} y necesitas ${symbol}${formatResult(goal, currency)}.`
        : `You already reached your goal! You have ${symbol}${formatResult(current, currency)} and need ${symbol}${formatResult(goal, currency)}.`;
    } else if (monthlyNeeded > 2000) {
      recommendation = language === 'es'
        ? `Necesitas ahorrar ${symbol}${formatResult(monthlyNeeded, currency)} mensuales. Considera aumentar el plazo o reducir la meta.`
        : `You need to save ${symbol}${formatResult(monthlyNeeded, currency)} monthly. Consider increasing the term or reducing the goal.`;
    } else if (monthlyNeeded > 500) {
      recommendation = language === 'es'
        ? `Es alcanzable. Ahorrando ${symbol}${formatResult(monthlyNeeded, currency)} mensuales lograrás tu meta en ${monthsCount} meses.`
        : `It's achievable. Saving ${symbol}${formatResult(monthlyNeeded, currency)} monthly will reach your goal in ${monthsCount} months.`;
    } else {
      recommendation = language === 'es'
        ? `¡Muy accesible! Solo necesitas ahorrar ${symbol}${formatResult(monthlyNeeded, currency)} mensuales.`
        : `Very accessible! You only need to save ${symbol}${formatResult(monthlyNeeded, currency)} monthly.`;
    }
    setResult({ monthlyNeeded, totalNeeded: remaining, canAchieve: remaining > 0, recommendation });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="sr-only">{language === 'es' ? 'Calculadora de meta de ahorro' : 'Savings Goal Calculator'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {[
          { id: 'sav-goal',    label: language === 'es' ? 'Meta de Ahorro' : 'Savings Goal',          value: goalValue,    onChange: setGoalAmount,     placeholder: '50.000' },
          { id: 'sav-months',  label: language === 'es' ? 'Plazo (meses)' : 'Term (months)',          value: monthsValue,  onChange: setMonths,         placeholder: '24' },
          { id: 'sav-current', label: language === 'es' ? 'Ahorros Actuales' : 'Current Savings',    value: currentValue, onChange: setCurrentSavings, placeholder: '5.000' },
          { id: 'sav-rate',    label: language === 'es' ? 'Rendimiento Anual (%)' : 'Annual Return (%)', value: rateValue,    onChange: setInterestRate,   placeholder: '4' },
        ].map(({ id, label, value, onChange, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <input id={id} type="text" inputMode="numeric" value={value} onChange={onChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono"
              placeholder={placeholder} />
          </div>
        ))}
      </div>
      {result && (
        <div className="space-y-4" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Ahorro Mensual Necesario' : 'Monthly Savings Needed'}</div>
              <div className="text-2xl font-bold text-emerald-400">{symbol}{formatResult(result.monthlyNeeded, currency)}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Faltante por Ahorrar' : 'Remaining to Save'}</div>
              <div className="text-xl font-bold text-slate-100">{symbol}{formatResult(result.totalNeeded, currency)}</div>
            </div>
          </div>
          <div className="bg-amber-950/40 rounded-xl p-5 border border-amber-800/50">
            <h3 className="text-sm font-semibold mb-3 text-amber-400">{language === 'es' ? 'Recomendación' : 'Recommendation'}</h3>
            <p className="text-sm text-slate-300">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}