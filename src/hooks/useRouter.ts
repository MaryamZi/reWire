import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { page: 'home' }
  | { page: 'module'; moduleId: string };

function parsePath(): Route {
  const path = window.location.pathname;
  if (path.startsWith('/module/')) {
    return { page: 'module', moduleId: path.slice(8) };
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
    const path = newRoute.page === 'home' ? '/' : `/module/${newRoute.moduleId}`;
    window.history.pushState(null, '', path);
    setRoute(newRoute);
  }, []);

  return { route, navigate };
}
