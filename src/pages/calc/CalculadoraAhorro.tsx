// ─── CalculadoraAhorro.tsx ────────────────────────────────────────────────────
// Ruta: /calculadora-de-ahorro
// Calculadora de meta de ahorro — SEO 2025
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
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

const FAQ_AHORRO = [
  {
    q_es: '¿Cuánto debo ahorrar al mes para mi meta?',
    q_en: 'How much should I save per month to reach my goal?',
    a_es: 'Depende de tu meta, el plazo y el rendimiento de tu ahorro. Ingresa estos datos en la calculadora y obtendrás el monto mensual exacto que necesitas ahorrar, considerando el interés compuesto.',
    a_en: 'It depends on your goal, the time frame, and your savings return. Enter these data into the calculator and you will get the exact monthly amount you need to save, factoring in compound interest.',
  },
  {
    q_es: '¿Cómo ahorrar para comprar una casa?',
    q_en: 'How to save to buy a house?',
    a_es: 'Define el monto del enganche (generalmente 10-20% del valor de la propiedad), establece un plazo realista y usa esta calculadora para saber cuánto ahorrar mensualmente. Considera un rendimiento del 4-6% si mantienes el dinero en un fondo de inversión.',
    a_en: 'Define the down payment amount (usually 10-20% of the property value), set a realistic timeline, and use this calculator to find out how much to save monthly. Consider a 4-6% return if you keep the money in an investment fund.',
  },
  {
    q_es: '¿Cómo planificar el ahorro para la jubilación?',
    q_en: 'How to plan for retirement savings?',
    a_es: 'Los expertos recomiendan ahorrar entre el 10-15% del ingreso mensual para la jubilación. Mientras más temprano empieces, menor será el porcentaje necesario gracias al interés compuesto. Un horizonte de 30 años con un 7% de rendimiento puede multiplicar tu capital hasta 7 veces.',
    a_en: 'Experts recommend saving 10-15% of monthly income for retirement. The earlier you start, the lower the percentage needed thanks to compound interest. A 30-year horizon at 7% return can multiply your capital up to 7 times.',
  },
  {
    q_es: '¿Qué rendimiento anual puedo esperar de mis ahorros?',
    q_en: 'What annual return can I expect from my savings?',
    a_es: 'Depende del instrumento: una cuenta de ahorros tradicional rinde 1-3%, un CDT o depósito a término 4-8%, un fondo indexado de acciones históricamente 7-10% anual. A mayor rendimiento, mayor riesgo.',
    a_en: 'It depends on the instrument: a traditional savings account yields 1-3%, a term deposit 4-8%, an index stock fund historically 7-10% annually. Higher return means higher risk.',
  },
];

function SavingsCalculatorInner() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: goalValue,    rawValue: goalAmount,     handleChange: setGoalAmount     } = useFormattedInput('0', false);
  const { value: monthsValue,  rawValue: months,         handleChange: setMonths         } = useFormattedInput('0', false);
  const { value: currentValue, rawValue: currentSavings, handleChange: setCurrentSavings } = useFormattedInput('0', false);
  const { value: rateValue,    rawValue: interestRate,   handleChange: setInterestRate   } = useFormattedInput('0', true);
  const [result, setResult] = useState<{
    monthlyNeeded: number;
    totalNeeded: number;
    canAchieve: boolean;
    recommendation: string;
  } | null>(null);

  useEffect(() => { calculate(); }, [goalAmount, months, currentSavings, interestRate]);

  const calculate = () => {
    const goal        = goalAmount;
    const monthsCount = months;
    const current     = currentSavings;
    const monthlyRate = (interestRate / 100) / 12;
    const remaining   = goal - current;
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

  const fields = [
    { id: 'sav-goal',    label: language === 'es' ? 'Meta de Ahorro'         : 'Savings Goal',       value: goalValue,    onChange: setGoalAmount,     placeholder: '50.000' },
    { id: 'sav-months',  label: language === 'es' ? 'Plazo (meses)'          : 'Term (months)',      value: monthsValue,  onChange: setMonths,         placeholder: '24'     },
    { id: 'sav-current', label: language === 'es' ? 'Ahorros Actuales'       : 'Current Savings',   value: currentValue, onChange: setCurrentSavings, placeholder: '5.000'  },
    { id: 'sav-rate',    label: language === 'es' ? 'Rendimiento Anual (%)' : 'Annual Return (%)',  value: rateValue,    onChange: setInterestRate,   placeholder: '4'      },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {fields.map(({ id, label, value, onChange, placeholder }) => (
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
              <div className="text-xs text-slate-400 mb-1">
                {language === 'es' ? 'Ahorro Mensual Necesario' : 'Monthly Savings Needed'}
              </div>
              <div className="text-2xl font-bold text-emerald-400">{symbol}{formatResult(result.monthlyNeeded, currency)}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
              <div className="text-xs text-slate-400 mb-1">
                {language === 'es' ? 'Faltante por Ahorrar' : 'Remaining to Save'}
              </div>
              <div className="text-xl font-bold text-slate-100">{symbol}{formatResult(result.totalNeeded, currency)}</div>
            </div>
          </div>
          <div className="bg-amber-950/40 rounded-xl p-5 border border-amber-800/50">
            <h3 className="text-sm font-semibold mb-3 text-amber-400">
              {language === 'es' ? 'Recomendación' : 'Recommendation'}
            </h3>
            <p className="text-sm text-slate-300">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function CalculadoraAhorro() {
  const { language } = useLanguage();
  const [globalCurrency, setGlobalCurrency] = useState<Currency>('COP');
  const meta = CURRENCY_MAP[globalCurrency];

  const title =
    language === 'es'
      ? 'Calculadora de Meta de Ahorro 2025 | ¿Cuánto debo ahorrar al mes?'
      : 'Savings Goal Calculator 2025 | How Much Should I Save Per Month?';

  const description =
    language === 'es'
      ? 'Calcula cuánto necesitas ahorrar mensualmente para alcanzar tu meta financiera. Incluye rendimiento de inversión. Planifica tu jubilación, viaje o compra de casa. Gratis.'
      : 'Calculate how much you need to save monthly to reach your financial goal. Includes investment returns. Plan your retirement, vacation, or home purchase. Free.';

  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
    inLanguage: language === 'es' ? 'es' : 'en',
    url: 'https://zentic.app/calculadora-de-ahorro',
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
              { label: language === 'es' ? 'Calculadora de Ahorro' : 'Savings Goal Calculator' },
            ]}
          />

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {language === 'es' ? 'Jubilación · Viaje · Casa · Emergencia' : 'Retirement · Travel · Home · Emergency'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3" itemProp="name">
              {language === 'es' ? 'Calculadora de Meta de Ahorro' : 'Savings Goal Calculator'}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed" itemProp="description">
              {language === 'es'
                ? 'Descubre exactamente cuánto debes ahorrar cada mes para alcanzar cualquier meta financiera, considerando el rendimiento de tu inversión.'
                : 'Find out exactly how much you need to save each month to reach any financial goal, factoring in your investment return.'}
            </p>
          </header>

          <CurrencySelector globalCurrency={globalCurrency} setGlobalCurrency={setGlobalCurrency} language={language} />

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 mb-8">
            <SavingsCalculatorInner />
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-200 mb-4">
              {language === 'es' ? 'Reglas de ahorro recomendadas' : 'Recommended savings rules'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { rule: '50/30/20', desc: language === 'es' ? '50% necesidades, 30% deseos, 20% ahorro' : '50% needs, 30% wants, 20% savings' },
                { rule: '10%',      desc: language === 'es' ? 'Regla básica: guardar al menos el 10% del ingreso' : 'Basic rule: save at least 10% of income' },
                { rule: '6 meses',  desc: language === 'es' ? 'Fondo de emergencia equivalente a 6 meses de gastos' : '6-month emergency fund equal to expenses' },
              ].map(({ rule, desc }) => (
                <div key={rule} className="bg-slate-800/40 rounded-xl p-4 border border-slate-700 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-2">{rule}</div>
                  <div className="text-xs text-slate-400">{desc}</div>
                </div>
              ))}
            </div>
          </section>

          <FaqSection faqs={FAQ_AHORRO} language={language as 'es' | 'en'} />
        </article>
      </>
    </CurrencyContext.Provider>
  );
}