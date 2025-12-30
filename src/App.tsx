import { useCallback } from 'react';
import { Home } from './pages/Home';
import { ModuleWrapper } from './components/ModuleWrapper';
import { useHashRouter } from './hooks/useHashRouter';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { modules } from './modules';
import type { SessionResult, Stats } from './types';

function App() {
  const { route, navigate } = useHashRouter();
  const [stats, setStats] = useLocalStorage<Stats>('rewire-stats', { sessions: [] });
  const timer = useTimer();

  const handleModuleSelect = useCallback((moduleId: string) => {
    navigate({ page: 'module', moduleId });
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate({ page: 'home' });
  }, [navigate]);

  const handleSessionComplete = useCallback((result: SessionResult) => {
    const updated = [...stats.sessions, result].slice(-100);
    setStats({ sessions: updated });
  }, [stats.sessions, setStats]);

  const handleClearStats = useCallback(() => {
    setStats({ sessions: [] });
  }, [setStats]);

  return (
    <div className="app">
      {route.page === 'home' && (
        <Home
          modules={modules}
          stats={stats}
          onModuleSelect={handleModuleSelect}
          onClearStats={handleClearStats}
          formatTime={timer.formatTime}
        />
      )}

      {route.page === 'module' && (
        <ModuleWrapper
          moduleId={route.moduleId}
          onBack={handleBack}
          onSessionComplete={handleSessionComplete}
        />
      )}
    </div>
  );
}

export default App;
