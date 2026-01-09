import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { page: 'home' }
  | { page: 'module'; moduleId: string };

// Base path from Vite config (e.g., '/' for local, '/reWire/' for subpath deployments)
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

function parsePath(): Route {
  const path = window.location.pathname;
  const relativePath = path.startsWith(BASE_PATH)
    ? path.slice(BASE_PATH.length)
    : path;

  if (relativePath.startsWith('/module/')) {
    return { page: 'module', moduleId: relativePath.slice(8) };
  }
  return { page: 'home' };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parsePath);

  useEffect(() => {
    const handlePopState = () => setRoute(parsePath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((newRoute: Route) => {
    const relativePath = newRoute.page === 'home' ? '/' : `/module/${newRoute.moduleId}`;
    const fullPath = `${BASE_PATH}${relativePath}`;
    window.history.pushState(null, '', fullPath);
    setRoute(newRoute);
  }, []);

  return { route, navigate };
}
