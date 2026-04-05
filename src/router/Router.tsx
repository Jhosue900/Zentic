import React, { useState, useEffect, ReactNode, useContext, createContext } from 'react';

type Route = {
  path: string;
  component: ReactNode;
};

interface RouterProps {
  routes: Route[];
}

// Función para verificar si una ruta coincide con el path actual (soporta parámetros :id)
const matchRoute = (routePath: string, currentPath: string): { matches: boolean; params: Record<string, string> } => {
  const routeParts = routePath.split('/');
  const currentParts = currentPath.split('/');
  
  if (routeParts.length !== currentParts.length) {
    return { matches: false, params: {} };
  }
  
  const params: Record<string, string> = {};
  
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      // Es un parámetro dinámico, guardar el valor
      const paramName = routeParts[i].slice(1);
      params[paramName] = currentParts[i];
    } else if (routeParts[i] !== currentParts[i]) {
      // No coincide
      return { matches: false, params: {} };
    }
  }
  
  return { matches: true, params };
};

// Contexto para pasar los parámetros de la ruta a los componentes hijos
const RouterParamsContext = createContext<Record<string, string>>({});

export const RouterParamsProvider = ({ params, children }: { params: Record<string, string>; children: ReactNode }) => {
  return (
    <RouterParamsContext.Provider value={params}>
      {children}
    </RouterParamsContext.Provider>
  );
};

// Hook para obtener los parámetros de la ruta
export function useParams(): Record<string, string> {
  return useContext(RouterParamsContext);
}

export function Router({ routes }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Buscar la ruta que coincida (incluyendo rutas dinámicas)
  let matchedRoute: Route | undefined;
  let matchedParams: Record<string, string> = {};
  
  for (const route of routes) {
    const { matches, params } = matchRoute(route.path, currentPath);
    if (matches) {
      matchedRoute = route;
      matchedParams = params;
      break;
    }
  }
  
  // Si no hay coincidencia, usar la primera ruta (home)
  const currentRoute = matchedRoute || routes[0];
  
  // Pasar los parámetros al componente mediante props adicionales
  const componentWithParams = matchedParams && Object.keys(matchedParams).length > 0
    ? <RouterParamsProvider params={matchedParams}>{currentRoute.component}</RouterParamsProvider>
    : currentRoute.component;

  return <>{componentWithParams}</>;
}

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Hook para navegación programática
export function useNavigate() {
  return navigate;
}

// Hook para leer la ruta actual reactivamente
export function useLocation() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return { pathname };
}

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Link({ to, children, className, style, onClick }: LinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}