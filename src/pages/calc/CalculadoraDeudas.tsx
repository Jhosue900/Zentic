// ─── CalculadoraDeudas.tsx ────────────────────────────────────────────────────
// Ruta: /calculadora-de-deudas
// Calculadora de pago de deudas — SEO 2025
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
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

const FAQ_DEUDAS = [
  {
    q_es: '¿Cuánto tiempo tardo en pagar mi deuda?',
    q_en: 'How long will it take to pay off my debt?',
    a_es: 'Depende del monto, la tasa de interés y tu pago mensual. Ingresa los datos en esta calculadora y obtendrás el número exacto de meses y el total de intereses que pagarás.',
    a_en: 'It depends on the amount, interest rate, and your monthly payment. Enter the data in this calculator and you will get the exact number of months and total interest you will pay.',
  },
  {
    q_es: '¿Qué estrategia es mejor para pagar deudas: avalancha o bola de nieve?',
    q_en: 'Which debt payoff strategy is better: avalanche or snowball?',
    a_es: 'La estrategia de avalancha (pagar primero la deuda con mayor tasa) ahorra más en intereses. La bola de nieve (pagar primero la deuda más pequeña) genera más motivación psicológica. Matemáticamente, la avalancha siempre es más eficiente.',
    a_en: 'The avalanche strategy (paying the highest-rate debt first) saves more in interest. The snowball (paying the smallest debt first) generates more psychological motivation. Mathematically, the avalanche is always more efficient.',
  },
  {
    q_es: '¿Qué pasa si solo pago el mínimo de mi tarjeta de crédito?',
    q_en: 'What happens if I only pay the minimum on my credit card?',
    a_es: 'Pagar solo el mínimo puede alargar el pago de tu deuda por décadas y multiplicar varias veces el costo real. Por ejemplo, una deuda de $10,000 al 24% anual con pago mínimo mensual puede tardar más de 15 años en liquidarse.',
    a_en: 'Paying only the minimum can extend your debt repayment for decades and multiply the actual cost several times. For example, a $10,000 debt at 24% annual interest with minimum monthly payments can take more than 15 years to pay off.',
  },
  {
    q_es: '¿Cómo reducir el tiempo de pago de una deuda?',
    q_en: 'How to reduce the time to pay off a debt?',
    a_es: 'Las tres estrategias más efectivas son: (1) pagar más del mínimo mensual, (2) hacer pagos adicionales con ingresos extras, y (3) refinanciar a una tasa más baja. Incluso aumentar el pago mensual un 20% puede reducir el plazo a la mitad.',
    a_en: 'The three most effective strategies are: (1) pay more than the monthly minimum, (2) make additional payments with extra income, and (3) refinance to a lower rate. Even increasing your monthly payment by 20% can cut the term in half.',
  },
];

function DebtCalculatorInner() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: debtValue,    rawValue: debtAmount,     handleChange: setDebtAmount     } = useFormattedInput('0', false);
  const { value: rateValue,    rawValue: interestRate,   handleChange: setInterestRate   } = useFormattedInput('0', true);
  const { value: paymentValue, rawValue: monthlyPayment, handleChange: setMonthlyPayment } = useFormattedInput('0', false);
  const [result, setResult] = useState<{
    monthsToPay: number;
    totalInterest: number;
    totalPaid: number;
    payoffDate: string;
    strategy: string;
  } | null>(null);

  useEffect(() => { calculate(); }, [debtAmount, interestRate, monthlyPayment]);

  const calculate = () => {
    const debt        = debtAmount;
    const annualRate  = interestRate / 100;
    const monthly     = monthlyPayment;
    const monthlyRate = annualRate / 12;
    let balance       = debt;
    let months        = 0;
    let totalInterest = 0;

    while (balance > 0 && months < 600) {
      const interest       = balance * monthlyRate;
      totalInterest       += interest;
      let principalPayment = monthly - interest;
      if (principalPayment <= 0) {
        setResult({
          monthsToPay: Infinity, totalInterest: 0, totalPaid: 0, payoffDate: language === 'es' ? 'Nunca' : 'Never',
          strategy: language === 'es'
            ? `Tu pago mensual no cubre los intereses. Necesitas pagar al menos ${symbol}${formatResult(balance * monthlyRate + 1, currency)} mensuales.`
            : `Your monthly payment does not cover the interest. You need to pay at least ${symbol}${formatResult(balance * monthlyRate + 1, currency)} monthly.`,
        });
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
    setResult({
      monthsToPay: months, totalInterest, totalPaid,
      payoffDate: payoffDate.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US'),
      strategy,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="debt-amount" className="block text-sm font-medium text-slate-300 mb-2">
            {language === 'es' ? 'Monto de la Deuda' : 'Debt Amount'}
          </label>
          <input id="debt-amount" type="text" inputMode="numeric" value={debtValue} onChange={setDebtAmount}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono"
            placeholder="10.000" />
        </div>
        <div>
          <label htmlFor="debt-rate" className="block text-sm font-medium text-slate-300 mb-2">
            {language === 'es' ? 'Tasa de Interés Anual (%)' : 'Annual Interest Rate (%)'}
          </label>
          <input id="debt-rate" type="text" inputMode="decimal" value={rateValue} onChange={setInterestRate}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono"
            placeholder="24" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="debt-payment" className="block text-sm font-medium text-slate-300 mb-2">
            {language === 'es' ? 'Pago Mensual' : 'Monthly Payment'}
          </label>
          <input id="debt-payment" type="text" inputMode="numeric" value={paymentValue} onChange={setMonthlyPayment}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono"
            placeholder="500" />
        </div>
      </div>

      {result && (
        <div className="space-y-4" aria-live="polite">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">{language === 'es' ? 'Tiempo de pago' : 'Payoff Time'}</div>
              <div className="text-2xl font-bold text-emerald-400">
                {result.monthsToPay === Infinity ? '∞' : `${result.monthsToPay} ${language === 'es' ? 'meses' : 'months'}`}
              </div>
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
            {result.monthsToPay !== Infinity && (
              <p className="text-xs text-slate-400 mt-3">
                {language === 'es' ? 'Fecha estimada de pago' : 'Estimated payoff date'}: {result.payoffDate}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CalculadoraDeudas() {
  const { language } = useLanguage();
  const [globalCurrency, setGlobalCurrency] = useState<Currency>('COP');
  const meta = CURRENCY_MAP[globalCurrency];

  const title =
    language === 'es'
      ? 'Calculadora de Pago de Deudas 2025 | ¿Cuándo terminaré de pagar mi deuda?'
      : 'Debt Payoff Calculator 2025 | When Will I Pay Off My Debt?';

  const description =
    language === 'es'
      ? 'Descubre en cuántos meses pagarás tu deuda y cuánto pagarás en intereses. Estrategias para reducir el plazo de tu tarjeta de crédito o préstamo. Gratis.'
      : 'Discover how many months it will take to pay off your debt and how much interest you will pay. Strategies to reduce your credit card or loan term. Free.';

  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
    inLanguage: language === 'es' ? 'es' : 'en',
    url: 'https://zentic.app/calculadora-de-deudas',
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
              { label: language === 'es' ? 'Calculadora de Deudas' : 'Debt Payoff Calculator' },
            ]}
          />

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                <CreditCard className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {language === 'es' ? 'Tarjetas · Préstamos · Hipotecas' : 'Credit cards · Loans · Mortgages'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3" itemProp="name">
              {language === 'es' ? 'Calculadora de Pago de Deudas' : 'Debt Payoff Calculator'}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed" itemProp="description">
              {language === 'es'
                ? 'Calcula cuánto tiempo tardarás en quedar libre de deudas y cuánto pagarás en intereses según tu cuota mensual.'
                : 'Calculate how long it will take to become debt-free and how much you will pay in interest based on your monthly payment.'}
            </p>
          </header>

          <CurrencySelector globalCurrency={globalCurrency} setGlobalCurrency={setGlobalCurrency} language={language} />

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 mb-8">
            <DebtCalculatorInner />
          </div>

          <FaqSection faqs={FAQ_DEUDAS} language={language as 'es' | 'en'} />
        </article>
      </>
    </CurrencyContext.Provider>
  );
}