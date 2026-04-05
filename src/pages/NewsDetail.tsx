import { useParams, navigate } from '../router/Router';
import { Calendar, Tag, ArrowLeft, User, Newspaper, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedNewsById } from '../data/news';
import { SEO } from '../components/SEO';

// Helper para generar URL absoluta
const getAbsoluteUrl = (path: string) => {
  return `${window.location.origin}${path}`;
};

export function NewsDetail() {
  const params = useParams();
  const id = params.id;
  const { language } = useLanguage();

  // Obtener noticia localizada directamente
  const newsItem = getLocalizedNewsById(id || '', language);

  if (!newsItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-100 mb-4">
          {language === 'es' ? 'Noticia no encontrada' : 'News not found'}
        </h1>
        <p className="text-slate-400 mb-6">
          {language === 'es' 
            ? 'Lo sentimos, la noticia que buscas no existe.'
            : 'Sorry, the news you are looking for does not exist.'}
        </p>
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'es' ? 'Volver a noticias' : 'Back to news'}
        </button>
      </div>
    );
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // SEO dinámico según el idioma
  const seoTitle = language === 'es'
    ? `${newsItem.title} | Noticias Financieras Zentic`
    : `${newsItem.title} | Zentic Financial News`;

  const seoDescription = newsItem.excerpt.length > 155 
    ? newsItem.excerpt.substring(0, 152) + '...' 
    : newsItem.excerpt;

  // Imagen destacada
  const ogImage = newsItem.image || getAbsoluteUrl('/src/LOGO.jpg');

  // URLs alternativas para hreflang (SEO multilingüe)
  const currentUrl = getAbsoluteUrl(`/news/${newsItem.id}`);
  const esUrl = getAbsoluteUrl(`/news/${newsItem.id}?lang=es`);
  const enUrl = getAbsoluteUrl(`/news/${newsItem.id}?lang=en`);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        type="article"
        image={ogImage}
        publishedTime={newsItem.date}
        author={newsItem.author}
        section={newsItem.category}
      />

      {/* Hreflang tags para SEO multilingüe */}
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />

      {/* Open Graph locale alternates */}
      <meta property="og:locale" content={language === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'es' ? 'en_US' : 'es_ES'} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Botón para volver */}
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {language === 'es' ? 'Volver a noticias' : 'Back to news'}
        </button>

        {/* Categoría y fecha */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full">
            <Tag className="w-3 h-3" />
            {newsItem.category}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Calendar className="w-3 h-3" />
            {formatDate(newsItem.date)}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <User className="w-3 h-3" />
            {newsItem.author}
          </span>
        </div>

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-6">
          {newsItem.title}
        </h1>

        {/* Fuente */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-800">
          <Newspaper className="w-4 h-4" />
          <span>{language === 'es' ? 'Fuente:' : 'Source:'}</span>
          <span className="text-slate-400">{newsItem.source}</span>
          {newsItem.source !== 'Zentic' && (
            <ExternalLink className="w-3 h-3 ml-1" />
          )}
        </div>

        {/* Imagen destacada si existe */}
        {newsItem.image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={newsItem.image} 
              alt={newsItem.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Contenido */}
        <div className="prose prose-invert prose-lg max-w-none">
          {newsItem.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-slate-300 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Metadata adicional */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-600">
          <p>
            {language === 'es' ? 'Fecha de publicación:' : 'Published:'} {newsItem.date}
          </p>
          <p>
            {language === 'es' ? 'Autor:' : 'Author:'} {newsItem.author}
          </p>
          <p>
            {language === 'es' ? 'Fuente:' : 'Source:'} {newsItem.source}
          </p>
        </div>
      </article>
    </>
  );
}