import { Link } from '../router/Router';
import { Calendar, Tag, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedNews } from '../data/news';
import { SEO } from '../components/SEO';

export function News() {
  const { language } = useLanguage();
  
  // Obtener noticias localizadas (ahora son strings, no objetos)
  const localizedNews = getLocalizedNews(language);

  // SEO dinámico por idioma
  const seoTitle = language === 'es'
    ? 'Noticias Financieras | Actualidad del Mercado Global | Zentic'
    : 'Financial News | Global Market Updates | Zentic';

  const seoDescription = language === 'es'
    ? 'Mantente informado con las últimas noticias financieras: mercados, divisas, impuestos, criptomonedas, tecnología y economía global. Actualizado diariamente.'
    : 'Stay informed with the latest financial news: markets, currencies, taxes, cryptocurrencies, technology, and global economy. Updated daily.';

  // Lista de artículos para Schema.org ItemList
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: seoTitle,
    description: seoDescription,
    numberOfItems: localizedNews.length,
    itemListElement: localizedNews.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${window.location.origin}/news/${item.id}`,
      name: item.title, // Ahora es string
    })),
    inLanguage: language === 'es' ? 'es' : 'en',
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        type="WebPage"
      />

      {/* Schema.org ItemList para mejorar SEO de listados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
            {language === 'es' ? 'Noticias Financieras' : 'Financial News'}
          </h1>
          <p className="text-slate-400">
            {language === 'es'
              ? 'Mantente al día con el mercado global'
              : 'Stay up to date with the global market'}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localizedNews.map((item) => (
            <article
              key={item.id}
              className="bg-slate-900/60 backdrop-blur-sm rounded-xl shadow-xl border border-slate-800 overflow-hidden hover:shadow-emerald-900/20 hover:border-emerald-800/50 transition-all duration-300 flex flex-col h-full"
            >
              {item.image && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} // Ahora es string
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm text-emerald-400 mb-3">
                  <Tag className="w-3 h-3" />
                  <span>{item.category}</span> {/* Ahora es string */}
                  <span className="text-slate-600">•</span>
                  <Calendar className="w-3 h-3" />
                  <span className="text-slate-400">{formatDate(item.date)}</span>
                </div>
                
                <h2 className="text-xl font-bold text-slate-100 mb-3 line-clamp-2 hover:text-emerald-400 transition-colors">
                  <Link to={`/news/${item.id}`} className="block">
                    {item.title} {/* Ahora es string */}
                  </Link>
                </h2>
                
                <p className="text-slate-400 mb-4 line-clamp-3 flex-grow">
                  {item.excerpt} {/* Ahora es string */}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <User className="w-3 h-3" />
                    <span>{item.author}</span>
                  </div>
                  
                  <Link 
                    to={`/news/${item.id}`}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1 transition-colors group"
                  >
                    {language === 'es' ? 'Leer más' : 'Read more'}
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}