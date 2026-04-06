// ─── CalculatorHub.tsx ────────────────────────────────────────────────────────
// Ruta: /calculators
// Hub/índice de todas las calculadoras financieras — SEO 2025
// Sirve como página pilar con internal linking hacia cada calculadora
// ─────────────────────────────────────────────────────────────────────────────

import { Calculator, TrendingUp, Home, CreditCard, Target, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SEO } from '../../components/SEO';
import { navigate } from '../../router/Router';

interface CalcCard {
  icon: React.ReactNode;
  slug: string;
  title_es: string;
  title_en: string;
  desc_es: string;
  desc_en: string;
  tags_es: string[];
  tags_en: string[];
  color: string;
}

const CALC_CARDS: CalcCard[] = [
  {
    icon: <Calculator className="w-6 h-6" />,
    slug: '/calculadora-de-iva',
    title_es: 'Calculadora de IVA',
    title_en: 'VAT Calculator',
    desc_es: 'Calcula IVA, IGV, GST o impuesto al consumo para más de 40 países. Agrega o quita el impuesto incluido.',
    desc_en: 'Calculate VAT, GST, or sales tax for 40+ countries. Add or remove included tax.',
    tags_es: ['México 16%', 'Colombia 19%', 'Chile 19%', 'Argentina 21%', 'España 21%'],
    tags_en: ['Mexico 16%', 'Colombia 19%', 'Chile 19%', 'Argentina 21%', 'Spain 21%'],
    color: 'from-emerald-600 to-teal-600',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    slug: '/calculadora-de-inversion',
    title_es: 'Calculadora de Inversión',
    title_en: 'Investment Calculator',
    desc_es: 'Proyecta el crecimiento de tu inversión con interés compuesto. Incluye aportes mensuales y gráficas anuales.',
    desc_en: 'Project investment growth with compound interest. Includes monthly contributions and annual charts.',
    tags_es: ['Interés compuesto', 'Aportes mensuales', 'Gráficas', 'Tabla anual'],
    tags_en: ['Compound interest', 'Monthly contributions', 'Charts', 'Annual table'],
    color: 'from-blue-600 to-indigo-600',
  },
  {
    icon: <Home className="w-6 h-6" />,
    slug: '/calculadora-de-prestamo',
    title_es: 'Capacidad de Préstamo',
    title_en: 'Loan Affordability',
    desc_es: '¿Cuánto préstamo puedes pagar? Aplica la regla del 30% sobre tus ingresos disponibles automáticamente.',
    desc_en: 'How much loan can you afford? Automatically applies the 30% rule on your available income.',
    tags_es: ['Hipotecario', 'Personal', 'Regla del 30%', 'Cuota mensual'],
    tags_en: ['Mortgage', 'Personal loan', '30% rule', 'Monthly payment'],
    color: 'from-violet-600 to-purple-600',
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    slug: '/calculadora-de-deudas',
    title_es: 'Pago de Deudas',
    title_en: 'Debt Payoff',
    desc_es: '¿Cuándo terminarás de pagar tu deuda? Calcula el plazo y los intereses totales según tu cuota mensual.',
    desc_en: 'When will you pay off your debt? Calculate the term and total interest based on your monthly payment.',
    tags_es: ['Tarjeta de crédito', 'Plazo de pago', 'Intereses totales', 'Estrategias'],
    tags_en: ['Credit card', 'Payment term', 'Total interest', 'Strategies'],
    color: 'from-rose-600 to-pink-600',
  },
  {
    icon: <Target className="w-6 h-6" />,
    slug: '/calculadora-de-ahorro',
    title_es: 'Meta de Ahorro',
    title_en: 'Savings Goal',
    desc_es: '¿Cuánto debes ahorrar cada mes para alcanzar tu meta? Calcula con rendimiento incluido.',
    desc_en: 'How much do you need to save monthly to reach your goal? Calculates with investment returns included.',
    tags_es: ['Jubilación', 'Compra de casa', 'Viaje', 'Fondo de emergencia'],
    tags_en: ['Retirement', 'Home purchase', 'Travel', 'Emergency fund'],
    color: 'from-amber-600 to-orange-600',
  },
];

const FAQ_HUB = [
  {
    q_es: '¿Qué calculadoras financieras están disponibles?',
    q_en: 'What financial calculators are available?',
    a_es: 'Tenemos 5 calculadoras: IVA (40+ países), interés compuesto con aportes mensuales, capacidad de préstamo con regla del 30%, pago de deudas y meta de ahorro. Todas gratis y sin registro.',
    a_en: 'We have 5 calculators: VAT (40+ countries), compound interest with monthly contributions, loan affordability with the 30% rule, debt payoff, and savings goal. All free and no registration.',
  },
  {
    q_es: '¿Las calculadoras funcionan para todos los países?',
    q_en: 'Do the calculators work for all countries?',
    a_es: 'La calculadora de IVA soporta 40+ países incluyendo toda Latinoamérica, España, Europa, Asia y estados de EE.UU. Las demás calculadoras son independientes de la región y soportan múltiples monedas.',
    a_en: 'The VAT calculator supports 40+ countries including all of Latin America, Spain, Europe, Asia, and US states. The other calculators are region-independent and support multiple currencies.',
  },
  {
    q_es: '¿Son precisas las calculadoras financieras?',
    q_en: 'Are the financial calculators accurate?',
    a_es: 'Sí. Las fórmulas financieras utilizadas son estándar: capitalización mensual para interés compuesto, amortización francesa para préstamos, y tasas de IVA verificadas y actualizadas a 2025.',
    a_en: 'Yes. The financial formulas used are standard: monthly compounding for compound interest, French amortization for loans, and VAT rates verified and updated for 2025.',
  },
];

export function CalculatorHub() {
  const { language } = useLanguage();

  const title =
    language === 'es'
      ? 'Calculadoras Financieras Gratis 2025 | IVA, Inversión, Préstamo, Deudas, Ahorro'
      : 'Free Financial Calculators 2025 | VAT, Investment, Loan, Debt, Savings';

  const description =
    language === 'es'
      ? 'Suite completa de calculadoras financieras gratis: IVA para 40+ países, interés compuesto, capacidad de préstamo, pago de deudas y metas de ahorro. Actualizadas 2025.'
      : 'Complete suite of free financial calculators: VAT for 40+ countries, compound interest, loan affordability, debt payoff, and savings goals. Updated 2025.';

  // Schema CollectionPage + ItemList para Google
  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: 'https://zentic.app/calculators',
    inLanguage: language === 'es' ? 'es' : 'en',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: CALC_CARDS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: language === 'es' ? c.title_es : c.title_en,
        url: `https://zentic.app${c.slug}`,
        description: language === 'es' ? c.desc_es : c.desc_en,
      })),
    },
  });

  const faqSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_HUB.map(({ q_es, q_en, a_es, a_en }) => ({
      '@type': 'Question',
      name: language === 'es' ? q_es : q_en,
      acceptedAnswer: { '@type': 'Answer', text: language === 'es' ? a_es : a_en },
    })),
  });

  return (
    <>
      <SEO title={title} description={description} type="WebPage" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />

      <article className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <li>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-emerald-400 transition-colors">
                {language === 'es' ? 'Inicio' : 'Home'}
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <span>/</span>
              <span className="text-slate-300">{language === 'es' ? 'Calculadoras' : 'Calculators'}</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            {language === 'es' ? 'Calculadoras Financieras' : 'Financial Calculators'}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            {language === 'es'
              ? 'Herramientas gratuitas para tomar mejores decisiones financieras: IVA, inversiones, préstamos, deudas y metas de ahorro. Actualizadas 2025.'
              : 'Free tools to make better financial decisions: VAT, investments, loans, debt, and savings goals. Updated 2025.'}
          </p>
        </header>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CALC_CARDS.map((card) => (
            <a
              key={card.slug}
              href={card.slug}
              onClick={(e) => { e.preventDefault(); navigate(card.slug); }}
              className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all duration-200 flex flex-col"
              aria-label={language === 'es' ? card.title_es : card.title_en}
            >
              {/* Ícono */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {card.icon}
              </div>

              {/* Título */}
              <h2 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">
                {language === 'es' ? card.title_es : card.title_en}
              </h2>

              {/* Descripción */}
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                {language === 'es' ? card.desc_es : card.desc_en}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(language === 'es' ? card.tags_es : card.tags_en).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium group-hover:gap-2.5 transition-all duration-200">
                {language === 'es' ? 'Usar calculadora' : 'Use calculator'}
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Sección editorial SEO */}
        <section className="mb-10 bg-slate-900/40 rounded-2xl border border-slate-800 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-200 mb-4">
            {language === 'es'
              ? '¿Por qué usar calculadoras financieras en línea?'
              : 'Why use online financial calculators?'}
          </h2>
          <p className="text-slate-400 leading-relaxed mb-4">
            {language === 'es'
              ? 'Las calculadoras financieras te permiten tomar decisiones informadas sobre tus finanzas personales. Ya sea calcular el IVA de una factura, proyectar el crecimiento de tus inversiones, evaluar si puedes asumir un préstamo, o trazar un plan para salir de deudas, contar con herramientas precisas marca la diferencia.'
              : 'Financial calculators allow you to make informed decisions about your personal finances. Whether calculating VAT on an invoice, projecting investment growth, evaluating whether you can take on a loan, or mapping a plan to get out of debt, having precise tools makes a difference.'}
          </p>
          <p className="text-slate-400 leading-relaxed">
            {language === 'es'
              ? 'Todas nuestras calculadoras son gratuitas, no requieren registro y están actualizadas con las tasas vigentes de 2025. Disponibles en español e inglés para usuarios de Latinoamérica, España y EE.UU.'
              : 'All our calculators are free, require no registration, and are updated with current 2025 rates. Available in Spanish and English for users in Latin America, Spain, and the US.'}
          </p>
        </section>

        {/* FAQ */}
        <section aria-label={language === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}>
          <h2 className="text-xl font-bold text-slate-200 mb-5">
            {language === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
          </h2>
          <div className="space-y-4">
            {FAQ_HUB.map(({ q_es, q_en, a_es, a_en }) => (
              <details
                key={language === 'es' ? q_es : q_en}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 group"
              >
                <summary className="cursor-pointer font-medium text-slate-200 list-none flex justify-between items-center">
                  {language === 'es' ? q_es : q_en}
                  <span className="text-emerald-400 ml-4 text-lg group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {language === 'es' ? a_es : a_en}
                </p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}