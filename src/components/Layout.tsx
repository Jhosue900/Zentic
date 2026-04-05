import { ReactNode, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useLocation } from '../router/Router';
import { Shield, FileText, AlertTriangle, Heart } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',            labelEs: 'Inicio',               labelEn: 'Home' },
  { href: '/converter',   labelEs: 'Conversor de Divisas', labelEn: 'Converter' },
  { href: '/calculators', labelEs: 'Calculadoras',         labelEn: 'Calculators' },
  { href: '/news',        labelEs: 'Noticias Financieras', labelEn: 'Financial News' },
];

// Layout.tsx - actualizar LEGAL_LINKS
const LEGAL_LINKS = [
  { href: '/legal/privacy',    labelEs: 'Privacidad',    labelEn: 'Privacy',    icon: Shield },
  { href: '/legal/terms',      labelEs: 'Términos',      labelEn: 'Terms',      icon: FileText },
  { href: '/legal/disclaimer', labelEs: 'Aviso Legal',   labelEn: 'Disclaimer', icon: AlertTriangle },
];

interface LayoutProps { children: ReactNode; }

export function Layout({ children }: LayoutProps) {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <div className="layout">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">

          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-icon">◈</span>
            <span className="logo-text">Zen<span className="logo-accent">tic</span></span>
          </Link>

          <div className="nav-links">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              >
                {language === 'es' ? link.labelEs : link.labelEn}
                {isActive(link.href) && <span className="nav-dot" />}
              </Link>
            ))}
          </div>

          <div className="nav-right">
            <button
              className="lang-btn"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              aria-label="Toggle language"
            >
              <span className="lang-flag">{language === 'es' ? '🇪🇸' : '🇺🇸'}</span>
              <span className="lang-code">{language.toUpperCase()}</span>
            </button>

            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`mobile-link ${isActive(link.href) ? 'active' : ''}`}
            >
              <span className="mobile-link-text">
                {language === 'es' ? link.labelEs : link.labelEn}
              </span>
              {isActive(link.href) && <span className="mobile-active-dot" />}
            </Link>
          ))}
          <div className="mobile-lang">
            <button
              className="mobile-lang-btn"
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            >
              <span>{language === 'es' ? '🇪🇸' : '🇺🇸'}</span>
              <span>{language === 'es' ? 'Cambiar a English' : 'Switch to Español'}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-icon">◈</span>
            <span className="logo-text">Zen<span className="logo-accent">tic</span></span>
          </div>
          
          <p className="footer-tagline">
            {language === 'es'
              ? 'Herramientas financieras  · Gratis · Sin registro'
              : 'Financial tools · Free · No sign-up'}
          </p>
          
          <nav className="footer-links">
            {NAV_LINKS.slice(1).map(link => (
              <Link key={link.href} to={link.href} className="footer-link">
                {language === 'es' ? link.labelEs : link.labelEn}
              </Link>
            ))}
          </nav>

          {/* ENLACES LEGALES - NUEVA SECCIÓN */}
          <div className="footer-legal">
            {LEGAL_LINKS.map(link => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href} 
                  to={link.href} 
                  className="footer-legal-link"
                >
                  <Icon className="footer-legal-icon" />
                  <span>{language === 'es' ? link.labelEs : link.labelEn}</span>
                </Link>
              );
            })}
          </div>
          
          <p className="footer-copy">
            © {new Date().getFullYear()} Zentic · Professional Financial Tools
          </p>
          
          <p className="footer-heart">
            <Heart className="footer-heart-icon" /> 
            {language === 'es' ? 'Hecho con transparencia' : 'Made with transparency'}
          </p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080c10; -webkit-font-smoothing: antialiased; }

        .layout {
          font-family: 'DM Sans', sans-serif;
          background: #080c10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background .3s, border-color .3s;
          border-bottom: 1px solid transparent;
        }
        .navbar.scrolled {
          background: rgba(8,12,16,.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-color: rgba(0,255,135,.1);
        }

        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 16px; height: 60px;
          display: flex; align-items: center; gap: 8px;
        }
        @media (min-width: 640px)  { .nav-inner { padding: 0 24px; height: 64px; } }
        @media (min-width: 1024px) { .nav-inner { gap: 24px; } }

        .nav-logo {
          display: flex; align-items: center; gap: 7px;
          text-decoration: none; flex-shrink: 0;
        }
        .logo-icon {
          font-size: 20px; color: #00ff87;
          filter: drop-shadow(0 0 6px #00ff87); line-height: 1;
        }
        @media (min-width: 640px) { .logo-icon { font-size: 22px; } }
        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 900; color: #f1f5f9;
          letter-spacing: -.01em;
        }
        @media (min-width: 640px) { .logo-text { font-size: 20px; } }
        .logo-accent { color: #00ff87; }

        .nav-links {
          display: none; align-items: center; gap: 2px; flex: 1;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }

        .nav-link {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          padding: 6px 10px; border-radius: 8px;
          font-size: 13px; font-weight: 500; color: #64748b;
          text-decoration: none; white-space: nowrap;
          transition: color .2s, background .2s;
        }
        @media (min-width: 1024px) { .nav-link { padding: 6px 14px; font-size: 14px; } }
        .nav-link:hover { color: #e2e8f0; background: rgba(255,255,255,.05); }
        .nav-link.active { color: #00ff87; }
        .nav-dot {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #00ff87; box-shadow: 0 0 6px #00ff87;
        }

        .nav-right { display: flex; align-items: center; gap: 6px; margin-left: auto; }

        .lang-btn {
          display: none; align-items: center; gap: 6px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px; padding: 6px 10px;
          cursor: pointer; color: #94a3b8;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600;
          transition: border-color .2s, color .2s; white-space: nowrap;
        }
        @media (min-width: 768px) { .lang-btn { display: flex; } }
        .lang-btn:hover { border-color: rgba(0,255,135,.4); color: #00ff87; }
        .lang-flag { font-size: 15px; line-height: 1; }
        .lang-code { letter-spacing: .05em; }

        /* Hamburger */
        .hamburger {
          display: flex; flex-direction: column; justify-content: center;
          gap: 5px; width: 40px; height: 40px; padding: 8px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 8px; cursor: pointer; flex-shrink: 0;
        }
        .hamburger span {
          display: block; height: 2px; border-radius: 2px;
          background: #94a3b8;
          transition: transform .25s, opacity .25s;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (min-width: 768px) { .hamburger { display: none; } }

        /* Mobile menu */
        .mobile-menu {
          display: flex; flex-direction: column;
          overflow: hidden; max-height: 0;
          transition: max-height .35s cubic-bezier(.4,0,.2,1);
          background: #0d1117;
          border-top: 1px solid transparent;
        }
        .mobile-menu.open {
          max-height: 400px;
          border-color: rgba(0,255,135,.1);
        }
        .mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px;
          font-size: 15px; font-weight: 500; color: #64748b;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: color .2s, background .2s;
        }
        .mobile-link:hover { color: #e2e8f0; background: rgba(255,255,255,.03); }
        .mobile-link.active { color: #00ff87; }
        .mobile-link-text { flex: 1; }
        .mobile-active-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00ff87; box-shadow: 0 0 6px #00ff87; flex-shrink: 0;
        }
        .mobile-lang {
          padding: 12px 20px 16px;
          border-top: 1px solid rgba(255,255,255,.06);
        }
        .mobile-lang-btn {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px; padding: 10px 14px; width: 100%;
          cursor: pointer; color: #94a3b8;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          transition: border-color .2s, color .2s;
        }
        .mobile-lang-btn:hover { border-color: rgba(0,255,135,.4); color: #00ff87; }

        /* ── Main ── */
        .main-content { flex: 1; padding-top: 60px; }
        @media (min-width: 640px) { .main-content { padding-top: 64px; } }

        /* ── Footer ── */
        .footer {
          background: rgba(255,255,255,.02);
          border-top: 1px solid rgba(255,255,255,.06);
          padding: 32px 16px;
          margin-top: auto;
        }
        @media (min-width: 640px) { .footer { padding: 40px 24px; } }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          text-align: center;
        }
        .footer-brand { display: flex; align-items: center; gap: 8px; }
        .footer-tagline { font-size: 12px; color: #334155; line-height: 1.6; }
        @media (min-width: 640px) { .footer-tagline { font-size: 13px; } }
        .footer-links { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        @media (min-width: 640px) { .footer-links { gap: 24px; } }
        .footer-link {
          font-size: 12px; font-weight: 500; color: #475569;
          text-decoration: none; transition: color .2s;
        }
        @media (min-width: 640px) { .footer-link { font-size: 13px; } }
        .footer-link:hover { color: #00ff87; }

        /* Enlaces legales - NUEVOS ESTILOS */
        .footer-legal {
          display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;
          padding: 8px 0 4px;
          border-top: 1px solid rgba(255,255,255,.04);
          margin-top: 4px;
        }
        .footer-legal-link {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 500; color: #334155;
          text-decoration: none; transition: color .2s;
        }
        @media (min-width: 640px) { 
          .footer-legal-link { font-size: 12px; gap: 6px; }
        }
        .footer-legal-link:hover { color: #00ff87; }
        .footer-legal-icon {
          width: 12px; height: 12px; opacity: 0.7;
        }
        @media (min-width: 640px) {
          .footer-legal-icon { width: 13px; height: 13px; }
        }

        .footer-copy { font-size: 11px; color: #1e293b; margin-top: 4px; }
        @media (min-width: 640px) { .footer-copy { font-size: 12px; } }
        
        .footer-heart {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          font-size: 10px; color: #1e293b; margin-top: 4px;
        }
        .footer-heart-icon {
          width: 10px; height: 10px; color: #ef4444; opacity: 0.6;
        }
        @media (min-width: 640px) {
          .footer-heart { font-size: 11px; }
          .footer-heart-icon { width: 11px; height: 11px; }
        }
      `}</style>
    </div>
  );
}