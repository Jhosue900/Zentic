// ─── CalculadoraPrestamo.tsx ──────────────────────────────────────────────────
// Ruta: /calculadora-de-prestamo
// Calculadora de capacidad de préstamo (regla del 30%) — SEO 2025
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
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

const FAQ_PRESTAMO = [
  {
    q_es: '¿Cuánto préstamo puedo pedir según mi sueldo?',
    q_en: 'How much loan can I get based on my salary?',
    a_es: 'La regla del 30% indica que la cuota mensual del préstamo no debe superar el 30% de tus ingresos disponibles (ingresos netos menos gastos fijos). Esta calculadora aplica esa regla automáticamente.',
    a_en: 'The 30% rule states that the monthly loan payment should not exceed 30% of your available income (net income minus fixed expenses). This calculator applies that rule automatically.',
  },
  {
    q_es: '¿Qué es la regla del 30% en préstamos?',
    q_en: 'What is the 30% rule in loans?',
    a_es: 'Es una regla financiera estándar que recomienda no destinar más del 30% de los ingresos disponibles al pago de deudas. Ayuda a mantener un presupuesto sano y evitar el sobreendeudamiento.',
    a_en: 'It is a standard financial rule recommending that no more than 30% of available income be allocated to debt payments. It helps maintain a healthy budget and avoid over-indebtedness.',
  },
  {
    q_es: '¿Cómo se calcula la cuota mensual de un préstamo?',
    q_en: 'How is the monthly loan payment calculated?',
    a_es: 'La fórmula es: Cuota = Capital × [r(1+r)^n / ((1+r)^n - 1)], donde r es la tasa mensual y n el número de cuotas. Esta calculadora lo hace automáticamente.',
    a_en: 'The formula is: Payment = Principal × [r(1+r)^n / ((1+r)^n - 1)], where r is the monthly rate and n the number of payments. This calculator does it automatically.',
  },
  {
    q_es: '¿Qué diferencia hay entre un préstamo hipotecario y uno personal?',
    q_en: "What's the difference between a mortgage and a personal loan?",
    a_es: 'Un préstamo hipotecario está garantizado por un bien inmueble, tiene plazos largos (hasta 30 años) y tasas más bajas. Un préstamo personal es sin garantía, con plazos cortos y tasas más altas.',
    a_en: 'A mortgage is secured by real estate, has long terms (up to 30 years), and lower rates. A personal loan is unsecured, with short terms and higher rates.',
  },
];

function LoanCalculatorInner() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: incomeValue,   rawValue: monthlyIncome,   handleChange: setMonthlyIncome   } = useFormattedInput('0', false);
  const { value: expensesValue, rawValue: monthlyExpenses, handleChange: setMonthlyExpenses } = useFormattedInput('0', false);
  const { value: loanValue,     rawValue: loanAmount,      handleChange: setLoanAmount      } = useFormattedInput('0', false);
  const { value: rateValue,     rawValue: interestRate,    handleChange: setInterestRate    } = useFormattedInput('0', true);
  const { value: termValue,     rawValue: loanTerm,        handleChange: setLoanTerm        } = useFormattedInput('0', false);
  const [result, setResult] = useState<{
    monthlyPayment: number;
    maxAffordable: number;
    canAfford: boolean;
    disposableIncome: number;
    recommendation: string;
  } | null>(null);

  useEffect(() => { calculate(); }, [monthlyIncome, monthlyExpenses, loanAmount, interestRate, loanTerm]);

  const calculate = () => {
    const income          = monthlyIncome;
    const expenses        = monthlyExpenses;
    const loan            = loanAmount;
    const annualRate      = interestRate / 100;
    const years           = loanTerm;
    const disposableIncome = income - expenses;
    const monthlyRate     = annualRate / 12;
    const months          = years * 12;
    const monthlyPayment  = loan * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const maxMonthlyPayment = disposableIncome * 0.3;
    const maxAffordable   = maxMonthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));
    const canAfford       = monthlyPayment <= maxMonthlyPayment;
    const recommendation  = !canAfford
      ? (language === 'es'
          ? `La cuota mensual (${symbol}${formatResult(monthlyPayment, currency)}) excede el 30% de tu capacidad de pago (${symbol}${formatResult(maxMonthlyPayment, currency)}). Te recomendamos reducir el monto a ${symbol}${formatResult(maxAffordable, currency)}.`
          : `The monthly payment (${symbol}${formatResult(monthlyPayment, currency)}) exceeds 30% of your payment capacity (${symbol}${formatResult(maxMonthlyPayment, currency)}). We recommend reducing the amount to ${symbol}${formatResult(maxAffordable, currency)}.`)
      : (language === 'es'
          ? `Puedes pagar este préstamo cómodamente. La cuota representa ${((monthlyPayment / disposableIncome) * 100).toFixed(1)}% de tu capacidad de pago.`
          : `You can comfortably afford this loan. The payment represents ${((monthlyPayment / disposableIncome) * 100).toFixed(1)}% of your payment capacity.`);
    setResult({ monthlyPayment, maxAffordable, canAfford, disposableIncome, recommendation });
  };

  const fields = [
    { id: 'loan-income',   label: language === 'es' ? 'Ingreso Mensual Neto'       : 'Monthly Net Income',         value: incomeValue,   onChange: setMonthlyIncome,   placeholder: '3.000' },
    { id: 'loan-expenses', label: language === 'es' ? 'Gastos Mensuales Fijos'     : 'Fixed Monthly Expenses',     value: expensesValue, onChange: setMonthlyExpenses, placeholder: '1.000' },
    { id: 'loan-amount',   label: language === 'es' ? 'Monto del Préstamo'         : 'Loan Amount',                value: loanValue,     onChange: setLoanAmount,      placeholder: '50.000' },
    { id: 'loan-rate',     label: language === 'es' ? 'Tasa de Interés Anual (%)' : 'Annual Interest Rate (%)',   value: rateValue,     onChange: setInterestRate,    placeholder: '12' },
    { id: 'loan-term',     label: language === 'es' ? 'Plazo (años)'               : 'Term (years)',               value: termValue,     onChange: setLoanTerm,        placeholder: '5' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {fields.map(({ id, label, value, onChange, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <input
              id={id} type="text" inputMode="numeric"
              value={value} onChange={onChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono"
              placeholder={placeholder}
            />
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
              <div className="text-xs text-slate-400 mb-1">
                {language === 'es' ? 'Límite 30% ingresos disponibles' : '30% of disposable income limit'}
              </div>
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

export function CalculadoraPrestamo() {
  const { language } = useLanguage();
  const [globalCurrency, setGlobalCurrency] = useState<Currency>('COP');
  const meta = CURRENCY_MAP[globalCurrency];

  const title =
    language === 'es'
      ? 'Calculadora de Capacidad de Préstamo 2025 | ¿Cuánto préstamo puedo pedir?'
      : 'Loan Affordability Calculator 2025 | How Much Loan Can I Afford?';

  const description =
    language === 'es'
      ? 'Calcula cuánto préstamo puedes pagar según tus ingresos y gastos. Regla del 30% aplicada automáticamente. Simulador de crédito hipotecario y personal gratis.'
      : 'Calculate how much loan you can afford based on your income and expenses. 30% rule automatically applied. Free mortgage and personal loan simulator.';

  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
    inLanguage: language === 'es' ? 'es' : 'en',
    url: 'https://zentic.app/calculadora-de-prestamo',
  });

  return (
    <CurrencyContext.Provider value={{ currency: globalCurrency, setCurrency: setGlobalCurrency, symbol: meta?.symbol ?? '$' }}>
      <>
        <SEO title={title} description={description} type="SoftwareApplication" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJsonLd }} />

        <article className="max-w-3xl mx-auto px-4 sm:px-6" itemScope itemType="https://schema.org/SoftwareApplication">
          <Breadcrumb
            items={[
              { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
              { label: language === 'es' ? 'Calculadoras' : 'Calculators', href: '/calculators' },
              { label: language === 'es' ? 'Calculadora de Préstamo' : 'Loan Calculator' },
            ]}
          />

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                <Home className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {language === 'es' ? 'Regla del 30% · Hipotecario y personal' : '30% rule · Mortgage & personal'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3" itemProp="name">
              {language === 'es' ? 'Calculadora de Capacidad de Préstamo' : 'Loan Affordability Calculator'}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed" itemProp="description">
              {language === 'es'
                ? 'Descubre cuánto préstamo puedes asumir de forma responsable según tus ingresos y gastos mensuales.'
                : 'Find out how much loan you can responsibly take on based on your monthly income and expenses.'}
            </p>
          </header>

          <CurrencySelector globalCurrency={globalCurrency} setGlobalCurrency={setGlobalCurrency} language={language} />

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 mb-8">
            <LoanCalculatorInner />
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-200 mb-4">
              {language === 'es' ? '¿Cómo saber si puedo pagar un préstamo?' : 'How to know if I can afford a loan?'}
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {language === 'es'
                ? 'Los expertos financieros recomiendan que el total de tus deudas mensuales no supere el 30-35% de tus ingresos disponibles. Esta calculadora aplica esa regla de forma automática y te indica el monto máximo que podrías pagar cómodamente.'
                : 'Financial experts recommend that your total monthly debt payments not exceed 30-35% of your available income. This calculator applies that rule automatically and shows you the maximum amount you could comfortably pay.'}
            </p>
          </section>

          <FaqSection faqs={FAQ_PRESTAMO} language={language as 'es' | 'en'} />
        </article>
      </>
    </CurrencyContext.Provider>
  );
}