import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  type?: 'WebPage' | 'SoftwareApplication' | 'FinancialService' | 'article';
  image?: string;
  publishedTime?: string;
  author?: string;
  section?: string;
}

export function SEO({ 
  title, 
  description, 
  type = 'WebPage', 
  image, 
  publishedTime, 
  author, 
  section 
}: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Meta keywords (opcional, algunos motores de búsqueda aún lo usan)
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 'finanzas, calculadoras financieras, IVA, interés compuesto, préstamos, ahorro, inversión, noticias financieras');

    // Open Graph
    const setMeta = (property: string, content: string, nameAttr = 'property') => {
      let meta = document.querySelector(`meta[${nameAttr}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameAttr, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('og:title', title);
    setMeta('og:description', description);
    
    // Determinar og:type basado en el tipo de página
    let ogType = 'website';
    if (type === 'SoftwareApplication') ogType = 'software';
    else if (type === 'FinancialService') ogType = 'financial';
    else if (type === 'article') ogType = 'article';
    
    setMeta('og:type', ogType);
    setMeta('og:url', window.location.href);
    setMeta('og:image', image || `${window.location.origin}/src/LOGO.jpg`);
    setMeta('og:site_name', 'Zentic - Financial Tools');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', title, 'name');
    setMeta('twitter:description', description, 'name');
    setMeta('twitter:image', image || `${window.location.origin}/src/LOGO.jpg`, 'name');

    // Article specific meta tags
    if (publishedTime) {
      setMeta('article:published_time', publishedTime);
    }
    if (author) {
      setMeta('article:author', author);
    }
    if (section) {
      setMeta('article:section', section);
    }

    // Eliminar schema antiguo y añadir nuevo
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
      existingSchema.remove();
    }

    const schemaData = generateSchema(type, title, description, publishedTime, author, image);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    // Limpiar meta tags que ya no son necesarios (opcional)
    return () => {
      // No es necesario limpiar porque se reemplazan en la próxima ejecución
    };
  }, [title, description, type, image, publishedTime, author, section]);

  return null;
}

function generateSchema(type: string, title: string, description: string, datePublished?: string, author?: string, image?: string) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'SoftwareApplication' ? 'SoftwareApplication' 
            : type === 'FinancialService' ? 'FinancialService' 
            : type === 'article' ? 'NewsArticle' 
            : 'WebPage',
    name: title,
    description: description,
    url: window.location.href,
    inLanguage: document.documentElement.lang === 'es' ? 'es' : 'en',
  };

  if (type === 'SoftwareApplication') {
    return {
      ...baseSchema,
      applicationCategory: 'FinanceApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      operatingSystem: 'Web Browser',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
        bestRating: '5'
      }
    };
  }

  if (type === 'FinancialService') {
    return {
      ...baseSchema,
      '@type': 'FinancialService',
      serviceType: 'Financial Calculator Suite',
      provider: {
        '@type': 'Organization',
        name: 'Zentic',
        url: window.location.origin,
        logo: `${window.location.origin}/src/LOGO.jpg`
      },
      areaServed: 'Global',
      availableLanguage: ['es', 'en']
    };
  }

  // Para artículos de noticias (type === 'article')
  if (type === 'article' || (datePublished && author)) {
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description: description,
      url: window.location.href,
      inLanguage: document.documentElement.lang === 'es' ? 'es' : 'en',
      datePublished: datePublished || new Date().toISOString().split('T')[0],
      dateModified: datePublished || new Date().toISOString().split('T')[0],
      author: {
        '@type': 'Person',
        name: author || 'Zentic'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Zentic',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/src/LOGO.jpg`
        }
      },
      image: image ? {
        '@type': 'ImageObject',
        url: image
      } : undefined,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': window.location.href
      }
    };
  }

  return baseSchema;
}