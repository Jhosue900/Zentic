// ─── CalculadoraInversion.tsx ─────────────────────────────────────────────────
// Ruta: /calculadora-de-inversion
// Calculadora de interés compuesto con aportaciones mensuales — SEO 2025
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
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

type ContributionTiming = 'beginning' | 'end';

const FAQ_INVERSION = [
  {
    q_es: '¿Qué es el interés compuesto?',
    q_en: 'What is compound interest?',
    a_es: 'El interés compuesto es el proceso por el cual los intereses generados se reinvierten y generan a su vez más intereses. Albert Einstein lo llamó "la octava maravilla del mundo".',
    a_en: 'Compound interest is the process by which generated interest is reinvested and generates more interest in turn. Albert Einstein called it "the eighth wonder of the world".',
  },
  {
    q_es: '¿Cuánto rinde invertir $10,000 en 10 años?',
    q_en: 'How much does investing $10,000 yield in 10 years?',
    a_es: 'Depende del rendimiento anual. Con un 8% anual y sin aportaciones adicionales, $10,000 se convierten en aproximadamente $21,589 en 10 años gracias al interés compuesto.',
    a_en: 'It depends on the annual return. With 8% annual return and no additional contributions, $10,000 becomes approximately $21,589 in 10 years thanks to compound interest.',
  },
  {
    q_es: '¿Cuál es la diferencia entre anualidad anticipada y vencida?',
    q_en: "What's the difference between annuity due and ordinary annuity?",
    a_es: 'En la anualidad anticipada (inicio del mes), cada aportación genera interés desde el primer día. En la vencida (fin del mes), el aporte entra al final. La anticipada produce un resultado ligeramente mayor.',
    a_en: 'In an annuity due (start of month), each contribution earns interest from day one. In an ordinary annuity (end of month), contributions are made at month end. The annuity due produces a slightly higher result.',
  },
  {
    q_es: '¿Cuánto debo invertir mensualmente para ser millonario?',
    q_en: 'How much should I invest monthly to become a millionaire?',
    a_es: 'Depende del plazo y rendimiento. Con un 8% anual, para llegar a $1,000,000 en 30 años necesitas aportar alrededor de $671 mensuales. A 20 años, el monto mensual sube a aproximadamente $1,698.',
    a_en: 'It depends on time horizon and return. At 8% annual return, to reach $1,000,000 in 30 years you need to invest about $671 monthly. Over 20 years, the monthly amount rises to approximately $1,698.',
  },
  {
    q_es: '¿Con qué frecuencia se capitaliza el interés compuesto en esta calculadora?',
    q_en: 'How often does this calculator compound interest?',
    a_es: 'Esta calculadora usa capitalización mensual, que es la frecuencia más común en productos de inversión y fondos de ahorro. Esto significa que los intereses se calculan y reinvierten cada mes.',
    a_en: 'This calculator uses monthly compounding, the most common frequency for investment products and savings funds. This means interest is calculated and reinvested each month.',
  },
];

// ── Componente interno ────────────────────────────────────────────────────────
function CompoundCalculatorInner() {
  const { symbol, currency } = useCurrency();
  const { language } = useLanguage();
  const { value: initialValue, rawValue: initialAmount, handleChange: setInitialAmount } = useFormattedInput('0', false);
  const { value: monthlyValue, rawValue: monthlyAdd,    handleChange: setMonthlyAdd    } = useFormattedInput('0', false);
  const { value: rateValue,    rawValue: rate,          handleChange: setRate          } = useFormattedInput('0', true);
  const { value: yearsValue,   rawValue: years,         handleChange: setYears         } = useFormattedInput('0', false);
  const [contributionTiming, setContributionTiming] = useState<ContributionTiming>('end');
  const [chartData,   setChartData]   = useState<Array<{ year: number; invertido: number; ganancias: number; total: number }>>([]);
  const [annualTable, setAnnualTable] = useState<Array<{ year: number; aportado: number; intereses: number; total: number }>>([]);
  const [result,      setResult]      = useState<{ finalAmount: number; totalInvested: number; totalInterest: number } | null>(null);

  useEffect(() => { calculateCompound(); }, [initialAmount, monthlyAdd, rate, years, contributionTiming]);

  const calculateCompound = () => {
    const P          = initialAmount;
    const PMT        = monthlyAdd;
    const annualRate = rate / 100;
    const yearsCount = years;
    const monthlyRate  = annualRate / 12;
    const totalMonths  = yearsCount * 12;
    const fvPrincipal  = P * Math.pow(1 + monthlyRate, totalMonths);
    let fvContributions = 0;
    if (monthlyRate > 0 && PMT > 0) {
      const annuityFactor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      fvContributions = PMT * annuityFactor;
      if (contributionTiming === 'beginning') fvContributions *= (1 + monthlyRate);
    } else if (PMT > 0) {
      fvContributions = PMT * totalMonths;
    }
    const finalAmount    = fvPrincipal + fvContributions;
    const totalInvested  = P + PMT * totalMonths;
    const totalInterest  = finalAmount - totalInvested;
    const yearlyData:  typeof chartData   = [];
    const yearlyTable: typeof annualTable = [];
    for (let year = 1; year <= yearsCount; year++) {
      const m = year * 12;
      const yFvP = P * Math.pow(1 + monthlyRate, m);
      let yFvC = 0;
      if (monthlyRate > 0 && PMT > 0) {
        const af = (Math.pow(1 + monthlyRate, m) - 1) / monthlyRate;
        yFvC = PMT * af;
        if (contributionTiming === 'beginning') yFvC *= (1 + monthlyRate);
      } else if (PMT > 0) {
        yFvC = PMT * m;
      }
      const yTotal    = yFvP + yFvC;
      const yInvested = P + PMT * m;
      yearlyData.push({ year, invertido: yInvested, ganancias: Math.max(0, yTotal - yInvested), total: yTotal });
      yearlyTable.push({ year, aportado: yInvested, intereses: Math.max(0, yTotal - yInvested), total: yTotal });
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
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {[
          { id: 'ci-initial', label: language === 'es' ? 'Monto Inicial' : 'Initial Amount',           value: initialValue, onChange: setInitialAmount, placeholder: '10.000', decimal: false },
          { id: 'ci-monthly', label: language === 'es' ? 'Aportación Mensual' : 'Monthly Contribution', value: monthlyValue, onChange: setMonthlyAdd,    placeholder: '500',    decimal: false },
          { id: 'ci-rate',    label: language === 'es' ? 'Rendimiento Anual (%)' : 'Annual Return (%)', value: rateValue,    onChange: setRate,          placeholder: '8',      decimal: true  },
          { id: 'ci-years',   label: language === 'es' ? 'Años de inversión' : 'Investment Years',      value: yearsValue,   onChange: setYears,         placeholder: '10',     decimal: false },
        ].map(({ id, label, value, onChange, placeholder, decimal }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <input
              id={id} type="text" inputMode={decimal ? 'decimal' : 'numeric'}
              value={value} onChange={onChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-100 font-mono"
              placeholder={placeholder}
            />
            {id === 'ci-rate' && (
              <p className="text-xs text-slate-500 mt-1">
                {language === 'es' ? 'Promedio histórico del mercado: ~7–10% anual' : 'Historical market average: ~7–10% annually'}
              </p>
            )}
          </div>
        ))}

        {/* Toggle timing */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            {language === 'es' ? 'Momento de la aportación mensual' : 'Monthly contribution timing'}
          </label>
          <div className="relative flex bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-6px)] rounded-lg bg-emerald-500 shadow-lg shadow-emerald-900/50 transition-transform duration-200 ease-in-out ${
                contributionTiming === 'end' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
              }`}
            />
            <button
              onClick={() => setContributionTiming('beginning')}
              className={`relative z-10 flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                contributionTiming === 'beginning' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'es' ? 'Al inicio del mes' : 'At month start'}
            </button>
            <button
              onClick={() => setContributionTiming('end')}
              className={`relative z-10 flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                contributionTiming === 'end' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'es' ? 'Al final del mes' : 'At month end'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {contributionTiming === 'beginning'
              ? (language === 'es'
                  ? 'Anualidad anticipada: cada aporte genera interés desde el primer día del mes.'
                  : 'Annuity due: each contribution earns interest from the first day of the month.')
              : (language === 'es'
                  ? 'Anualidad vencida: modelo estándar. Cada aporte entra al final del mes.'
                  : 'Ordinary annuity: standard model. Each contribution is made at month end.')}
          </p>
        </div>
      </div>

      {/* Resultados */}
      {result && chartData.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: language === 'es' ? 'Valor Final'           : 'Final Value',         value: result.finalAmount,    color: 'text-emerald-400' },
              { label: language === 'es' ? 'Total Aportado'        : 'Total Contributed',   value: result.totalInvested,  color: 'text-slate-100'   },
              { label: language === 'es' ? 'Intereses Generados'   : 'Interest Earned',     value: result.totalInterest,  color: 'text-emerald-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gradient-to-br from-emerald-950/40 to-slate-800/60 rounded-xl p-4 border border-emerald-800/50 text-center">
                <div className="text-xs text-slate-400 mb-1">{label}</div>
                <div className={`text-2xl font-bold ${color}`}>{symbol}{formatResult(value, currency)}</div>
              </div>
            ))}
          </div>

          {/* Gráfica de área */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700 mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              {language === 'es' ? 'Evolución de la inversión' : 'Investment Evolution'}
            </h3>
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
                <Area type="monotone" dataKey="total"     name={language === 'es' ? 'Valor Total'    : 'Total Value'}        stroke="#10b981" fill="url(#colorTotal)"    strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla anual */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700 mb-8">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              {language === 'es' ? 'Proyección año por año' : 'Year by Year Projection'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label={language === 'es' ? 'Proyección anual de inversión' : 'Annual investment projection'}>
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
                      <td className="py-3 px-4 text-right text-slate-300">{symbol}{formatResult(row.aportado,  currency)}</td>
                      <td className="py-3 px-4 text-right text-emerald-400">{symbol}{formatResult(row.intereses, currency)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-100">{symbol}{formatResult(row.total, currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pie chart */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              {language === 'es' ? 'Distribución final de la inversión' : 'Final Investment Distribution'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: language === 'es' ? 'Total Aportado' : 'Total Contributed', value: result.totalInvested },
                    { name: language === 'es' ? 'Intereses'      : 'Interest',          value: result.totalInterest },
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

// ── Página exportada ──────────────────────────────────────────────────────────
export function CalculadoraInversion() {
  const { language } = useLanguage();
  const [globalCurrency, setGlobalCurrency] = useState<Currency>('COP');
  const meta = CURRENCY_MAP[globalCurrency];

  const title =
    language === 'es'
      ? 'Calculadora de Interés Compuesto 2025 | Simulador de Inversión con Aportes Mensuales'
      : 'Compound Interest Calculator 2025 | Investment Simulator with Monthly Contributions';

  const description =
    language === 'es'
      ? 'Proyecta el crecimiento de tu inversión con interés compuesto. Incluye aportaciones mensuales, tabla anual y gráficas de evolución. Calcula el rendimiento de cualquier inversión gratis.'
      : 'Project your investment growth with compound interest. Includes monthly contributions, annual table, and evolution charts. Calculate investment returns for free.';

  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
    inLanguage: language === 'es' ? 'es' : 'en',
    url: 'https://zentic.app/calculadora-de-inversion',
  });

  return (
    <CurrencyContext.Provider
      value={{ currency: globalCurrency, setCurrency: setGlobalCurrency, symbol: meta?.symbol ?? '$' }}
    >
      <>
        <SEO title={title} description={description} type="SoftwareApplication" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJsonLd }} />

        <article className="max-w-5xl mx-auto px-4 sm:px-6" itemScope itemType="https://schema.org/SoftwareApplication">
          <Breadcrumb
            items={[
              { label: language === 'es' ? 'Inicio' : 'Home', href: '/' },
              { label: language === 'es' ? 'Calculadoras' : 'Calculators', href: '/calculators' },
              { label: language === 'es' ? 'Calculadora de Inversión' : 'Investment Calculator' },
            ]}
          />

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-950/60 rounded-lg border border-emerald-800/50">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {language === 'es' ? 'Capitalización mensual · Gráficas incluidas' : 'Monthly compounding · Charts included'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3" itemProp="name">
              {language === 'es' ? 'Calculadora de Interés Compuesto' : 'Compound Interest Calculator'}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed" itemProp="description">
              {language === 'es'
                ? 'Simula el crecimiento de tu inversión con aportaciones mensuales y visualiza el poder del interés compuesto año por año.'
                : 'Simulate your investment growth with monthly contributions and visualize the power of compound interest year by year.'}
            </p>
          </header>

          <CurrencySelector globalCurrency={globalCurrency} setGlobalCurrency={setGlobalCurrency} language={language} />

          <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-800 p-6 sm:p-8 mb-8">
            <CompoundCalculatorInner />
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-200 mb-4">
              {language === 'es' ? '¿Por qué usar el interés compuesto?' : 'Why use compound interest?'}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-4">
              {language === 'es'
                ? 'El interés compuesto permite que tu dinero crezca exponencialmente. A diferencia del interés simple, las ganancias generadas se suman al capital y generan nuevas ganancias en los siguientes períodos. Cuanto antes empieces a invertir, mayor será el efecto multiplicador.'
                : 'Compound interest allows your money to grow exponentially. Unlike simple interest, generated earnings are added to the principal and generate new earnings in subsequent periods. The earlier you start investing, the greater the multiplying effect.'}
            </p>
          </section>

          <FaqSection faqs={FAQ_INVERSION} language={language as 'es' | 'en'} />
        </article>
      </>
    </CurrencyContext.Provider>
  );
}