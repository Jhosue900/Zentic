import { LanguageProvider } from './context/LanguageContext';
import { Router } from './router/Router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Converter } from './pages/Converter';
import { Calculators } from './pages/Calculators';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';

function App() {
  const routes = [
    { path: '/', component: <Home /> },
    { path: '/converter', component: <Converter /> },
    { path: '/calculators', component: <Calculators /> },
    { path: '/news', component: <News /> },
    { path: '/news/:id', component: <NewsDetail /> }
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