// ─── App.tsx (actualizado) ────────────────────────────────────────────────────
// Rutas de calculadoras individuales añadidas para SEO de URL único
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from './router/Router';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { Home } from './pages/Home';
import { Converter } from './pages/Converter';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Legal } from './pages/Legal';

// Calculadoras individuales (cada una con su propia URL y SEO)
import { CalculatorHub }        from './pages/calc/CalculatorHub';
import { CalculadoraIVA }       from './pages/calc/CalculadoraIVA';
import { CalculadoraInversion } from './pages/calc/CalculadoraInversion';
import { CalculadoraPrestamo }  from './pages/calc/CalculadoraPrestamo';
import { CalculadoraDeudas }    from './pages/calc/CalculadoraDeudas';
import { CalculadoraAhorro }    from './pages/calc/CalculadoraAhorro';

function App() {
  const routes = [
    // ── Rutas principales ────────────────────────────────────────────────────
    { path: '/',          component: <Home /> },
    { path: '/converter', component: <Converter /> },
    { path: '/news',      component: <News /> },
    { path: '/news/:id',  component: <NewsDetail /> },
    { path: '/legal/:id', component: <Legal /> },

    // ── Hub de calculadoras (índice con internal linking) ────────────────────
    // /calculators mantiene la URL anterior para no romper backlinks existentes
    { path: '/calculators',               component: <CalculatorHub /> },

    // ── Calculadoras individuales (URLs semánticas para SEO) ─────────────────
    { path: '/calculadora-de-iva',        component: <CalculadoraIVA /> },
    { path: '/calculadora-de-inversion',  component: <CalculadoraInversion /> },
    { path: '/calculadora-de-prestamo',   component: <CalculadoraPrestamo /> },
    { path: '/calculadora-de-deudas',     component: <CalculadoraDeudas /> },
    { path: '/calculadora-de-ahorro',     component: <CalculadoraAhorro /> },

    // ── Aliases en inglés (opcional, aumenta alcance para usuarios en inglés) ─
    // Descomenta si quieres rankear también en inglés con URLs propias:
    // { path: '/vat-calculator',             component: <CalculadoraIVA /> },
    // { path: '/compound-interest-calculator', component: <CalculadoraInversion /> },
    // { path: '/loan-affordability-calculator', component: <CalculadoraPrestamo /> },
    // { path: '/debt-payoff-calculator',     component: <CalculadoraDeudas /> },
    // { path: '/savings-goal-calculator',    component: <CalculadoraAhorro /> },
  ];

  return (
    <LanguageProvider>
      <Layout>
        <Router routes={routes} />
      </Layout>
    </LanguageProvider>
  );
}

export default App;