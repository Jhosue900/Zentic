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

import { BlockMath, InlineMath } from 'react-katex';

const FAQ_PRESTAMO = [
  {
    q_es: '¿Cuánto préstamo puedo pedir según mi sueldo y capacidad de pago?',
    q_en: 'How much loan can I get based on my salary and repayment capacity?',
    a_es: 'Determinar el monto máximo de un crédito no depende solo del ingreso bruto, sino de la capacidad de pago real, la cual se rige habitualmente por la regla del 30% que sugiere que la cuota mensual de todas tus deudas sumadas no debería exceder el treinta por ciento de tus ingresos netos disponibles después de gastos fijos; esta medida prudencial es utilizada por la mayoría de las entidades bancarias para evaluar el riesgo crediticio y asegurar que el solicitante mantenga una salud financiera estable sin comprometer sus necesidades básicas, por lo que utilizar nuestra calculadora te permite proyectar escenarios realistas donde, al ingresar tu sueldo actual, podrás visualizar qué monto de capital se ajusta a una cuota mensual responsable que evite el sobreendeudamiento y garantice una aprobación más probable por parte de las instituciones financieras.',
    a_en: 'Determining the maximum loan amount depends not only on gross income but on real repayment capacity, which is typically governed by the 30% rule suggesting that the monthly installment of all your debts combined should not exceed thirty percent of your net available income after fixed expenses; this prudential measure is used by most banking institutions to assess credit risk and ensure that the applicant maintains stable financial health without compromising basic needs, so using our calculator allows you to project realistic scenarios where, by entering your current salary, you can visualize what principal amount fits a responsible monthly payment that avoids over-indebtedness and guarantees a more likely approval from financial institutions.',
  },
  {
    q_es: '¿Qué es la regla del 30% en préstamos y por qué es importante?',
    q_en: 'What is the 30% rule in loans and why is it important?',
    a_es: 'La regla del 30% es un estándar de oro en las finanzas personales que recomienda limitar el pago de deudas —incluyendo hipotecas, tarjetas de crédito y préstamos personales— a un máximo del treinta por ciento de los ingresos mensuales netos para prevenir el estrés financiero y asegurar un margen de maniobra ante imprevistos; seguir este principio no solo facilita la obtención de mejores tasas de interés al presentar un perfil de riesgo bajo ante los bancos, sino que también permite mantener una capacidad de ahorro constante y un flujo de caja saludable, convirtiendo a esta calculadora en una guía estratégica para evaluar si un compromiso financiero nuevo es sostenible a largo plazo o si es necesario ajustar el plazo del crédito para reducir la carga mensual sobre el presupuesto familiar.',
    a_en: 'The 30% rule is a standard financial guideline recommending that no more than 30% of available income be allocated to debt payments. It helps maintain a healthy budget and avoid over-indebtedness.',
  },
  {
    q_es: '¿Qué diferencia hay entre un préstamo hipotecario y uno personal?',
    q_en: "What's the difference between a mortgage and a personal loan?",
    a_es: 'La diferencia principal entre un crédito hipotecario y uno personal reside en la garantía y el destino de los fondos, donde el préstamo hipotecario utiliza el bien inmueble como colateral, lo que permite a las entidades financieras ofrecer plazos extensos de hasta 30 años y tasas de interés considerablemente más bajas al reducir el riesgo de impago; por el contrario, un préstamo personal suele ser "quirografario" o sin garantía real, basándose únicamente en la reputación crediticia del solicitante, lo que se traduce en plazos de devolución mucho más cortos y tasas de interés más elevadas para compensar el mayor riesgo asumido por el banco, haciendo que el uso de una calculadora comparativa sea vital para entender cuál de estas opciones se alinea mejor con tus objetivos de liquidez y capacidad de inversión patrimonial.',
    a_en: "The main difference between a mortgage and a personal loan lies in the collateral and the purpose of the funds, where the mortgage loan uses the real estate property as collateral, allowing financial institutions to offer long terms of up to 30 years and considerably lower interest rates by reducing the risk of default; conversely, a personal loan is usually 'unsecured' or without physical collateral, based solely on the applicant's credit reputation, which translates into much shorter repayment terms and higher interest rates to compensate for the higher risk taken by the bank, making the use of a comparative calculator vital to understand which of these options best aligns with your liquidity goals and wealth investment capacity.",
  },
  {
    q_es: '¿Cómo afectan los pagos anticipados al costo total de mi préstamo?',
    q_en: "How do prepayments affect the total cost of my loan?",
    a_es: 'Realizar pagos anticipados o abonos a capital es una de las estrategias más efectivas para reducir el costo financiero de un préstamo, ya que en el sistema de amortización francés, los intereses se calculan siempre sobre el saldo insoluto; esto significa que al reducir el capital principal de forma prematura, disminuyes la base sobre la cual se aplicará la tasa de interés en todos los meses restantes, lo que puede resultar en un ahorro significativo de dinero y en una reducción drástica del tiempo de vida del crédito, siendo fundamental verificar previamente si tu contrato bancario permite estas aportaciones sin penalizaciones por pago anticipado, ya que optimizar el flujo de caja mediante abonos estratégicos puede ser la diferencia entre pagar el doble de lo prestado o liquidar la deuda de forma eficiente y económica.',
    a_en: "Making prepayments or principal payments is one of the most effective strategies to reduce the financial cost of a loan, as in the French amortization system, interest is always calculated on the outstanding balance; this means that by reducing the principal capital prematurely, you decrease the base on which the interest rate will be applied in all remaining months, which can result in significant money savings and a drastic reduction in the total life of the credit, being essential to previously verify if your bank contract allows these contributions without prepayment penalties, as optimizing cash flow through strategic payments can be the difference between paying double what was borrowed or settling the debt efficiently and economically.",
  },
  {
    q_es: '¿Qué es mejor para un crédito, una tasa de interés fija o una tasa variable?',
    q_en: "What is better for a loan, a fixed interest rate or a variable rate?",
    a_es: 'La elección entre una tasa fija y una tasa variable depende principalmente de tu tolerancia al riesgo y de las proyecciones económicas del mercado, donde la tasa fija te ofrece la seguridad de mantener una cuota mensual idéntica durante todo el plazo del préstamo, protegiéndote contra aumentos en la inflación o cambios en las políticas monetarias del banco central, mientras que la tasa variable suele iniciar con un porcentaje más bajo pero está sujeta a fluctuaciones periódicas según índices de referencia, lo que podría beneficiarte si las tasas bajan pero representa un riesgo de incremento en tus pagos mensuales si el entorno económico se vuelve inestable; por lo tanto, para préstamos a largo plazo como las hipotecas, la tasa fija suele ser la opción preferida por las familias que buscan estabilidad presupuestaria, mientras que la tasa variable puede ser atractiva en créditos de corto plazo donde la exposición al cambio es menor.',
    a_en: "The choice between a fixed and a variable interest rate mainly depends on your risk tolerance and economic projections, where the fixed rate offers the security of maintaining the same monthly payment throughout the loan term, protecting you against inflation increases or changes in the central bank's monetary policies, while the variable rate usually starts with a lower percentage but is subject to periodic fluctuations according to reference indices, which could benefit you if rates decrease but represents a risk of increase in your monthly payments if the economic environment becomes unstable; therefore, for long-term loans like mortgages, the fixed rate is usually the preferred option for families seeking budgetary stability, while the variable rate can be attractive for short-term credits where exposure to change is lower.",
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

        <article className="max-w-3xl mx-auto py-6 px-4 sm:px-6" itemScope itemType="https://schema.org/SoftwareApplication">
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