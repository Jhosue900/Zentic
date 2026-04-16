// ─── CalculadoraIVA.tsx ───────────────────────────────────────────────────────
// Ruta: /calculadora-de-iva
// Calculadora de IVA, VAT, GST para 40+ países — optimizada para SEO 2025
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SEO } from '../../components/SEO';
import {
  Currency,
  CurrencyContext,
  CurrencySelector,
  FaqSection,
  Breadcrumb,
  formatResult,
  useFormattedInput,
  useCurrency,
  CURRENCY_MAP,
} from './_shared';

// ── Tipos ─────────────────────────────────────────────────────────────────────
type TaxOperation = 'add' | 'remove';

type VatCountry =
  | 'mexico' | 'colombia' | 'argentina' | 'chile' | 'peru' | 'brazil'
  | 'ecuador' | 'bolivia' | 'paraguay' | 'uruguay' | 'venezuela'
  | 'guatemala' | 'honduras' | 'el_salvador' | 'costa_rica' | 'panama'
  | 'dominican_rep' | 'cuba'
  | 'spain' | 'uk' | 'germany' | 'france' | 'italy' | 'portugal'
  | 'netherlands' | 'belgium' | 'sweden' | 'norway' | 'denmark'
  | 'poland' | 'austria' | 'switzerland' | 'ireland' | 'greece'
  | 'romania' | 'hungary' | 'czech_rep' | 'finland'
  | 'japan' | 'china' | 'south_korea' | 'india' | 'australia'
  | 'new_zealand' | 'singapore' | 'thailand' | 'indonesia' | 'philippines'
  | 'turkey' | 'saudi_arabia' | 'uae' | 'israel' | 'south_africa' | 'egypt'
  | 'usa_ca' | 'usa_tx' | 'usa_fl' | 'usa_ny' | 'usa_wa' | 'usa_il'
  | 'usa_pa' | 'usa_oh' | 'usa_ga' | 'usa_nj' | 'usa_tn' | 'usa_none'
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

// ── Datos de países ───────────────────────────────────────────────────────────
const VAT_COUNTRIES: Record<VatCountry, VatCountryMeta> = {
  mexico:        { label: 'México',          rate: 16,    taxName: 'IVA',      flag: '🇲🇽', currency: 'MXN' },
  colombia:      { label: 'Colombia',        rate: 19,    taxName: 'IVA',      flag: '🇨🇴', currency: 'COP' },
  argentina:     { label: 'Argentina',       rate: 21,    taxName: 'IVA',      flag: '🇦🇷', currency: 'ARS', note: 'Tasa general AFIP 2025. Tasa reducida 10.5% para ciertos bienes.' },
  chile:         { label: 'Chile',           rate: 19,    taxName: 'IVA',      flag: '🇨🇱', currency: 'CLP' },
  peru:          { label: 'Perú',            rate: 18,    taxName: 'IGV',      flag: '🇵🇪', currency: 'PEN', note: '16% IGV + 2% IPM' },
  brazil:        { label: 'Brasil',          rate: 17,    taxName: 'ICMS',     flag: '🇧🇷', currency: 'BRL', note: 'ICMS promedio. Varía por estado (12–20%).' },
  ecuador:       { label: 'Ecuador',         rate: 15,    taxName: 'IVA',      flag: '🇪🇨', note: 'Subió de 12% a 15% en 2024' },
  bolivia:       { label: 'Bolivia',         rate: 13,    taxName: 'IVA',      flag: '🇧🇴' },
  paraguay:      { label: 'Paraguay',        rate: 10,    taxName: 'IVA',      flag: '🇵🇾', note: 'Tasa general. 5% para productos básicos.' },
  uruguay:       { label: 'Uruguay',         rate: 22,    taxName: 'IVA',      flag: '🇺🇾', note: 'Tasa básica 22%. Tasa mínima 10% para alimentos básicos.' },
  venezuela:     { label: 'Venezuela',       rate: 16,    taxName: 'IVA',      flag: '🇻🇪', note: 'Tasa vigente 2025. Puede variar por decreto.' },
  guatemala:     { label: 'Guatemala',       rate: 12,    taxName: 'IVA',      flag: '🇬🇹' },
  honduras:      { label: 'Honduras',        rate: 15,    taxName: 'ISV',      flag: '🇭🇳' },
  el_salvador:   { label: 'El Salvador',     rate: 13,    taxName: 'IVA',      flag: '🇸🇻' },
  costa_rica:    { label: 'Costa Rica',      rate: 13,    taxName: 'IVA',      flag: '🇨🇷' },
  panama:        { label: 'Panamá',          rate: 7,     taxName: 'ITBMS',    flag: '🇵🇦', note: 'Tasa general 7%. 10% alcohol y hoteles, 15% cigarrillos.' },
  dominican_rep: { label: 'Rep. Dominicana', rate: 18,    taxName: 'ITBIS',    flag: '🇩🇴' },
  cuba:          { label: 'Cuba',            rate: 10,    taxName: 'IVA',      flag: '🇨🇺', note: 'Sistema impositivo especial. Referencial.' },
  spain:         { label: 'España',          rate: 21,    taxName: 'IVA',      flag: '🇪🇸', currency: 'EUR', note: 'Tasa general 21%. Reducida 10%, superreducida 4%.' },
  uk:            { label: 'Reino Unido',     rate: 20,    taxName: 'VAT',      flag: '🇬🇧', currency: 'GBP', note: 'Tasa estándar 20%. Reducida 5%. Cero para alimentos básicos.' },
  germany:       { label: 'Alemania',        rate: 19,    taxName: 'MwSt',     flag: '🇩🇪', currency: 'EUR', note: 'Tasa estándar 19%. Reducida 7% para alimentos y libros.' },
  france:        { label: 'Francia',         rate: 20,    taxName: 'TVA',      flag: '🇫🇷', currency: 'EUR', note: 'Tasa normal 20%. Reducidas: 10%, 5.5%, 2.1%.' },
  italy:         { label: 'Italia',          rate: 22,    taxName: 'IVA',      flag: '🇮🇹', currency: 'EUR', note: 'Tasa ordinaria 22%. Reducidas: 10%, 5%, 4%.' },
  portugal:      { label: 'Portugal',        rate: 23,    taxName: 'IVA',      flag: '🇵🇹', currency: 'EUR', note: 'Tasa normal 23%. Reducida 13% y 6%.' },
  netherlands:   { label: 'Países Bajos',    rate: 21,    taxName: 'BTW',      flag: '🇳🇱', currency: 'EUR', note: 'Tasa alta 21%. Reducida 9% para alimentos, medicamentos y libros.' },
  belgium:       { label: 'Bélgica',         rate: 21,    taxName: 'TVA',      flag: '🇧🇪', currency: 'EUR', note: 'Tasa normal 21%. Reducidas: 12%, 6%, 0%.' },
  sweden:        { label: 'Suecia',          rate: 25,    taxName: 'Moms',     flag: '🇸🇪', note: 'Tasa estándar 25%. Reducida 12% y 6%.' },
  norway:        { label: 'Noruega',         rate: 25,    taxName: 'MVA',      flag: '🇳🇴', note: 'Tasa general 25%. Reducida 15% (alimentos) y 12% (transporte, hotel).' },
  denmark:       { label: 'Dinamarca',       rate: 25,    taxName: 'Moms',     flag: '🇩🇰', note: 'Tasa única 25%, sin tasas reducidas.' },
  poland:        { label: 'Polonia',         rate: 23,    taxName: 'VAT',      flag: '🇵🇱', note: 'Tasa básica 23%. Reducidas: 8%, 5%.' },
  austria:       { label: 'Austria',         rate: 20,    taxName: 'MwSt',     flag: '🇦🇹', currency: 'EUR', note: 'Tasa normal 20%. Reducida 13% y 10%.' },
  switzerland:   { label: 'Suiza',           rate: 8.1,   taxName: 'MWST',     flag: '🇨🇭', note: 'Tasa normal 8.1% desde 2024.' },
  ireland:       { label: 'Irlanda',         rate: 23,    taxName: 'VAT',      flag: '🇮🇪', currency: 'EUR', note: 'Tasa estándar 23%. Reducidas: 13.5%, 9%, 4.8%.' },
  greece:        { label: 'Grecia',          rate: 24,    taxName: 'ΦΠΑ',      flag: '🇬🇷', currency: 'EUR', note: 'Tasa normal 24%. Reducida 13% y 6%.' },
  romania:       { label: 'Rumanía',         rate: 19,    taxName: 'TVA',      flag: '🇷🇴', note: 'Tasa estándar 19%. Reducida 9% y 5%.' },
  hungary:       { label: 'Hungría',         rate: 27,    taxName: 'ÁFA',      flag: '🇭🇺', note: 'La más alta de la UE: 27%. Reducidas: 18%, 5%.' },
  czech_rep:     { label: 'Rep. Checa',      rate: 21,    taxName: 'DPH',      flag: '🇨🇿', note: 'Tasa básica 21%. Reducidas: 12%.' },
  finland:       { label: 'Finlandia',       rate: 25.5,  taxName: 'ALV',      flag: '🇫🇮', currency: 'EUR', note: 'Subió de 24% a 25.5% en sep. 2024.' },
  japan:         { label: 'Japón',           rate: 10,    taxName: 'JCT',      flag: '🇯🇵', currency: 'JPY', note: 'Consumption Tax 10%. Tasa reducida 8% para alimentos.' },
  china:         { label: 'China',           rate: 13,    taxName: 'VAT',      flag: '🇨🇳', currency: 'CNY', note: 'Tasa general 13%. 9% agrícola y transporte. 6% servicios.' },
  south_korea:   { label: 'Corea del Sur',   rate: 10,    taxName: 'VAT',      flag: '🇰🇷', note: 'Tasa única del 10%.' },
  india:         { label: 'India',           rate: 18,    taxName: 'GST',      flag: '🇮🇳', note: 'GST 18% (tasa estándar). Losas: 5%, 12%, 18%, 28%.' },
  australia:     { label: 'Australia',       rate: 10,    taxName: 'GST',      flag: '🇦🇺', currency: 'AUD', note: 'GST tasa única 10%. Los alimentos básicos están exentos.' },
  new_zealand:   { label: 'Nueva Zelanda',   rate: 15,    taxName: 'GST',      flag: '🇳🇿', note: 'GST tasa única 15%.' },
  singapore:     { label: 'Singapur',        rate: 9,     taxName: 'GST',      flag: '🇸🇬', note: 'GST subió a 9% en 2024.' },
  thailand:      { label: 'Tailandia',       rate: 7,     taxName: 'VAT',      flag: '🇹🇭', note: 'Tasa reducida temporal 7% (estándar 10%). Vigente hasta 2026.' },
  indonesia:     { label: 'Indonesia',       rate: 11,    taxName: 'PPN',      flag: '🇮🇩', note: 'Subió de 10% a 11% en 2022.' },
  philippines:   { label: 'Filipinas',       rate: 12,    taxName: 'VAT',      flag: '🇵🇭', note: 'Tasa estándar 12%.' },
  turkey:        { label: 'Turquía',         rate: 20,    taxName: 'KDV',      flag: '🇹🇷', currency: 'TRY', note: 'Subió de 18% a 20% en 2023.' },
  saudi_arabia:  { label: 'Arabia Saudita',  rate: 15,    taxName: 'VAT',      flag: '🇸🇦', note: 'VAT triplicado de 5% a 15% en 2020.' },
  uae:           { label: 'Emiratos Árabes', rate: 5,     taxName: 'VAT',      flag: '🇦🇪', note: 'Introducido en 2018. Tasa única 5%.' },
  israel:        { label: 'Israel',          rate: 18,    taxName: 'VAT',      flag: '🇮🇱', note: 'Subió de 17% a 18% en ene. 2025.' },
  south_africa:  { label: 'Sudáfrica',       rate: 15,    taxName: 'VAT',      flag: '🇿🇦', note: 'VAT subió a 15% en 2018.' },
  egypt:         { label: 'Egipto',          rate: 14,    taxName: 'VAT',      flag: '🇪🇬', note: 'Tasa estándar 14%.' },
  usa_ca:        { label: 'California',      rate: 8.82,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '7.25% estatal + ~1.57% local avg.' },
  usa_tx:        { label: 'Texas',           rate: 8.19,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.25% estatal + ~1.94% local avg.' },
  usa_fl:        { label: 'Florida',         rate: 7.02,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6% estatal + ~1.02% local avg.' },
  usa_ny:        { label: 'New York',        rate: 8.52,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '4% estatal + ~4.52% local (NYC 8.875%)' },
  usa_wa:        { label: 'Washington',      rate: 9.29,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.5% estatal + ~2.79% local avg.' },
  usa_il:        { label: 'Illinois',        rate: 8.85,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.25% estatal + ~2.6% local avg.' },
  usa_pa:        { label: 'Pennsylvania',    rate: 6.34,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6% estatal + ~0.34% local avg.' },
  usa_oh:        { label: 'Ohio',            rate: 7.24,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '5.75% estatal + ~1.49% local avg.' },
  usa_ga:        { label: 'Georgia',         rate: 7.38,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '4% estatal + ~3.38% local avg.' },
  usa_nj:        { label: 'New Jersey',      rate: 6.6,   taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '6.625% estatal (tasa uniforme)' },
  usa_tn:        { label: 'Tennessee',       rate: 9.55,  taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: '7% estatal + ~2.55% local avg.' },
  usa_none:      { label: 'Oregon / Delaware / Montana / NH', rate: 0, taxName: 'Sales Tax', flag: '🇺🇸', currency: 'USD', note: 'Sin impuesto sobre ventas estatal.' },
  ca_on:         { label: 'Ontario',         rate: 13,    taxName: 'HST',       flag: '🇨🇦', currency: 'CAD', note: 'HST 13% (5% GST + 8% provincial)' },
  ca_qc:         { label: 'Quebec',          rate: 14.975,taxName: 'GST+QST',  flag: '🇨🇦', currency: 'CAD', note: '5% GST + 9.975% QST' },
  ca_bc:         { label: 'Br. Columbia',    rate: 12,    taxName: 'GST+PST',  flag: '🇨🇦', currency: 'CAD', note: '5% GST + 7% PST' },
  ca_ab:         { label: 'Alberta',         rate: 5,     taxName: 'GST',      flag: '🇨🇦', currency: 'CAD', note: 'Solo 5% GST. Sin impuesto provincial.' },
  ca_nb:         { label: 'New Brunswick',   rate: 15,    taxName: 'HST',      flag: '🇨🇦', currency: 'CAD', note: 'HST 15% (5% GST + 10% provincial)' },
  ca_ns:         { label: 'Nova Scotia',     rate: 14,    taxName: 'HST',      flag: '🇨🇦', currency: 'CAD', note: 'HST 14% desde abril 2025 (5% GST + 9%)' },
  ca_nl:         { label: 'Newfoundland',    rate: 15,    taxName: 'HST',      flag: '🇨🇦', currency: 'CAD', note: 'HST 15% (5% GST + 10% provincial)' },
  ca_pe:         { label: 'P.E. Island',     rate: 15,    taxName: 'HST',      flag: '🇨🇦', currency: 'CAD', note: 'HST 15% (5% GST + 10% provincial)' },
  ca_sk:         { label: 'Saskatchewan',    rate: 11,    taxName: 'GST+PST',  flag: '🇨🇦', currency: 'CAD', note: '5% GST + 6% PST' },
  ca_mb:         { label: 'Manitoba',        rate: 12,    taxName: 'GST+RST',  flag: '🇨🇦', currency: 'CAD', note: '5% GST + 7% RST' },
};

const VAT_GROUPS = [
  { label: '🌎 Latinoamérica — Cono Sur',      keys: ['chile','argentina','uruguay','peru','bolivia','paraguay'] as VatCountry[] },
  { label: '🌎 Latinoamérica — Andina/Caribe', keys: ['colombia','venezuela','ecuador','dominican_rep','cuba'] as VatCountry[] },
  { label: '🌎 Latinoamérica — México y CA',   keys: ['mexico','guatemala','honduras','el_salvador','costa_rica','panama'] as VatCountry[] },
  { label: '🇧🇷 Brasil',                        keys: ['brazil'] as VatCountry[] },
  { label: '🇪🇺 Europa — Zona Euro',            keys: ['spain','germany','france','italy','portugal','netherlands','belgium','austria','ireland','greece','finland'] as VatCountry[] },
  { label: '🇪🇺 Europa — Fuera del Euro',       keys: ['uk','sweden','norway','denmark','poland','switzerland','romania','hungary','czech_rep'] as VatCountry[] },
  { label: '🌏 Asia / Pacífico',                keys: ['japan','china','south_korea','india','australia','new_zealand','singapore','thailand','indonesia','philippines'] as VatCountry[] },
  { label: '🌍 Medio Oriente / África',         keys: ['turkey','saudi_arabia','uae','israel','south_africa','egypt'] as VatCountry[] },
  { label: '🇺🇸 USA — por estado',              keys: ['usa_ca','usa_tx','usa_fl','usa_ny','usa_wa','usa_il','usa_pa','usa_oh','usa_ga','usa_nj','usa_tn','usa_none'] as VatCountry[] },
  { label: '🇨🇦 Canadá — por provincia',        keys: ['ca_on','ca_qc','ca_bc','ca_ab','ca_nb','ca_ns','ca_nl','ca_pe','ca_sk','ca_mb'] as VatCountry[] },
];

const FAQ_IVA = [
  {
    q_es: '¿Cómo funciona el IVA en México y qué tasas se aplican en 2026?',
    q_en: 'How does VAT work in Mexico and what rates are currently applied?',
    a_es: 'El Impuesto al Valor Agregado en México es un tributo indirecto que grava el consumo de bienes y servicios, operando bajo una tasa general del 16% en la mayor parte del territorio nacional, aunque cuenta con una tasa reducida del 8% diseñada específicamente para los municipios de la región fronteriza norte y sur con el fin de fomentar la competitividad económica frente a mercados extranjeros; además de estas tasas, existen productos esenciales como alimentos no procesados y medicinas que están sujetos a la tasa del 0%, y para calcularlo correctamente es vital entender la diferencia entre el IVA trasladado que se cobra a los clientes y el IVA acreditable que se paga a proveedores, ya que la determinación del impuesto a pagar resulta de la resta de ambos conceptos, siendo recomendable para cualquier contribuyente desglosar el impuesto dividiendo el total entre 1.16 para conocer el valor base y gestionar cuidadosamente estos flujos de efectivo, puesto que el IVA recaudado no forma parte de los ingresos reales del negocio sino que es un recurso que debe entregarse íntegramente al Servicio de Administración Tributaria (SAT).',
    a_en: "Value Added Tax (VAT), known in Mexico as IVA, is an indirect tax levied on the consumption of goods and services, operating under a general standard rate of 16% across most of the national territory, while also featuring a reduced incentive rate of 8% specifically designed for municipalities in the northern and southern border regions to foster economic competitiveness against foreign markets; in addition to these rates, there are essential products such as non-processed foods and medicines subject to a 0% rate, and to calculate it correctly, it is vital to understand the difference between output VAT charged to customers and input VAT paid to suppliers, as the final tax liability results from subtracting these two concepts, and it is highly recommended for any taxpayer to break down the tax by dividing the total amount by 1.16 to determine the base value and carefully manage these cash flows, given that the collected VAT is not part of the business's actual income but rather a resource that must be remitted in full to the Tax Administration Service (SAT).",
  },
  {
    q_es: '¿Cómo se calcula el IVA y qué métodos existen para gestionarlo correctamente?',
    q_en: 'How is VAT calculated and what methods exist to manage it correctly?',
    a_es: 'El cálculo del Impuesto al Valor Agregado es un proceso fundamental en la gestión financiera que requiere precisión absoluta tanto para la determinación del precio final como para el desglose contable, realizándose el cálculo para agregar el impuesto mediante la multiplicación del precio base por el factor correspondiente a la tasa vigente, como ocurre en un ejemplo de tasa del 19% donde multiplicar cien por uno punto diecinueve resulta en ciento diecinueve, mientras que para realizar la operación inversa y quitar el IVA ya incluido en un precio total se debe dividir dicha cantidad entre el mismo factor, permitiendo así identificar el valor neto de la transacción; sin embargo, para una administración financiera estratégica es crucial no solo dominar estas operaciones aritméticas, sino también comprender que este impuesto es neutral para las empresas y profesionales, quienes actúan meramente como recaudadores ante el Estado, por lo que se recomienda llevar un registro riguroso del IVA trasladado y el acreditable para optimizar el flujo de caja, evitar sanciones fiscales por errores en el redondeo o en la aplicación de tasas diferenciales según la región o tipo de producto, y asegurar que el saldo a pagar o a favor ante la autoridad tributaria sea calculado siempre sobre la base imponible real después de aplicar correctamente estos métodos de cálculo manual o automatizado.',
    a_en: 'The calculation of Value Added Tax is a fundamental process in financial management that requires absolute precision for both determining the final price and performing accounting breakdowns, where adding the tax is achieved by multiplying the base price by the factor corresponding to the current rate, such as in a 19% rate example where multiplying one hundred by one point nineteen results in one hundred and nineteen, while to perform the inverse operation and remove the VAT already included in a total price, said amount must be divided by the same factor to identify the net value of the transaction; however, for strategic financial administration, it is crucial not only to master these arithmetic operations but also to understand that this tax is neutral for businesses and professionals, who act merely as collectors for the state, making it highly recommended to maintain rigorous records of output and input VAT to optimize cash flow, avoid tax penalties due to rounding errors or the application of differential rates based on region or product type, and ensure that the tax liability or refund before the tax authority is always calculated on the real taxable base after correctly applying these manual or automated calculation methods.',
  },
  {
    q_es: '¿Cuánto es el IVA en Chile 2026?',
    q_en: 'What is the VAT in Chile 2026?',
    a_es: 'En Chile, el Impuesto al Valor Agregado (IVA) se mantiene en una tasa general del 19% para el año 2026, consolidándose como la principal fuente de recaudación fiscal del país al aplicarse de manera casi universal sobre la venta de bienes corporales muebles e inmuebles, así como sobre la prestación de servicios profesionales y comerciales; es fundamental comprender que, tras la implementación de la Ley de Modernización Tributaria, servicios que anteriormente estaban exentos ahora están sujetos a este gravamen, lo que hace indispensable para consumidores y empresas el uso de herramientas de cálculo precisas para determinar el precio final de los productos, considerando además que existen excepciones específicas para ciertos servicios de salud, educación y transporte de pasajeros, por lo que una gestión financiera responsable requiere distinguir correctamente entre el valor neto y el valor bruto para evitar errores en la declaración mensual ante el Servicio de Impuestos Internos (SII).',
    a_en: "The Value Added Tax (VAT), known in Chile as IVA, remains at a standard rate of 19% for the year 2026, establishing itself as the country's primary source of tax revenue by being applied almost universally to the sale of tangible personal and real property, as well as to the provision of professional and commercial services; it is essential to understand that, following the implementation of the Tax Modernization Law, many services that were previously exempt are now subject to this tax, making it indispensable for consumers and businesses to use precise calculation tools to determine the final price of goods, while also considering specific exceptions for certain healthcare services, education, and passenger transportation, meaning that responsible financial management requires correctly distinguishing between net and gross values to avoid errors in monthly tax filings with the Chilean Internal Revenue Service (SII).",
  },
  {
    q_es: '¿Cuál es el IVA en Colombia 2026?',
    q_en: 'What is the VAT in Colombia 2026?',
    a_es: 'En Colombia, para el año 2026, la tarifa general del Impuesto al Valor Agregado (IVA) se mantiene en el 19%, aplicándose de forma obligatoria sobre la venta de bienes, la prestación de servicios en el territorio nacional y la importación de productos; es fundamental que los contribuyentes y consumidores reconozcan que el sistema tributario colombiano también contempla tarifas diferenciales, como la tasa del 5% para productos de la canasta básica refinados o servicios de aseo, así como una categoría de bienes exentos y excluidos (0%) que buscan proteger el poder adquisitivo en artículos de primera necesidad y servicios de salud, por lo cual resulta indispensable contar con herramientas de cálculo precisas que permitan desglosar este impuesto dividiendo el valor total por el factor 1.19, asegurando así un cumplimiento riguroso de las obligaciones fiscales ante la Dirección de Impuestos y Aduanas Nacionales (DIAN) y una gestión financiera transparente tanto para personas naturales como para empresas.',
    a_en: 'In Colombia, for the year 2026, the general Value Added Tax (VAT) rate remains at 19%, being mandatorily applied to the sale of goods, the provision of services within the national territory, and the importation of products; it is essential for taxpayers and consumers to recognize that the Colombian tax system also includes differential rates, such as the 5% rate for refined basic basket products or cleaning services, as well as a category of exempt and excluded goods (0%) that aim to protect purchasing power for essential items and healthcare services, making it indispensable to have precise calculation tools that allow for the breakdown of this tax by dividing the total value by the factor 1.19, thus ensuring rigorous compliance with fiscal obligations before the National Directorate of Taxes and Customs (DIAN) and transparent financial management for both individuals and businesses.',
  },
  {
    q_es: '¿Cuál es el IVA en Argentina 2026?',
    q_en: 'What is the VAT in Argentina 2026?',
    a_es: 'En Argentina, para el año 2026, la tasa general del Impuesto al Valor Agregado (IVA) se mantiene en el 21% según las normativas de la Administración Federal de Ingresos Públicos (AFIP), aplicándose sobre la mayoría de las ventas de bienes y prestaciones de servicios comerciales en todo el país; es crucial que tanto consumidores como responsables inscriptos identifiquen las alícuotas diferenciales, ya que existe una tasa reducida del 10.5% para sectores específicos como la construcción de viviendas, la venta de carnes, frutas y legumbres, y ciertos servicios de capital, además de una tasa incrementada del 27% para servicios públicos como gas y energía eléctrica cuando son contratados por sujetos responsables, por lo cual utilizar una calculadora de IVA precisa resulta fundamental para realizar el desglose correcto dividiendo el precio total por 1.21, permitiendo así una gestión financiera transparente, un control exacto del crédito y débito fiscal en las declaraciones juradas mensuales y una planificación de costos adecuada en un entorno económico dinámico.',
    a_en: 'In Argentina, for the year 2026, the general Value Added Tax (VAT) rate remains at 21% according to the regulations of the Federal Administration of Public Revenue (AFIP), being applied to most sales of goods and commercial services throughout the country; it is crucial for both consumers and registered taxpayers to identify differential tax rates, as there is a reduced rate of 10.5% for specific sectors such as housing construction, the sale of meat, fruits, and vegetables, and certain capital services, in addition to an increased rate of 27% for public services like gas and electricity when contracted by registered entities, which is why using a precise VAT calculator is fundamental to perform the correct breakdown by dividing the total price by 1.21, thus allowing for transparent financial management, accurate control of tax credits and debits in monthly tax returns, and proper cost planning in a dynamic economic environment.',
  },
  {
    q_es: '¿Cuál es la diferencia entre IVA incluido e IVA excluido?',
    q_en: "What's the difference between VAT included and VAT excluded?",
    a_es: 'Comprender la distinción entre el IVA incluido y el IVA excluido es esencial para cualquier transacción comercial, ya que el precio neto (IVA excluido) representa el valor real que el vendedor recibe por su bien o servicio antes de añadir el impuesto que deberá recaudar para el Estado, mientras que el precio bruto (IVA incluido) es la cifra final que el consumidor efectivamente paga y que ya contiene la carga tributaria en su interior; en términos prácticos, cuando un presupuesto se presenta con IVA excluido, el comprador debe sumar el porcentaje correspondiente al precio base para conocer su costo total, pero si el precio se muestra con IVA incluido, se debe realizar una operación de desglose matemático para identificar cuánto dinero corresponde al producto y cuánto al impuesto, una diferenciación crítica en la contabilidad empresarial para el aprovechamiento de créditos fiscales, la correcta emisión de facturas y la transparencia en la comunicación de precios al consumidor final.',
    a_en: 'Understanding the distinction between VAT included and VAT excluded is essential for any commercial transaction, as the net price (VAT excluded) represents the actual value the seller receives for their good or service before adding the tax that must be collected for the State, while the gross price (VAT included) is the final figure the consumer actually pays, which already contains the tax burden within it; in practical terms, when a quote is presented with VAT excluded, the buyer must add the corresponding percentage to the base price to know their total cost, but if the price is shown with VAT included, a mathematical breakdown must be performed to identify how much money corresponds to the product and how much to the tax, a critical differentiation in business accounting for leveraging tax credits, the correct issuance of invoices, and transparency in communicating prices to the final consumer.',
  },
  {
    q_es: '¿Cómo se aplica el IVA en los servicios digitales y plataformas de streaming?',
    q_en: "How is VAT applied to digital services and streaming platforms?",
    a_es: 'En la economía global actual, el IVA sobre servicios digitales como suscripciones de streaming, almacenamiento en la nube y licencias de software ha pasado a ser una norma recaudatoria en la mayoría de los países, donde plataformas internacionales están obligadas a retener el impuesto local del consumidor final según su ubicación geográfica; esto implica que, al utilizar nuestra calculadora para presupuestar gastos tecnológicos, es fundamental considerar que el precio mostrado en sitios extranjeros a menudo no incluye el impuesto nacional, el cual puede ser cargado directamente por el banco emisor de la tarjeta de crédito bajo conceptos de servicios digitales transfronterizos, por lo que desglosar estos costos permite a los usuarios y pequeñas empresas gestionar mejor sus suscripciones recurrentes y entender la carga tributaria real que impacta su flujo de caja digital.',
    a_en: "In today's global economy, VAT on digital services such as streaming subscriptions, cloud storage, and software licenses has become a standard tax regulation in most countries, where international platforms are required to withhold the final consumer's local tax based on their geographic location; this implies that, when using our calculator to budget for technological expenses, it is essential to consider that the price displayed on foreign websites often does not include the national tax, which may be charged directly by the issuing bank under the concept of cross-border digital services, therefore breaking down these costs allows users and small businesses to better manage their recurring subscriptions and understand the real tax burden impacting their digital cash flow.",
  },
  {
    q_es: '¿Qué es un saldo a favor de IVA y cómo se puede recuperar?',
    q_en: "What is a VAT credit balance and how can it be recovered?",
    a_es: 'Un saldo a favor en el IVA ocurre cuando el impuesto acreditable, es decir, el IVA que pagaste por tus compras y gastos de operación, resulta ser mayor que el IVA trasladado que cobraste a tus clientes durante un periodo determinado; este fenómeno es común en fases de inversión inicial o en negocios con márgenes reducidos, y representa un activo financiero que el contribuyente puede recuperar mediante la solicitud de devolución formal ante la autoridad fiscal o mediante la compensación contra futuros pagos del mismo impuesto, siendo este un punto donde el uso de una calculadora precisa se vuelve una herramienta de planificación estratégica que ayuda a proyectar estos excedentes, optimizar la liquidez de la empresa y asegurar que no se pierda el derecho a reclamar estos fondos por errores en el redondeo o en el cálculo de las bases imponibles.',
    a_en: "A VAT credit balance occurs when the input VAT, which is the tax you paid on your purchases and operating expenses, happens to be greater than the output VAT you collected from your customers during a specific period; this phenomenon is common during initial investment phases or in businesses with low margins, and it represents a financial asset that the taxpayer can recover through a formal refund request to the tax authority or by offsetting it against future payments of the same tax, making the use of a precise calculator a strategic planning tool that helps project these surpluses, optimize company liquidity, and ensure that the right to claim these funds is not lost due to rounding errors or mistakes in calculating the taxable bases.",
  },
];

// ── Componente interno de la calculadora ──────────────────────────────────────
function TaxCalculatorInner() {
  const { symbol, currency, setCurrency } = useCurrency();
  const { language } = useLanguage();
  const [country, setCountry] = useState<VatCountry>('colombia');
  const { value: amountValue, rawValue: amount, handleChange: setAmount } = useFormattedInput('0', false);
  const [operation, setOperation] = useState<TaxOperation>('add');
  const [result, setResult] = useState<{ gross: number; tax: number; net: number; taxRate: number } | null>(null);
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
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* País */}
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
            {VAT_GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label} className="text-slate-400">
                {g.keys.map((key) => {
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

        {/* Monto */}
        <div>
          <label htmlFor="vat-amount" className="block text-sm font-medium text-slate-300 mb-2">
            {language === 'es' ? 'Monto' : 'Amount'}
          </label>
          <input
            id="vat-amount"
            type="text"
            inputMode="numeric"
            value={amountValue}
            onChange={setAmount}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono text-lg"
            placeholder="100"
          />
        </div>
      </div>

      {/* Operación */}
      <div className="flex gap-4 mb-6" role="group" aria-label={language === 'es' ? 'Tipo de operación' : 'Operation type'}>
        <button
          onClick={() => setOperation('add')}
          aria-pressed={operation === 'add'}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            operation === 'add' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          + {language === 'es' ? 'Agregar' : 'Add'} {countryMeta.taxName}
        </button>
        <button
          onClick={() => setOperation('remove')}
          aria-pressed={operation === 'remove'}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
            operation === 'remove' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          − {language === 'es' ? 'Quitar' : 'Remove'} {countryMeta.taxName}
        </button>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-500 transition-all shadow-md mb-6"
      >
        {language === 'es' ? 'Calcular' : 'Calculate'} {countryMeta.taxName}
      </button>

      {result && (
        <div
          className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-6 border border-emerald-800/50"
          aria-live="polite"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <div className="text-sm text-slate-400 mb-1">
                {language === 'es' ? 'Base Imponible' : 'Taxable Base'}
              </div>
              <div className="text-2xl font-bold text-slate-100">
                {symbol}{formatResult(result.gross, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">
                {countryMeta.taxName} ({result.taxRate}%)
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                {symbol}{formatResult(result.tax, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">
                {language === 'es' ? 'Total con' : 'Total with'} {countryMeta.taxName}
              </div>
              <div className="text-2xl font-bold text-slate-100">
                {symbol}{formatResult(result.net, currency)}
              </div>
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

// ── Página pública exportada ──────────────────────────────────────────────────
export function CalculadoraIVA() {
  const { language } = useLanguage();
  const [globalCurrency, setGlobalCurrency] = useState<Currency>('COP');
  const meta = CURRENCY_MAP[globalCurrency];

  const title =
    language === 'es'
      ? 'Calculadora de IVA 2025 | 40+ Países: México, Colombia, Chile, Argentina, España'
      : 'VAT Calculator 2025 | 40+ Countries: Mexico, Colombia, Chile, Argentina, Spain';

  const description =
    language === 'es'
      ? 'Calcula IVA, GST, VAT o impuesto al consumo al instante. Más de 40 países actualizados 2025. Agrega o quita impuestos con precisión. Gratis y sin registros.'
      : 'Calculate VAT, GST, or sales tax instantly. 40+ countries updated 2025. Add or remove taxes with precision. Free and no registration required.';

  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
    inLanguage: language === 'es' ? 'es' : 'en',
    url: 'https://zentic.app/calculadora-de-iva',
  });

  return (
    <CurrencyContext.Provider
      value={{ currency: globalCurrency, setCurrency: setGlobalCurrency, symbol: meta?.symbol ?? '$' }}
    >
      <>
        <SEO title={title} description={description} type="SoftwareApplication" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJsonLd }} />

        <article
          className="max-w-3xl mx-auto py-6 px-4 sm:px-6"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
        >
          <Breadcrumb
            items={[
              { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
              { label: language === 'es' ? 'Calculadoras' : 'Calculators', href: '/calculators' },
              { label: language === 'es' ? 'Calculadora de IVA' : 'VAT Calculator' },
            ]}
          />

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                <Calculator className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {language === 'es' ? '40+ países · Actualizado 2025' : '40+ countries · Updated 2025'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3" itemProp="name">
              {language === 'es' ? 'Calculadora de IVA' : 'VAT Calculator'}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed" itemProp="description">
              {language === 'es'
                ? 'Calcula IVA, IGV, GST o impuesto al consumo para más de 40 países. Agrega o quita el impuesto incluido en el precio al instante.'
                : 'Calculate VAT, GST, or sales tax for 40+ countries. Add or remove tax from any price instantly.'}
            </p>
          </header>

          {/* Selector de moneda */}
          <CurrencySelector
            globalCurrency={globalCurrency}
            setGlobalCurrency={setGlobalCurrency}
            language={language}
          />

          {/* Card principal */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 mb-8">
            <TaxCalculatorInner />
          </div>

          {/* Contenido editorial SEO */}
          <section className="prose prose-invert prose-slate max-w-none mb-8">
            <h2 className="text-xl font-bold text-slate-200 mb-4">
              {language === 'es' ? '¿Cómo funciona esta calculadora de IVA?' : 'How does this VAT calculator work?'}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              {language === 'es'
                ? 'Esta herramienta permite calcular el IVA (Impuesto al Valor Agregado) en dos modos: agregar impuesto a un precio neto, o extraer el IVA ya incluido en un precio bruto. Solo selecciona el país, ingresa el monto y elige la operación.'
                : 'This tool calculates VAT in two modes: adding tax to a net price, or extracting already-included VAT from a gross price. Simply select the country, enter the amount, and choose the operation.'}
            </p>
            <h3 className="text-lg font-semibold text-slate-300 mb-3">
              {language === 'es' ? 'Tasas de IVA en Latinoamérica 2026' : 'Latin America VAT Rates 2026'}
            </h3>
            <ul className="text-slate-400 space-y-1 list-disc list-inside">
              <li>{language === 'es' ? 'Colombia: 19% (IVA)' : 'Colombia: 19% (IVA)'}</li>
              <li>{language === 'es' ? 'México: 16% (IVA)' : 'Mexico: 16% (IVA)'}</li>
              <li>{language === 'es' ? 'Chile: 19% (IVA)' : 'Chile: 19% (IVA)'}</li>
              <li>{language === 'es' ? 'Argentina: 21% (IVA)' : 'Argentina: 21% (IVA)'}</li>
              <li>{language === 'es' ? 'Perú: 18% (IGV)' : 'Peru: 18% (IGV)'}</li>
            </ul>
          </section>

          <FaqSection faqs={FAQ_IVA} language={language as 'es' | 'en'} />
        </article>
      </>
    </CurrencyContext.Provider>
  );
}