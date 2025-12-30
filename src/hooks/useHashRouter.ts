import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { page: 'home' }
  | { page: 'module'; moduleId: string };

function parseHash(): Route {
  const hash = window.location.hash.slice(1) || '/';
  if (hash.startsWith('/module/')) {
    return { page: 'module', moduleId: hash.slice(8) };
  }
  return { page: 'home' };
}

export function useHashRouter() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((newRoute: Route) => {
    if (newRoute.page === 'home') {
      window.location.hash = '/';
    } else {
      window.location.hash = `/module/${newRoute.moduleId}`;
    }
  }, []);

  return { route, navigate };
}
