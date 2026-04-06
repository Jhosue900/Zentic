import React, {
  useState,
  useEffect,
  useRef,
  ReactNode,
  useContext,
  createContext,
  Component,
} from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Route = {
  path: string;
  component: ReactNode;
};

interface RouterProps {
  routes: Route[];
}

// ─── matchRoute ───────────────────────────────────────────────────────────────

const matchRoute = (
  routePath: string,
  currentPath: string
): { matches: boolean; params: Record<string, string> } => {
  const routeParts = routePath.split('/');
  const currentParts = currentPath.split('/');

  if (routeParts.length !== currentParts.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      params[routeParts[i].slice(1)] = currentParts[i];
    } else if (routeParts[i] !== currentParts[i]) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
};

// ─── Contexto de parámetros ───────────────────────────────────────────────────

const RouterParamsContext = createContext<Record<string, string>>({});

export const RouterParamsProvider = ({
  params,
  children,
}: {
  params: Record<string, string>;
  children: ReactNode;
}) => (
  <RouterParamsContext.Provider value={params}>
    {children}
  </RouterParamsContext.Provider>
);

export function useParams(): Record<string, string> {
  return useContext(RouterParamsContext);
}

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  routeKey: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  prevRouteKey: string;
}

class RouteErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      prevRouteKey: props.routeKey,
    };
  }

  // Resetear el error automáticamente al cambiar de ruta
  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState
  ): Partial<ErrorBoundaryState> | null {
    if (props.routeKey !== state.prevRouteKey) {
      return {
        hasError: false,
        error: null,
        prevRouteKey: props.routeKey,
      };
    }
    return null;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Algo salió mal en esta página.</h2>
          <pre style={{ color: 'red', fontSize: '0.85rem' }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function Router({ routes }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const currentPathRef = useRef(currentPath);

  useEffect(() => {
    const onLocationChange = () => {
      const newPath = window.location.pathname;
      currentPathRef.current = newPath;
      setCurrentPath(newPath);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

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

  const currentRoute = matchedRoute ?? routes[0];

  const componentWithParams =
    Object.keys(matchedParams).length > 0 ? (
      <RouterParamsProvider params={matchedParams}>
        {currentRoute.component}
      </RouterParamsProvider>
    ) : (
      currentRoute.component
    );

  return (
    <main key={currentPath}>
      <RouteErrorBoundary routeKey={currentPath}>
        {componentWithParams}
      </RouteErrorBoundary>
    </main>
  );
}

// ─── Navegación ───────────────────────────────────────────────────────────────

export function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useNavigate() {
  return navigate;
}

export function useLocation() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  return { pathname };
}

// ─── Link ─────────────────────────────────────────────────────────────────────

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
    onClick?.();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}