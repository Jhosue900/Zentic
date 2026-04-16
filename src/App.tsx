// ─── App.tsx ─────────────────────────────────────────────────────────────────

import { Router } from './router/Router';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { Home } from './pages/Home';
import { Converter } from './pages/Converter';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Legal } from './pages/Legal';

import { CalculatorHub }        from './pages/calc/CalculatorHub';
import { CalculadoraIVA }       from './pages/calc/CalculadoraIVA';
import { CalculadoraInversion } from './pages/calc/CalculadoraInversion';
import { CalculadoraPrestamo }  from './pages/calc/CalculadoraPrestamo';
import { CalculadoraDeudas }    from './pages/calc/CalculadoraDeudas';
import { CalculadoraAhorro }    from './pages/calc/CalculadoraAhorro';
import { AboutUs } from './pages/AboutUs'

// ✅ Fix 1: rutas FUERA del componente → se crean una sola vez,
//    nunca causan re-renders ni remontan componentes innecesariamente
const routes = [
  { path: '/',          component: <Home /> },
  { path: '/converter', component: <Converter /> },
  { path: '/news',      component: <News /> },
  { path: '/news/:id',  component: <NewsDetail /> },
  { path: '/legal/:id', component: <Legal /> },

  { path: '/calculators',               component: <CalculatorHub /> },
  { path: '/calculadora-de-iva',        component: <CalculadoraIVA /> },
  { path: '/calculadora-de-inversion',  component: <CalculadoraInversion /> },
  { path: '/calculadora-de-prestamo',   component: <CalculadoraPrestamo /> },
  { path: '/calculadora-de-deudas',     component: <CalculadoraDeudas /> },
  { path: '/calculadora-de-ahorro',     component: <CalculadoraAhorro /> },
  { path: '/aboutus',     component: <AboutUs /> },
];

function App() {
  return (
    // ✅ Fix 2: LanguageProvider y Layout FUERA del Router →
    //    nunca se desmontan cuando el Router cambia su key interna,
    //    así el contexto de idioma siempre está disponible
    <LanguageProvider>
      <Layout>
        <Router routes={routes} />
      </Layout>
    </LanguageProvider>
  );
}

export default App;