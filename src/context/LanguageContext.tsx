import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    'nav.home': 'Inicio',
    'nav.converter': 'Conversor de Divisas',
    'nav.calculators': 'Calculadoras',
    'nav.news': 'Noticias Financieras',
    'footer.tagline': 'Herramientas financieras · Gratis · Sin registro',
    'footer.copyright': 'Financial Tools',
    'home.hero.eyebrow': 'Herramientas Financieras',
    'home.hero.title': 'Decisiones inteligentes, datos en tiempo real',
    'home.hero.subtitle': 'Convierte divisas, calcula impuestos y sigue el mercado — todo gratis, sin registro.',
    'home.hero.cta': 'Convertir ahora',
    'home.hero.cta2': 'Ver calculadoras',
    'home.stats.currencies': 'Divisas',
    'home.stats.calculators': 'Calculadoras',
    'home.stats.free': 'Gratis',
    'home.tools.title': 'Nuestras herramientas',
    'home.tools.converter': 'Conversor de Divisas',
    'home.tools.converter.sub': 'Tipos de cambio en tiempo real',
    'home.tools.calculators': 'Calculadoras Fiscales',
    'home.tools.calculators.sub': 'IVA, Sueldo Neto e Interés Compuesto',
    'home.tools.news': 'Noticias Financieras',
    'home.tools.news.sub': 'Mantente informado del mercado',
    'home.tools.cta': 'Acceder',
    'home.trust.title': 'Confiable y Preciso',
    'home.trust.body': 'Tasas obtenidas directamente de APIs financieras actualizadas cada minuto. Sin comisiones ocultas, sin registro, sin límites.',
    'home.trust.realtime': 'API en tiempo real',
    'home.trust.nosignup': 'Sin registro',
    'home.trust.currencies': '15 divisas',
    'home.trust.free': '100% gratis',
    'converter.title': 'Conversor de Divisas',
    'converter.subtitle': 'Tipos de cambio actualizados en tiempo real',
    'converter.amount': 'Cantidad',
    'converter.from': 'De',
    'converter.to': 'A',
    'converter.result': 'Resultado',
    'converter.exchangeRates': 'Tipos de Cambio',
    'calculators.title': 'Calculadoras Financieras',
    'calculators.taxCalc': 'IVA',
    'calculators.salary': 'Salario Neto',
    'calculators.compoundCalc': 'Inversión',
    'calculators.country': 'País',
    'calculators.spain': 'España',
    'calculators.mexico': 'México',
    'calculators.colombia': 'Colombia',
    'calculators.amount': 'Monto',
    'calculators.addTax': 'Calcular con IVA',
    'calculators.removeTax': 'Quitar IVA',
    'calculators.calculate': 'Calcular',
    'calculators.gross': 'Base Imponible',
    'calculators.tax': 'IVA',
    'calculators.net': 'Total a Pagar',
    'calculators.grossSalary': 'Salario Bruto Mensual',
    'calculators.deductions': 'Deducciones',
    'calculators.netSalary': 'Salario Neto Mensual',
    'calculators.principal': 'Monto Inicial',
    'calculators.rate': 'Rendimiento Anual (%)',
    'calculators.years': 'Años',
    'calculators.compounding': 'Frecuencia',
    'calculators.monthly': 'Mensual',
    'calculators.yearly': 'Anual',
    'calculators.finalAmount': 'Valor Final',
    'calculators.interest': 'Intereses Generados',
    'calculators.year': 'Año',
    'calculators.total': 'Total',
    'news.title': 'Noticias Financieras',
    'news.subtitle': 'Mantente informado con las últimas noticias del mercado global',
    'news.readMore': 'Leer más',
  },
  en: {
    'nav.home': 'Home',
    'nav.converter': 'Currency Converter',
    'nav.calculators': 'Calculators',
    'nav.news': 'Financial News',
    'footer.tagline': 'Professional financial tools · Free · No sign-up',
    'footer.copyright': 'Professional Financial Tools',
    'home.hero.eyebrow': 'Financial Tools',
    'home.hero.title': 'Smart decisions, real-time data',
    'home.hero.subtitle': 'Convert currencies, calculate taxes and follow the market — all free, no sign-up.',
    'home.hero.cta': 'Convert now',
    'home.hero.cta2': 'See calculators',
    'home.stats.currencies': 'Currencies',
    'home.stats.calculators': 'Calculators',
    'home.stats.free': 'Free',
    'home.tools.title': 'Our tools',
    'home.tools.converter': 'Currency Converter',
    'home.tools.converter.sub': 'Real-time exchange rates',
    'home.tools.calculators': 'Financial Calculators',
    'home.tools.calculators.sub': 'VAT, Net Salary and Compound Interest',
    'home.tools.news': 'Financial News',
    'home.tools.news.sub': 'Stay up to date with the market',
    'home.tools.cta': 'Open',
    'home.trust.title': 'Reliable and Accurate',
    'home.trust.body': 'Rates sourced directly from financial APIs updated every minute. No hidden fees, no sign-up, no limits.',
    'home.trust.realtime': 'Real-time API',
    'home.trust.nosignup': 'No sign-up',
    'home.trust.currencies': '15 currencies',
    'home.trust.free': '100% free',
    'converter.title': 'Currency Converter',
    'converter.subtitle': 'Real-time exchange rates',
    'converter.amount': 'Amount',
    'converter.from': 'From',
    'converter.to': 'To',
    'converter.result': 'Result',
    'converter.exchangeRates': 'Exchange Rates',
    'calculators.title': 'Financial Calculators',
    'calculators.taxCalc': 'VAT',
    'calculators.salary': 'Net Salary',
    'calculators.compoundCalc': 'Investment',
    'calculators.country': 'Country',
    'calculators.spain': 'Spain',
    'calculators.mexico': 'Mexico',
    'calculators.colombia': 'Colombia',
    'calculators.amount': 'Amount',
    'calculators.addTax': 'Add VAT',
    'calculators.removeTax': 'Remove VAT',
    'calculators.calculate': 'Calculate',
    'calculators.gross': 'Taxable Base',
    'calculators.tax': 'VAT',
    'calculators.net': 'Total to Pay',
    'calculators.grossSalary': 'Monthly Gross Salary',
    'calculators.deductions': 'Deductions',
    'calculators.netSalary': 'Monthly Net Salary',
    'calculators.principal': 'Initial Amount',
    'calculators.rate': 'Annual Return (%)',
    'calculators.years': 'Years',
    'calculators.compounding': 'Frequency',
    'calculators.monthly': 'Monthly',
    'calculators.yearly': 'Yearly',
    'calculators.finalAmount': 'Final Amount',
    'calculators.interest': 'Interest Earned',
    'calculators.year': 'Year',
    'calculators.total': 'Total',
    'news.title': 'Financial News',
    'news.subtitle': 'Stay informed with the latest global market news',
    'news.readMore': 'Read more',
  },
};

// ✅ Función pura fuera del componente — no depende de hooks ni estado
function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('zentic-language');
    if (saved === 'es' || saved === 'en') return saved;
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  } catch {
    // localStorage bloqueado (modo privado estricto, etc.)
    return 'es';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  useEffect(() => {
    try {
      localStorage.setItem('zentic-language', language);
    } catch { /* ignorar si localStorage no está disponible */ }
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, [language]);

  // ✅ t() aplanado — busca directamente en el objeto plano, sin recursión
  //    Esto elimina cualquier posibilidad de que el split por '.' cause bugs
  const t = (key: string): string => {
    const dict = translations[language] ?? translations['es'];
    const value = dict[key];

    if (value !== undefined) return value;

    // Fallback al otro idioma
    const fallback = language === 'es' ? translations['en'][key] : translations['es'][key];
    return fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}