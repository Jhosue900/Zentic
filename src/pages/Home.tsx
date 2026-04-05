import { useLanguage } from '../context/LanguageContext';
import { Link } from '../router/Router';

const tools = [
  {
    id: 'converter',
    href: '/converter',
    icon: '⇄',
    labelEs: 'Conversor de Divisas',
    labelEn: 'Currency Converter',
    subEs: 'Tipos de cambio en tiempo real',
    subEn: 'Real-time exchange rates',
    accent: '#00ff87',
    tag: 'LIVE',
  },
  {
    id: 'calculators',
    href: '/calculators',
    icon: '∑',
    labelEs: 'Calculadoras Fiscales',
    labelEn: 'Financial Calculators',
    subEs: 'IVA, Sueldo Neto e Interés Compuesto',
    subEn: 'VAT, Net Salary and Compound Interest',
    accent: '#ffd700',
    tag: 'PRO',
  },
  {
    id: 'news',
    href: '/news',
    icon: '◎',
    labelEs: 'Noticias Financieras',
    labelEn: 'Financial News',
    subEs: 'Mantente informado del mercado',
    subEn: 'Stay up to date with the market',
    accent: '#60a5fa',
    tag: 'HOT',
  },
];

const stats = [
  { value: '15', labelEs: 'Divisas',      labelEn: 'Currencies',  suffix: '+' },
  { value: '3',  labelEs: 'Calculadoras', labelEn: 'Calculators', suffix: '' },
  { value: '100',labelEs: 'Gratis',       labelEn: 'Free',        suffix: '%' },
];

export function Home() {
  const { language } = useLanguage();
  const es = language === 'es';

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="grid-lines" />
          <div className="glow glow-1" />
          <div className="glow glow-2" />
        </div>

        <div className="hero-content">
          <span className="eyebrow">
            {es ? 'Herramientas Financieras' : 'Financial Tools'}
          </span>

          <h1 className="hero-title">
            {es
              ? <><span className="title-line">Decisiones inteligentes,</span><br /><span className="accent-text">datos en tiempo real</span></>
              : <><span className="title-line">Smart decisions,</span><br /><span className="accent-text">real-time data</span></>}
          </h1>

          <p className="hero-sub">
            {es
              ? 'Convierte divisas, calcula impuestos y sigue el mercado — todo gratis, sin registro.'
              : 'Convert currencies, calculate taxes and follow the market — all free, no sign-up.'}
          </p>

          <div className="hero-cta">
            <Link to="/converter" className="btn-primary">
              {es ? 'Convertir ahora' : 'Convert now'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
            <Link to="/calculators" className="btn-ghost">
              {es ? 'Ver calculadoras' : 'See calculators'}
            </Link>
          </div>

          <div className="live-ticker" aria-label="Live pairs">
            <span className="ticker-dot" />
            <span className="ticker-text">USD/EUR · USD/COP · USD/MXN · EUR/GBP · USD/JPY</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-strip" aria-label="Stats">
        {stats.map(s => (
          <div key={s.labelEs} className="stat-item">
            <span className="stat-value">
              {s.value}<span className="stat-suffix">{s.suffix}</span>
            </span>
            <span className="stat-label">{es ? s.labelEs : s.labelEn}</span>
          </div>
        ))}
      </section>

      {/* ── Tools Grid ── */}
      <section className="tools-section">
        <div className="section-header">
          <h2 className="section-title">
            {es ? 'Nuestras herramientas' : 'Our tools'}
          </h2>
          <span className="section-line" aria-hidden="true" />
        </div>

        <div className="tools-grid">
          {tools.map((tool, i) => (
            <Link
              to={tool.href}
              key={tool.id}
              className="tool-card"
              style={{ '--accent': tool.accent, '--delay': `${i * 0.1}s` } as React.CSSProperties}
            >
              <div className="card-header">
                <span className="card-icon" aria-hidden="true">{tool.icon}</span>
                <span className="card-tag">{tool.tag}</span>
              </div>
              <h3 className="card-title">{es ? tool.labelEs : tool.labelEn}</h3>
              <p className="card-sub">{es ? tool.subEs : tool.subEn}</p>
              <div className="card-footer">
                <span className="card-cta">
                  {es ? 'Acceder' : 'Open'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <div className="card-bar" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trust Banner ── */}
      <section className="trust-banner">
        <div className="trust-inner">
          <div className="trust-left">
            <h2 className="trust-title">
              {es ? 'Confiable y Preciso' : 'Reliable and Accurate'}
            </h2>
            <p className="trust-body">
              {es
                ? 'Tasas obtenidas directamente de APIs financieras actualizadas cada minuto. Sin comisiones ocultas, sin registro, sin límites.'
                : 'Rates sourced directly from financial APIs updated every minute. No hidden fees, no sign-up, no limits.'}
            </p>
          </div>
          <div className="trust-right">
            {[
              { dot: 'green', es: 'API en tiempo real',  en: 'Real-time API' },
              { dot: 'gold',  es: 'Sin registro',        en: 'No sign-up' },
              { dot: 'blue',  es: '15 divisas',          en: '15 currencies' },
              { dot: 'green', es: '100% gratis',         en: '100% free' },
            ].map((p, i) => (
              <div key={i} className="feature-pill">
                <span className={`pill-dot ${p.dot}`} aria-hidden="true" />
                {es ? p.es : p.en}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .home-page {
          font-family: 'DM Sans', sans-serif;
          background: #080c10;
          color: #e2e8f0;
          --green: #00ff87;
          --gold:  #ffd700;
          --blue:  #60a5fa;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          overflow: hidden;
          padding: 80px 16px 60px;
          text-align: center;
          min-height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 640px)  { .hero { padding: 100px 24px 80px; min-height: 560px; } }
        @media (min-width: 1024px) { .hero { padding: 120px 24px 100px; min-height: 640px; } }

        .hero-bg { position: absolute; inset: 0; pointer-events: none; }
        .grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,255,135,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,135,.04) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
        }
        @media (min-width: 640px) { .grid-lines { background-size: 48px 48px; } }

        .glow {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: .15;
        }
        @media (min-width: 640px) { .glow { filter: blur(120px); opacity: .18; } }
        .glow-1 {
          width: 320px; height: 220px; top: -60px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, #00ff87, transparent 70%);
        }
        @media (min-width: 640px) { .glow-1 { width: 600px; height: 400px; top: -100px; } }
        .glow-2 {
          width: 200px; height: 160px; top: 20px; right: -40px;
          background: radial-gradient(circle, #ffd700, transparent 70%);
          opacity: .08;
        }
        @media (min-width: 640px) { .glow-2 { width: 400px; height: 300px; top: 40px; right: -60px; opacity: .10; } }

        .hero-content {
          position: relative;
          max-width: 760px;
          margin: 0 auto;
          width: 100%;
        }

        .eyebrow {
          display: inline-block;
          font-size: 10px; font-weight: 600; letter-spacing: .15em;
          text-transform: uppercase; color: var(--green);
          border: 1px solid rgba(0,255,135,.3);
          padding: 4px 12px; border-radius: 999px;
          margin-bottom: 20px;
          animation: fadeUp .5s ease both;
        }
        @media (min-width: 640px) { .eyebrow { font-size: 11px; margin-bottom: 24px; } }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 7vw, 68px);
          font-weight: 900; line-height: 1.1; color: #f8fafc;
          margin: 0 0 16px;
          animation: fadeUp .5s .1s ease both;
          word-break: break-word;
        }
        @media (min-width: 640px) { .hero-title { line-height: 1.08; margin: 0 0 20px; } }

        .title-line { display: inline; }
        .accent-text {
          background: linear-gradient(135deg, var(--green), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 15px; font-weight: 300; color: #94a3b8; line-height: 1.7;
          margin: 0 0 28px;
          animation: fadeUp .5s .2s ease both;
          max-width: 560px;
          margin-left: auto; margin-right: auto;
        }
        @media (min-width: 640px) { .hero-sub { font-size: 17px; margin-bottom: 36px; } }

        .hero-cta {
          display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
          margin-bottom: 32px;
          animation: fadeUp .5s .3s ease both;
        }
        @media (min-width: 640px) { .hero-cta { gap: 12px; margin-bottom: 40px; } }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green); color: #080c10;
          font-weight: 600; font-size: 14px;
          padding: 12px 22px; border-radius: 10px;
          text-decoration: none;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 0 20px rgba(0,255,135,.3);
          white-space: nowrap;
        }
        @media (min-width: 640px) { .btn-primary { font-size: 15px; padding: 13px 28px; } }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(0,255,135,.5); }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          display: inline-flex; align-items: center;
          border: 1px solid rgba(255,255,255,.15); color: #cbd5e1;
          font-size: 14px; font-weight: 500;
          padding: 12px 22px; border-radius: 10px;
          text-decoration: none;
          transition: border-color .2s, color .2s, background .2s;
          white-space: nowrap;
        }
        @media (min-width: 640px) { .btn-ghost { font-size: 15px; padding: 13px 28px; } }
        .btn-ghost:hover { border-color: rgba(255,255,255,.4); color: #fff; background: rgba(255,255,255,.04); }
        .btn-ghost:active { background: rgba(255,255,255,.08); }

        .live-ticker {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; color: #475569;
          letter-spacing: .05em;
          animation: fadeUp .5s .4s ease both;
          max-width: 100%;
          overflow: hidden;
        }
        @media (min-width: 640px) { .live-ticker { font-size: 12px; gap: 10px; } }
        .ticker-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ticker-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--green); box-shadow: 0 0 8px var(--green);
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }

        /* ── Stats ── */
        .stats-strip {
          display: flex; justify-content: center;
          border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
          padding: 20px 16px;
          background: rgba(255,255,255,.02);
        }
        @media (min-width: 640px) { .stats-strip { padding: 28px 24px; } }

        .stat-item {
          flex: 1; max-width: 160px;
          display: flex; flex-direction: column; align-items: center;
          padding: 0 12px;
          border-right: 1px solid rgba(255,255,255,.07);
        }
        @media (min-width: 640px) { .stat-item { max-width: 200px; padding: 0 24px; } }
        .stat-item:last-child { border-right: none; }

        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 30px; font-weight: 900; color: var(--green); line-height: 1;
        }
        @media (min-width: 640px) { .stat-value { font-size: 40px; } }
        .stat-suffix { font-size: 18px; color: var(--gold); }
        @media (min-width: 640px) { .stat-suffix { font-size: 24px; } }
        .stat-label {
          font-size: 10px; font-weight: 500; color: #64748b;
          text-transform: uppercase; letter-spacing: .1em; margin-top: 4px;
          text-align: center;
        }
        @media (min-width: 640px) { .stat-label { font-size: 12px; } }

        /* ── Tools ── */
        .tools-section {
          max-width: 1100px; margin: 0 auto;
          padding: 48px 16px;
        }
        @media (min-width: 640px)  { .tools-section { padding: 60px 24px; } }
        @media (min-width: 1024px) { .tools-section { padding: 72px 24px; } }

        .section-header {
          display: flex; align-items: center; gap: 16px; margin-bottom: 28px;
        }
        @media (min-width: 640px) { .section-header { gap: 20px; margin-bottom: 40px; } }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: #f1f5f9;
          white-space: nowrap; margin: 0;
        }
        @media (min-width: 640px) { .section-title { font-size: 28px; } }
        .section-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,.15), transparent);
        }

        .tools-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 540px) {
          .tools-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (min-width: 900px) {
          .tools-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
        }

        .tool-card {
          position: relative; overflow: hidden;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          padding: 22px;
          text-decoration: none; color: inherit;
          display: block;
          transition: transform .25s, border-color .25s, box-shadow .25s;
          animation: fadeUp .5s var(--delay, 0s) ease both;
        }
        @media (min-width: 640px) { .tool-card { padding: 28px; } }
        .tool-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 16px;
          background: radial-gradient(ellipse 80% 60% at 20% 0%, var(--accent), transparent 70%);
          opacity: 0; transition: opacity .3s;
          pointer-events: none;
        }
        @media (hover: hover) {
          .tool-card:hover {
            transform: translateY(-4px);
            border-color: var(--accent);
            box-shadow: 0 8px 40px rgba(0,0,0,.4), 0 0 0 1px var(--accent);
          }
          .tool-card:hover::before { opacity: .06; }
          .tool-card:hover .card-cta { gap: 9px; }
        }
        .tool-card:active { transform: scale(.98); }

        .card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 16px;
        }
        @media (min-width: 640px) { .card-header { margin-bottom: 20px; } }
        .card-icon {
          font-size: 24px; font-weight: 900; color: var(--accent);
          font-family: 'Playfair Display', serif; line-height: 1;
          filter: drop-shadow(0 0 8px var(--accent));
        }
        @media (min-width: 640px) { .card-icon { font-size: 28px; } }
        .card-tag {
          font-size: 9px; font-weight: 700; letter-spacing: .12em;
          color: var(--accent); border: 1px solid var(--accent);
          padding: 2px 7px; border-radius: 999px; opacity: .8;
        }
        @media (min-width: 640px) { .card-tag { font-size: 10px; } }
        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700; color: #f1f5f9; margin: 0 0 6px;
        }
        @media (min-width: 640px) { .card-title { font-size: 20px; margin-bottom: 8px; } }
        .card-sub {
          font-size: 13px; color: #64748b; line-height: 1.5;
          margin: 0 0 18px;
        }
        @media (min-width: 640px) { .card-sub { font-size: 14px; margin-bottom: 24px; } }
        .card-footer { display: flex; align-items: center; justify-content: space-between; }
        .card-cta {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: var(--accent);
          transition: gap .2s;
        }
        @media (min-width: 640px) { .card-cta { font-size: 13px; } }
        .card-bar {
          height: 2px; width: 32px; border-radius: 999px;
          background: linear-gradient(90deg, var(--accent), transparent);
          opacity: .5;
        }
        @media (min-width: 640px) { .card-bar { width: 40px; } }

        /* ── Trust ── */
        .trust-banner {
          background: linear-gradient(135deg, rgba(0,255,135,.05), rgba(255,215,0,.05));
          border-top: 1px solid rgba(0,255,135,.12);
          border-bottom: 1px solid rgba(0,255,135,.12);
          padding: 40px 16px;
        }
        @media (min-width: 640px)  { .trust-banner { padding: 48px 24px; } }
        @media (min-width: 1024px) { .trust-banner { padding: 56px 24px; } }

        .trust-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 28px;
        }
        @media (min-width: 768px) {
          .trust-inner { flex-direction: row; gap: 48px; align-items: center; }
        }

        .trust-left { flex: 1; }
        .trust-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: #f1f5f9; margin: 0 0 10px;
        }
        @media (min-width: 640px) { .trust-title { font-size: 26px; margin-bottom: 12px; } }
        .trust-body { font-size: 14px; color: #64748b; line-height: 1.7; margin: 0; }
        @media (min-width: 640px) { .trust-body { font-size: 15px; } }

        .trust-right {
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 8px;
          justify-content: start;
        }
        @media (min-width: 640px) { .trust-right { gap: 10px; } }
        @media (min-width: 768px) { .trust-right { flex: 0 0 auto; display: flex; flex-wrap: wrap; } }

        .feature-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.09);
          padding: 8px 13px; border-radius: 999px;
          font-size: 12px; font-weight: 500; color: #94a3b8;
          white-space: nowrap;
        }
        @media (min-width: 640px) { .feature-pill { font-size: 13px; padding: 9px 16px; gap: 8px; } }
        .pill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        @media (min-width: 640px) { .pill-dot { width: 7px; height: 7px; } }
        .pill-dot.green { background: var(--green); box-shadow: 0 0 6px var(--green); }
        .pill-dot.gold  { background: var(--gold);  box-shadow: 0 0 6px var(--gold); }
        .pill-dot.blue  { background: var(--blue);  box-shadow: 0 0 6px var(--blue); }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: .3; }
        }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .eyebrow, .hero-title, .hero-sub, .hero-cta, .live-ticker, .tool-card {
            animation: none;
          }
          .btn-primary:hover, .tool-card:hover { transform: none; }
        }
      `}</style>
    </div>
  );
}