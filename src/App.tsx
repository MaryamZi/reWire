import { useCallback, useEffect, useRef } from 'react';
import { Home } from './pages/Home';
import { ModuleWrapper } from './components/ModuleWrapper';
import { useRouter } from './hooks/useRouter';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { modules } from './modules';
import type { SessionResult, Stats } from './types';

// Keep max 10 entries, favoring diversity across modules
function pruneSessions(sessions: SessionResult[]): SessionResult[] {
  if (sessions.length <= 10) return sessions;

  // 1. Get the latest session for each module
  const latestByModule = new Map<string, SessionResult>();
  for (const session of sessions) {
    const existing = latestByModule.get(session.moduleId);
    if (!existing || session.timestamp > existing.timestamp) {
      latestByModule.set(session.moduleId, session);
    }
  }

  // 2. Start with one entry per module (most recent for each)
  const kept = Array.from(latestByModule.values());

  // 3. If under 10, fill with remaining recent sessions
  if (kept.length < 10) {
    const keptTimestamps = new Set(kept.map(s => s.timestamp));
    const remaining = sessions
      .filter(s => !keptTimestamps.has(s.timestamp))
      .sort((a, b) => b.timestamp - a.timestamp);

    for (const session of remaining) {
      if (kept.length >= 10) break;
      kept.push(session);
    }
  }

  // 4. Sort by timestamp and limit to 10
  return kept.sort((a, b) => a.timestamp - b.timestamp).slice(-10);
}

function App() {
  const { route, navigate } = useRouter();
  const [stats, setStats] = useLocalStorage<Stats>('rewire-stats', { sessions: [] });
  const timer = useTimer();
  const hasPruned = useRef(false);

  // Prune existing sessions on first load
  useEffect(() => {
    if (!hasPruned.current && stats.sessions.length > 10) {
      hasPruned.current = true;
      setStats({ sessions: pruneSessions(stats.sessions) });
    }
  }, [stats.sessions, setStats]);

  const handleModuleSelect = useCallback((moduleId: string) => {
    navigate({ page: 'module', moduleId });
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate({ page: 'home' });
  }, [navigate]);

  const handleSessionComplete = useCallback((result: SessionResult) => {
    const updated = pruneSessions([...stats.sessions, result]);
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
