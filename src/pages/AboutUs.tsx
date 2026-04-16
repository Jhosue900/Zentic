import { useState, useEffect } from 'react';
import { Shield, Target, Eye, Calculator, Globe, RefreshCw, TrendingUp, Lock, Users, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';

export function AboutUs() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const titleEs = 'Sobre Nosotros | Zentic – Herramientas Financieras Precisas';
  const titleEn = 'About Us | Zentic – Precision Financial Tools';
  const descriptionEs = 'Conoce Zentic: nuestra misión es democratizar el acceso a cálculos financieros precisos. Calculadoras de IVA, préstamos, interés compuesto y más. Transparencia y precisión técnica.';
  const descriptionEn = 'Learn about Zentic: our mission is to democratize access to accurate financial calculations. VAT, loans, compound interest calculators and more. Transparency and technical precision.';

  const currentTitle = language === 'es' ? titleEs : titleEn;
  const currentDescription = language === 'es' ? descriptionEs : descriptionEn;

  // Schema.org AboutPage JSON-LD
  const schemaJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: currentTitle,
    description: currentDescription,
    url: typeof window !== 'undefined' ? window.location.href : 'https://zentic.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Zentic',
      description: language === 'es' 
        ? 'Plataforma de herramientas financieras digitales para cálculos de préstamos, ahorros e impuestos.'
        : 'Digital financial tools platform for loan, savings, and tax calculations.',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://zentic.com',
      foundingYear: '2024',
      knowsAbout: ['Financial Mathematics', 'Tax Compliance', 'Investment Analysis', 'Compound Interest', 'VAT Calculation'],
    },
  });

  return (
    <>
      {/* Cambiado de 'AboutPage' a 'WebPage' que es válido */}
      <SEO title={currentTitle} description={currentDescription} type="WebPage" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJsonLd }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <header className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-sm mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Confianza y Precisión' : 'Trust & Precision'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">
            {language === 'es' ? 'Sobre Nosotros' : 'About Us'}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {language === 'es' 
              ? 'Democratizando el acceso a cálculos financieros precisos para que tomes mejores decisiones con tu dinero.'
              : 'Democratizing access to accurate financial calculations so you can make better decisions with your money.'}
          </p>
        </header>

        {/* Misión */}
        <section className="bg-gradient-to-br from-emerald-950/30 to-slate-900/60 rounded-2xl border border-emerald-800/30 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              {language === 'es' ? ' Nuestra Misión' : ' Our Mission'}
            </h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {language === 'es'
              ? 'En un mundo donde las finanzas personales se vuelven cada vez más complejas, Zentic nació con una misión clara: resolver la complejidad financiera. Desde calcular el IVA en 40+ países hasta proyectar el crecimiento de una inversión con interés compuesto, transformamos fórmulas financieras complejas (como el sistema de amortización francés para préstamos) en interfaces sencillas, rápidas y accionables. Queremos que pases menos tiempo haciendo números y más tiempo tomando mejores decisiones.'
              : 'In a world where personal finance is increasingly complex, Zentic was born with a clear mission: to solve financial complexity. From calculating VAT in 40+ countries to projecting compound interest investment growth, we transform complex financial formulas (like the French amortization system for loans) into simple, fast, and actionable interfaces. We want you to spend less time crunching numbers and more time making better decisions.'}
          </p>
        </section>

        {/* Valores */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Eye className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              {language === 'es' ? ' Nuestros Valores' : ' Our Values'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Precisión Técnica */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 hover:border-emerald-800/50 transition-all">
              <div className="p-2 rounded-lg bg-emerald-500/10 w-fit mb-3">
                <Calculator className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {language === 'es' ? 'Precisión Técnica' : 'Technical Precision'}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {language === 'es'
                  ? 'No redondeamos tus esperanzas. Nuestras calculadoras utilizan algoritmos financieros estandarizados para garantizar resultados exactos al 100%.'
                  : "We don't round up your hopes. Our calculators use standardized financial algorithms to guarantee 100% accurate results."}
              </p>
            </div>
            {/* Transparencia Radical */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 hover:border-emerald-800/50 transition-all">
              <div className="p-2 rounded-lg bg-emerald-500/10 w-fit mb-3">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {language === 'es' ? 'Transparencia Radical' : 'Radical Transparency'}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {language === 'es'
                  ? 'Somos 100% transparentes. No ocultamos comisiones ni fórmulas mágicas. Te mostramos exactamente cómo y por qué llegamos a cada resultado.'
                  : 'We are 100% transparent. We hide no fees or magic formulas. We show you exactly how and why we arrived at each result.'}
              </p>
            </div>
            {/* Accesibilidad Universal */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 hover:border-emerald-800/50 transition-all">
              <div className="p-2 rounded-lg bg-emerald-500/10 w-fit mb-3">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {language === 'es' ? 'Accesibilidad Universal' : 'Universal Accessibility'}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {language === 'es'
                  ? 'Finanzas sin fronteras. Soporte multi-moneda (USD, EUR, COP, MXN, ARS) y multi-idioma, con tasas de IVA actualizadas a 2025.'
                  : 'Finance without borders. Multi-currency (USD, EUR, COP, MXN, ARS) and multi-language support, with VAT rates updated to 2025.'}
              </p>
            </div>
          </div>
        </section>

        {/* Por qué confiar en nosotros */}
        <section className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl border border-slate-800 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              {language === 'es' ? ' ¿Por qué confiar en Zentic?' : ' Why Trust Zentic?'}
            </h2>
          </div>
          <p className="text-slate-300 mb-6 leading-relaxed">
            {language === 'es'
              ? 'La confianza se gana con datos, no con promesas. Nuestra autoridad técnica se respalda en tres pilares fundamentales:'
              : 'Trust is earned with data, not promises. Our technical authority is backed by three fundamental pillars:'}
          </p>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700">
              <Award className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  {language === 'es' ? 'Estandarización Global' : 'Global Standardization'}
                </h3>
                <p className="text-sm text-slate-400">
                  {language === 'es'
                    ? 'Nuestras fórmulas se basan en estándares financieros internacionales reconocidos, incluyendo el Sistema de Amortización Francés (cuotas fijas) y normativas impositivas oficiales de cada región (AFIP, SAT, DIAN, IRS).'
                    : 'Our formulas are based on recognized international financial standards, including the French Amortization System (fixed installments) and official tax regulations for each region (AFIP, SAT, DIAN, IRS).'}
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700">
              <RefreshCw className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  {language === 'es' ? 'Actualización Constante' : 'Continuous Updates'}
                </h3>
                <p className="text-sm text-slate-400">
                  {language === 'es'
                    ? 'Nuestros algoritmos y bases de datos (IVA por país, tasas de cambio) se actualizan periódicamente para reflejar la realidad económica 2025.'
                    : 'Our algorithms and databases (VAT by country, exchange rates) are constantly updated to reflect the 2025 economic reality.'}
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700">
              <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">
                  {language === 'es' ? 'Arquitectura Robusta' : 'Robust Architecture'}
                </h3>
                <p className="text-sm text-slate-400">
                  {language === 'es'
                    ? 'Desarrollado con tecnologías modernas (React, TypeScript), nuestro motor de cálculo minimiza el margen de error humano y ofrece visualizaciones gráficas.'
                    : 'Built with modern technologies (React, TypeScript), our calculation engine minimizes human error and offers graphic visualizations.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nota de Transparencia */}
        <section className="bg-amber-950/20 rounded-2xl border border-amber-800/30 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 shrink-0">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-2">
                {language === 'es' ? ' Nota de Transparencia' : ' Transparency Note'}
              </h2>
              <div className="text-amber-300/80 text-sm border-l-2 border-amber-500/50 pl-4 italic">
                {language === 'es'
                  ? 'Zentic es una plataforma educativa y de herramientas digitales. No somos una entidad bancaria, una institución financiera ni un asesor de inversiones certificado. Nuestro objetivo es proporcionarte los datos y el cálculo técnico para que tú, junto a tu asesor financiero de confianza, puedas tomar la mejor decisión. No gestionamos fondos, no otorgamos créditos ni realizamos transacciones bancarias.'
                  : 'Zentic is an educational digital tools platform. We are not a bank, a financial institution, or a certified investment advisor. Our goal is to provide you with the data and technical calculation so that you, together with your trusted financial advisor, can make the best decision. We do not manage funds, grant loans, or carry out banking transactions.'}
              </div>
            </div>
          </div>
        </section>

        {/* Footer cita */}
        <footer className="text-center mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            {language === 'es'
              ? 'Zentic – Empoderando tus decisiones financieras con datos, no con suposiciones.'
              : 'Zentic – Empowering your financial decisions with data, not assumptions.'}
          </p>
        </footer>
      </article>
    </>
  );
}