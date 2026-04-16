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
    q_es: '¿Cuánto debo ahorrar al mes para alcanzar mi meta financiera?',
    q_en: 'How much should I save per month to reach my financial goal?',
    a_es: 'Determinar el ahorro mensual ideal requiere un análisis de tres factores: el monto total de la meta, el horizonte de tiempo y la tasa de rendimiento esperada; bajo una estrategia de interés compuesto, tus aportaciones mensuales no solo se acumulan, sino que generan rendimientos que a su vez producen más ganancias, permitiéndote alcanzar objetivos ambiciosos con un esfuerzo menor si extiendes el plazo de ahorro, por lo que esta calculadora es la herramienta perfecta para ajustar tus variables y encontrar el equilibrio entre tu capacidad de pago actual y el tiempo que estás dispuesto a esperar para capitalizar tus sueños.',
    a_en: 'Determining the ideal monthly savings requires an analysis of three factors: the total goal amount, the time horizon, and the expected rate of return; under a compound interest strategy, your monthly contributions not only accumulate but generate returns that in turn produce more earnings, allowing you to reach ambitious goals with less effort if you extend the savings term, making this calculator the perfect tool to adjust your variables and find the balance between your current payment capacity and the time you are willing to wait to capitalize on your dreams.',
  },
  {
    q_es: '¿Cómo puedo ahorrar efectivamente para comprar una casa?',
    q_en: 'How can I effectively save to buy a house?',
    a_es: 'El primer paso para adquirir una vivienda es asegurar el monto del enganche, que suele oscilar entre el 10% y el 20% del valor total de la propiedad, además de considerar un 5% adicional para gastos notariales y de escrituración; al planificar este ahorro, es vital separar el capital de tu cuenta corriente y colocarlo en instrumentos de bajo riesgo que ofrezcan rendimientos reales superiores a la inflación, permitiendo que el tiempo trabaje a tu favor mientras utilizas esta calculadora para proyectar cuántos meses te tomará reunir el capital necesario según tu capacidad de ahorro mensual y el crecimiento proyectado de tu inversión.',
    a_en: 'The first step to purchasing a home is securing the down payment amount, which typically ranges from 10% to 20% of the total property value, plus an additional 5% for closing costs and legal fees; when planning this saving, it is vital to separate the capital from your checking account and place it in low-risk instruments that offer real returns above inflation, allowing time to work in your favor while using this calculator to project how many months it will take to gather the necessary capital based on your monthly savings capacity and the projected growth of your investment.',
  },
  {
    q_es: '¿Cómo planificar correctamente el ahorro para la jubilación?',
    q_en: 'How to correctly plan for retirement savings?',
    a_es: 'La planificación del retiro se basa en la tasa de reemplazo, que es el porcentaje de tu sueldo actual que necesitarás para mantener tu estilo de vida en el futuro, recomendándose ahorrar sistemáticamente entre el 10% y el 15% de tus ingresos netos desde una edad temprana; la gran ventaja del ahorro previsional es el horizonte de largo plazo, donde el interés compuesto tiene su máximo impacto, logrando que aportaciones moderadas en la juventud se transformen en fondos sustanciales al final de la vida laboral, por lo cual usar esta calculadora te ayudará a visualizar si tu ritmo actual de ahorro es suficiente o si necesitas ajustar tu portafolio hacia instrumentos con mayores rendimientos para asegurar un retiro digno.',
    a_en: 'Retirement planning is based on the replacement rate, which is the percentage of your current salary that you will need to maintain your lifestyle in the future, recommending systematically saving between 10% and 15% of your net income starting from an early age; the great advantage of pension savings is the long-term horizon, where compound interest has its maximum impact, ensuring that moderate contributions in youth transform into substantial funds at the end of your working life, which is why using this calculator will help you visualize if your current savings rate is sufficient or if you need to adjust your portfolio toward instruments with higher returns to ensure a dignified retirement.',
  },
  {
    q_es: '¿Qué rendimiento anual puedo esperar realmente de mis ahorros?',
    q_en: 'What annual return can I actually expect from my savings?',
    a_es: 'El rendimiento de tus ahorros está intrínsecamente ligado al riesgo que estés dispuesto a asumir: mientras que las cuentas de ahorro tradicionales y depósitos a término (CDT) ofrecen seguridad pero retornos bajos que apenas cubren la inflación (1-5%), los fondos indexados y las acciones históricamente han entregado rendimientos del 7% al 10% anual a largo plazo, asumiendo una mayor volatilidad; entender esta relación riesgo-beneficio es clave al usar nuestra calculadora, ya que te permite simular escenarios conservadores, moderados o agresivos para entender cómo la elección del instrumento financiero puede acortar años de trabajo o multiplicar exponencialmente tu patrimonio final.',
    a_en: 'The return on your savings is intrinsically linked to the risk you are willing to take: while traditional savings accounts and certificates of deposit (CD) offer security but low returns that barely cover inflation (1-5%), index funds and stocks have historically delivered returns of 7% to 10% annually over the long term, assuming greater volatility; understanding this risk-reward relationship is key when using our calculator, as it allows you to simulate conservative, moderate, or aggressive scenarios to understand how the choice of financial instrument can shorten years of work or exponentially multiply your final wealth.',
  },
  {
    q_es: '¿Qué es un fondo de emergencia y cuánto dinero debería tener ahorrado?',
    q_en: 'What is an emergency fund and how much money should I have saved?',
    a_es: 'Un fondo de emergencia es un colchón financiero destinado exclusivamente a cubrir imprevistos como gastos médicos, reparaciones urgentes o la pérdida del empleo, y su objetivo es evitar que tengas que recurrir a deudas con intereses altos en momentos de crisis; la mayoría de los asesores financieros recomiendan que este fondo cubra entre tres y seis meses de tus gastos fijos mensuales, por lo que utilizar esta calculadora te permitirá establecer una meta clara y un plan de ahorro progresivo para construir esta red de seguridad sin comprometer tu presupuesto diario, garantizando que tu estabilidad financiera no se vea afectada ante cualquier eventualidad externa.',
    a_en: 'An emergency fund is a financial cushion strictly intended to cover unforeseen events such as medical expenses, urgent repairs, or job loss, and its goal is to prevent you from having to resort to high-interest debt in times of crisis; most financial advisors recommend that this fund cover between three and six months of your fixed monthly expenses, so using this calculator will allow you to set a clear goal and a progressive savings plan to build this safety net without compromising your daily budget, ensuring that your financial stability is not affected by any external eventuality.',
  },
  {
    q_es: '¿Cómo afecta la inflación a mis ahorros y cómo puedo protegerme?',
    q_en: 'How does inflation affect my savings and how can I protect myself?',
    a_es: 'La inflación es el aumento sostenido de los precios que erosiona el poder adquisitivo de tu dinero con el tiempo, lo que significa que una cantidad ahorrada hoy comprará menos bienes en el futuro; para protegerte, es crucial que tus ahorros se coloquen en instrumentos que ofrezcan una tasa de rendimiento superior a la inflación proyectada, convirtiendo el ahorro estático en inversión activa, y al utilizar nuestra calculadora, puedes ajustar la tasa de rendimiento esperada para visualizar cómo el crecimiento exponencial del interés compuesto puede no solo preservar el valor de tu capital, sino incrementarlo significativamente en términos reales a pesar del entorno inflacionario.',
    a_en: 'Inflation is the sustained increase in prices that erodes the purchasing power of your money over time, meaning that an amount saved today will buy fewer goods in the future; to protect yourself, it is crucial that your savings are placed in instruments that offer a rate of return higher than projected inflation, turning static savings into active investment, and by using our calculator, you can adjust the expected rate of return to visualize how the exponential growth of compound interest can not only preserve the value of your capital but significantly increase it in real terms despite the inflationary environment.',
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

        <article className="max-w-3xl mx-auto py-6 px-4 sm:px-6" itemScope itemType="https://schema.org/SoftwareApplication">
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