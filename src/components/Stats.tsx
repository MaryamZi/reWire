import type { SessionResult } from '../types';

interface StatsProps {
  sessions: SessionResult[];
  formatTime: (ms: number) => string;
  onClear: () => void;
}

export function Stats({ sessions, formatTime, onClear }: StatsProps) {
  if (sessions.length === 0) {
    return null;
  }

  const recentSessions = sessions.slice(-10).reverse();

  return (
    <details className="stats-panel">
      <summary>History ({sessions.length} sessions)</summary>
      <div className="stats-content">
        <table className="stats-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Size</th>
              <th>Accuracy</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentSessions.map((session) => (
              <tr key={session.timestamp}>
                <td>{new Date(session.timestamp).toLocaleDateString()}</td>
                <td>{session.gridSize}</td>
                <td>{session.accuracy}%</td>
                <td>{session.timeMs !== null ? formatTime(session.timeMs) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="clear-stats-button" onClick={onClear}>
          Clear History
        </button>
      </div>
    </details>
  );
}
