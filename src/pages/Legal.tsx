// src/pages/Legal.tsx
import { useParams } from '../router/Router';
import { useLanguage } from '../context/LanguageContext';
import { SEO } from '../components/SEO';
import { Shield, FileText, AlertTriangle, Scale, Cookie, UserCheck, Smartphone, ExternalLink } from 'lucide-react';

export function Legal() {
  const params = useParams();
  const { language } = useLanguage();
  
  // Debug: ver qué parámetros está recibiendo
  console.log('Params recibidos:', params);
  
  // El id viene de la ruta /:id en App.tsx
  const id = params?.id;
  
  console.log('ID extraído:', id);

  const getTitle = () => {
    if (id === 'privacy') return language === 'es' ? 'Política de Privacidad' : 'Privacy Policy';
    if (id === 'terms') return language === 'es' ? 'Términos de Servicio' : 'Terms of Service';
    if (id === 'disclaimer') return language === 'es' ? 'Aviso Legal y Financiero' : 'Legal & Financial Disclaimer';
    return language === 'es' ? 'Información Legal' : 'Legal Information';
  };

  const getIcon = () => {
    if (id === 'privacy') return <Shield className="w-12 h-12 text-emerald-400" />;
    if (id === 'terms') return <FileText className="w-12 h-12 text-emerald-400" />;
    if (id === 'disclaimer') return <AlertTriangle className="w-12 h-12 text-emerald-400" />;
    return <Scale className="w-12 h-12 text-emerald-400" />;
  };

  const renderContent = () => {
    if (id === 'privacy') return <PrivacyPolicy language={language} />;
    if (id === 'terms') return <TermsOfService language={language} />;
    if (id === 'disclaimer') return <FinancialDisclaimer language={language} />;
    return <NotFound language={language} />;
  };

  const seoTitle = `${getTitle()} | Zentic`;
  const seoDescription = language === 'es'
    ? 'Información legal y política de privacidad de Zentic. Protegemos tus datos y cumplimos con las normativas aplicables.'
    : 'Legal information and privacy policy of Zentic. We protect your data and comply with applicable regulations.';

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} type="WebPage" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">{getTitle()}</h1>
          <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          <p className="text-slate-400 mt-4 text-sm">
            {language === 'es' ? 'Última actualización: 5 de abril de 2026' : 'Last updated: April 5, 2026'}
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-800 p-6 sm:p-8">
          <div className="prose prose-invert prose-slate max-w-none">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

function PrivacyPolicy({ language }: { language: 'es' | 'en' }) {
  if (language === 'es') {
    return (
      <>
        <h2>1. Información General</h2>
        <p>
          En Zentic ("nosotros", "nuestro", "la plataforma"), nos comprometemos a proteger tu privacidad. 
          Esta Política de Privacidad explica cómo manejamos la información cuando utilizas nuestras herramientas 
          financieras gratuitas en <a href="https://zentic-iota.vercel.app" className="text-emerald-400 hover:text-emerald-300">zentic-iota.vercel.app</a>.
        </p>

        <h2>2. Datos que Recopilamos</h2>
        <p>
          <strong className="text-emerald-400">NO recopilamos datos personales sensibles.</strong> No solicitamos nombres, 
          direcciones, números de teléfono, información bancaria ni documentos de identidad.
        </p>
        <p>La información que podemos recopilar incluye:</p>
        <ul>
          <li><strong>Datos de uso anónimos:</strong> Páginas visitadas, tiempo de uso, interacciones con calculadoras.</li>
          <li><strong>Preferencias de idioma:</strong> Guardamos tu selección de idioma (es/en) en localStorage.</li>
          <li><strong>Datos de sesión:</strong> Temporalmente mientras usas nuestras calculadoras (no se almacenan).</li>
        </ul>

        <h2>3. Google AdSense y Cookies</h2>
        <p>
          Utilizamos Google AdSense para mostrar anuncios relevantes. Google puede utilizar cookies para personalizar 
          los anuncios basándose en tu visita a nuestro sitio y otros sitios web.
        </p>
        <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-emerald-400">
          <p className="flex items-start gap-2">
            <Cookie className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Tipos de cookies que utilizamos:</strong><br />
              - Cookies técnicas (necesarias para el funcionamiento)<br />
              - Cookies de preferencias (idioma guardado)<br />
              - Cookies de análisis (Google Analytics, si se implementa)<br />
              - Cookies de publicidad (Google AdSense)
            </span>
          </p>
        </div>
        <p>
          Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador. 
          Al usar nuestro sitio, aceptas el uso de cookies según esta política.
        </p>

        <h2>4. Almacenamiento Local</h2>
        <p>
          Utilizamos localStorage para guardar:
        </p>
        <ul>
          <li>Tu preferencia de idioma (zentic-language)</li>
          <li>Preferencias de calculadoras (opcional)</li>
        </ul>
        <p>
          Esta información permanece solo en tu dispositivo y no es accesible por nosotros.
        </p>

        <h2>5. Enlaces a Terceros</h2>
        <p>
          Nuestro sitio puede contener enlaces a sitios externos (noticias financieras, fuentes de datos). 
          No somos responsables por las prácticas de privacidad de estos sitios.
        </p>

        <h2>6. Menores de Edad</h2>
        <p>
          Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos conscientemente 
          información de menores.
        </p>

        <h2>7. Cambios a esta Política</h2>
        <p>
          Podemos actualizar esta política ocasionalmente. La fecha de "última actualización" indica 
          cuándo se realizaron los últimos cambios.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta política, contáctanos a través de nuestro repositorio de GitHub 
          o utiliza los canales de soporte indicados en el sitio.
        </p>
      </>
    );
  }

  // English version
  return (
    <>
      <h2>1. General Information</h2>
      <p>
        At Zentic ("we", "our", "the platform"), we are committed to protecting your privacy. 
        This Privacy Policy explains how we handle information when you use our free financial tools 
        at <a href="https://zentic-iota.vercel.app" className="text-emerald-400 hover:text-emerald-300">zentic-iota.vercel.app</a>.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        <strong className="text-emerald-400">We DO NOT collect sensitive personal data.</strong> We do not request names, 
        addresses, phone numbers, banking information, or identification documents.
      </p>
      <p>Information we may collect includes:</p>
      <ul>
        <li><strong>Anonymous usage data:</strong> Pages visited, time spent, calculator interactions.</li>
        <li><strong>Language preferences:</strong> We save your language selection (es/en) in localStorage.</li>
        <li><strong>Session data:</strong> Temporarily while using our calculators (not stored).</li>
      </ul>

      <h2>3. Google AdSense and Cookies</h2>
      <p>
        We use Google AdSense to display relevant advertisements. Google may use cookies to personalize 
        ads based on your visit to our site and other websites.
      </p>
      <div className="bg-slate-800/50 p-4 rounded-lg my-4 border-l-4 border-emerald-400">
        <p className="flex items-start gap-2">
          <Cookie className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Types of cookies we use:</strong><br />
            - Technical cookies (necessary for operation)<br />
            - Preference cookies (saved language)<br />
            - Analytics cookies (Google Analytics, if implemented)<br />
            - Advertising cookies (Google AdSense)
          </span>
        </p>
      </div>
      <p>
        You can manage your cookie preferences through your browser settings. 
        By using our site, you consent to the use of cookies in accordance with this policy.
      </p>

      <h2>4. Local Storage</h2>
      <p>
        We use localStorage to save:
      </p>
      <ul>
        <li>Your language preference (zentic-language)</li>
        <li>Calculator preferences (optional)</li>
      </ul>
      <p>
        This information remains only on your device and is not accessible by us.
      </p>

      <h2>5. Third-Party Links</h2>
      <p>
        Our site may contain links to external sites (financial news, data sources). 
        We are not responsible for the privacy practices of these sites.
      </p>

      <h2>6. Minors</h2>
      <p>
        Our services are not directed to minors under 13 years of age. We do not knowingly 
        collect information from minors.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this policy occasionally. The "last updated" date indicates 
        when the latest changes were made.
      </p>

      <h2>8. Contact</h2>
      <p>
        If you have questions about this policy, contact us through our GitHub repository 
        or use the support channels indicated on the site.
      </p>
    </>
  );
}

function TermsOfService({ language }: { language: 'es' | 'en' }) {
  if (language === 'es') {
    return (
      <>
        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al acceder y usar Zentic, aceptas cumplir con estos Términos de Servicio. Si no estás de acuerdo, 
          por favor no utilices nuestra plataforma.
        </p>

        <h2>2. Descripción del Servicio</h2>
        <p>
          Zentic proporciona herramientas financieras gratuitas incluyendo:
        </p>
        <ul>
          <li>Conversor de divisas en tiempo real</li>
          <li>Calculadoras fiscales (IVA, Sueldo Neto)</li>
          <li>Calculadora de interés compuesto</li>
          <li>Agregador de noticias financieras</li>
        </ul>
        <p>
          Todas nuestras herramientas son <strong className="text-emerald-400">100% gratuitas</strong> y no requieren registro.
        </p>

        <h2>3. Propiedad Intelectual</h2>
        <p>
          Todo el código, diseño, logotipos y contenido original de Zentic está protegido por derechos de autor. 
          El nombre "Zentic" y nuestro logotipo son marcas registradas.
        </p>
        <p>
          El código fuente está disponible para revisión pública, pero no autorizamos su copia o redistribución 
          sin atribución adecuada.
        </p>

        <h2>4. Uso Permitido</h2>
        <p>
          Puedes usar Zentic para:
        </p>
        <ul>
          <li>Uso personal y profesional legítimo</li>
          <li>Consultas financieras informativas</li>
          <li>Educación y aprendizaje</li>
        </ul>
        <p>
          <strong className="text-red-400">No está permitido:</strong>
        </p>
        <ul>
          <li>Uso automatizado (bots, scraping) sin autorización</li>
          <li>Intentar eludir nuestros sistemas o sobrecargar el servidor</li>
          <li>Usar nuestros datos para competir directamente con Zentic</li>
        </ul>

        <h2>5. Limitación de Responsabilidad</h2>
        <p>
          Zentic se proporciona "tal cual". No garantizamos:
        </p>
        <ul>
          <li>Disponibilidad ininterrumpida del servicio</li>
          <li>Precisión absoluta de los datos (especialmente tipos de cambio)</li>
          <li>Ausencia de errores técnicos</li>
        </ul>

        <h2>6. Modificaciones del Servicio</h2>
        <p>
          Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio 
          sin previo aviso.
        </p>

        <h2>7. Ley Aplicable</h2>
        <p>
          Estos términos se rigen por las leyes aplicables en la jurisdicción del operador del sitio, 
          sin perjuicio de los derechos del consumidor según tu legislación local.
        </p>

        <h2>8. Contacto</h2>
        <p>
          Para consultas sobre estos términos, utiliza los canales de contacto disponibles en el sitio web.
        </p>
      </>
    );
  }

  // English version
  return (
    <>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Zentic, you agree to comply with these Terms of Service. If you disagree, 
        please do not use our platform.
      </p>

      <h2>2. Service Description</h2>
      <p>
        Zentic provides free financial tools including:
      </p>
      <ul>
        <li>Real-time currency converter</li>
        <li>Tax calculators (VAT, Net Salary)</li>
        <li>Compound interest calculator</li>
        <li>Financial news aggregator</li>
      </ul>
      <p>
        All our tools are <strong className="text-emerald-400">100% free</strong> and require no registration.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All code, design, logos, and original content of Zentic is protected by copyright. 
        The name "Zentic" and our logo are registered trademarks.
      </p>
      <p>
        The source code is available for public review, but we do not authorize its copying or redistribution 
        without proper attribution.
      </p>

      <h2>4. Permitted Use</h2>
      <p>
        You may use Zentic for:
      </p>
      <ul>
        <li>Legitimate personal and professional use</li>
        <li>Informative financial inquiries</li>
        <li>Education and learning</li>
      </ul>
      <p>
        <strong className="text-red-400">Not permitted:</strong>
      </p>
      <ul>
        <li>Automated use (bots, scraping) without authorization</li>
        <li>Attempting to bypass our systems or overload the server</li>
        <li>Using our data to directly compete with Zentic</li>
      </ul>

      <h2>5. Limitation of Liability</h2>
      <p>
        Zentic is provided "as is". We do not guarantee:
      </p>
      <ul>
        <li>Uninterrupted service availability</li>
        <li>Absolute accuracy of data (especially exchange rates)</li>
        <li>Absence of technical errors</li>
      </ul>

      <h2>6. Service Modifications</h2>
      <p>
        We reserve the right to modify, suspend, or discontinue any aspect of the service without prior notice.
      </p>

      <h2>7. Applicable Law</h2>
      <p>
        These terms are governed by the applicable laws in the operator's jurisdiction, 
        without prejudice to consumer rights under your local legislation.
      </p>

      <h2>8. Contact</h2>
      <p>
        For questions about these terms, use the contact channels available on the website.
      </p>
    </>
  );
}

function FinancialDisclaimer({ language }: { language: 'es' | 'en' }) {
  if (language === 'es') {
    return (
      <>
        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-lg my-6">
          <p className="text-amber-400 font-semibold flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>ADVERTENCIA IMPORTANTE: NO SOMOS ASESORES FINANCIEROS</span>
          </p>
        </div>

        <h2>1. Naturaleza Informativa</h2>
        <p>
          Zentic es una <strong className="text-emerald-400">herramienta informativa y educativa</strong>, NO un servicio 
          de asesoramiento financiero certificado. Los cálculos, estimaciones y datos proporcionados son solo para fines 
          de referencia general.
        </p>

        <h2>2. Sin Relación Fiduciaria</h2>
        <p>
          El uso de nuestras calculadoras y herramientas <strong className="text-red-400">NO crea una relación cliente-asesor</strong> 
          entre tú y Zentic. No estamos registrados como asesores financieros, corredores de bolsa, ni agentes de inversión.
        </p>

        <h2>3. Precisión de los Datos</h2>
        <p>
          Aunque nos esforzamos por mantener datos precisos:
        </p>
        <ul>
          <li>Los tipos de cambio pueden tener retrasos de hasta 1 minuto</li>
          <li>Las tasas de IVA se actualizan periódicamente pero pueden cambiar sin previo aviso</li>
          <li>Las noticias financieras provienen de fuentes externas que no controlamos</li>
        </ul>

        <h2>4. Responsabilidad del Usuario</h2>
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg my-4">
          <p className="font-semibold text-red-400 mb-2">Eres el único responsable de:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Tus decisiones financieras y de inversión</li>
            <li>Verificar los datos con fuentes oficiales antes de actuar</li>
            <li>Consultar con asesores financieros certificados para decisiones importantes</li>
            <li>Las consecuencias de usar nuestras estimaciones</li>
          </ul>
        </div>

        <h2>5. Sin Garantías</h2>
        <p>
          ZENTIC SE PROPORCIONA "TAL CUAL" SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, 
          INCLUYENDO PERO NO LIMITADO A PRECISIÓN, COMERCIABILIDAD O IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
        </p>

        <h2>6. Ejemplo de Riesgo</h2>
        <p>
          Si nuestra calculadora de interés compuesto sugiere un rendimiento del 8% anual, esto es solo una 
          simulación matemática. Los rendimientos reales dependen de condiciones de mercado, comisiones, 
          impuestos y riesgos que NO consideramos.
        </p>

        <h2>7. Inversión y Pérdidas</h2>
        <p>
          Las inversiones conllevan riesgos, incluyendo la pérdida total del capital. Las decisiones basadas 
          únicamente en nuestras herramientas pueden resultar en pérdidas financieras. 
          <strong className="text-emerald-400"> Nunca inviertas dinero que no puedas permitirte perder.</strong>
        </p>

        <h2>8. Consulta Profesional</h2>
        <p>
          Para decisiones financieras importantes (compras de vivienda, planificación de jubilación, inversiones 
          significativas), recomendamos encarecidamente consultar con:
        </p>
        <ul>
          <li>Un asesor financiero certificado (CFA, CFP)</li>
          <li>Un contador público titulado</li>
          <li>Un abogado especializado en temas financieros</li>
        </ul>

        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg text-sm text-slate-400">
          <p className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Al utilizar Zentic, reconoces que has leído, entendido y aceptado este aviso legal. 
              Si no estás de acuerdo, por favor no utilices nuestras herramientas financieras.
            </span>
          </p>
        </div>
      </>
    );
  }

  // English version
  return (
    <>
      <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-lg my-6">
        <p className="text-amber-400 font-semibold flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>IMPORTANT WARNING: WE ARE NOT FINANCIAL ADVISORS</span>
        </p>
      </div>

      <h2>1. Informational Nature</h2>
      <p>
        Zentic is an <strong className="text-emerald-400">informational and educational tool</strong>, NOT a certified 
        financial advisory service. The calculations, estimates, and data provided are for general reference purposes only.
      </p>

      <h2>2. No Fiduciary Relationship</h2>
      <p>
        Using our calculators and tools <strong className="text-red-400">does NOT create a client-advisor relationship</strong> 
        between you and Zentic. We are not registered as financial advisors, stockbrokers, or investment agents.
      </p>

      <h2>3. Data Accuracy</h2>
      <p>
        While we strive to maintain accurate data:
      </p>
      <ul>
        <li>Exchange rates may have delays of up to 1 minute</li>
        <li>VAT rates are updated periodically but may change without notice</li>
        <li>Financial news comes from external sources we do not control</li>
      </ul>

      <h2>4. User Responsibility</h2>
      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg my-4">
        <p className="font-semibold text-red-400 mb-2">You are solely responsible for:</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Your financial and investment decisions</li>
          <li>Verifying data with official sources before taking action</li>
          <li>Consulting certified financial advisors for important decisions</li>
          <li>The consequences of using our estimates</li>
        </ul>
      </div>

      <h2>5. No Warranties</h2>
      <p>
        ZENTIC IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, 
        INCLUDING BUT NOT LIMITED TO ACCURACY, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE.
      </p>

      <h2>6. Risk Example</h2>
      <p>
        If our compound interest calculator suggests an 8% annual return, this is only a 
        mathematical simulation. Actual returns depend on market conditions, fees, 
        taxes, and risks that we DO NOT consider.
      </p>

      <h2>7. Investment and Losses</h2>
      <p>
        Investments carry risks, including total loss of capital. Decisions based solely on our tools 
        may result in financial losses. 
        <strong className="text-emerald-400"> Never invest money you cannot afford to lose.</strong>
      </p>

      <h2>8. Professional Consultation</h2>
      <p>
        For important financial decisions (home purchases, retirement planning, significant investments), 
        we strongly recommend consulting with:
      </p>
      <ul>
        <li>A certified financial advisor (CFA, CFP)</li>
        <li>A licensed public accountant</li>
        <li>An attorney specializing in financial matters</li>
      </ul>

      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg text-sm text-slate-400">
        <p className="flex items-start gap-2">
          <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            By using Zentic, you acknowledge that you have read, understood, and accepted this legal disclaimer. 
            If you do not agree, please do not use our financial tools.
          </span>
        </p>
      </div>
    </>
  );
}

function NotFound({ language }: { language: 'es' | 'en' }) {
  return (
    <div className="text-center py-12">
      <p className="text-slate-400">
        {language === 'es' 
          ? 'La página legal solicitada no existe.' 
          : 'The requested legal page does not exist.'}
      </p>
    </div>
  );
}