import type { SessionResult, Operation } from '../types';

interface StatsProps {
  sessions: SessionResult[];
  formatTime: (ms: number) => string;
  onClear: () => void;
}

const OPERATION_LABELS: Record<Operation, string> = {
  '+': 'Addition',
  '−': 'Subtraction',
  '×': 'Multiplication',
  '÷': 'Division',
};

export function Stats({ sessions, formatTime, onClear }: StatsProps) {
  if (sessions.length === 0) {
    return null;
  }

  // Group by operation
  const byOperation = sessions.reduce((acc, session) => {
    const op = session.operation ?? '+'; // fallback for old sessions
    if (!acc[op]) acc[op] = [];
    acc[op].push(session);
    return acc;
  }, {} as Record<Operation, SessionResult[]>);

  const operations = Object.keys(byOperation) as Operation[];

  return (
    <details className="stats-panel">
      <summary>History ({sessions.length} sessions)</summary>
      <div className="stats-content">
        {operations.map(op => {
          const opSessions = byOperation[op].slice(-10).reverse();
          return (
            <div key={op} className="stats-group">
              <h4 className="stats-group-title">{OPERATION_LABELS[op]}</h4>
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
                  {opSessions.map((session) => (
                    <tr key={session.timestamp}>
                      <td>{new Date(session.timestamp).toLocaleDateString()}</td>
                      <td>{session.gridSize}</td>
                      <td>{session.accuracy}%</td>
                      <td>{session.timeMs !== null ? formatTime(session.timeMs) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
        <button className="clear-stats-button" onClick={onClear}>
          Clear History
        </button>
      </div>
    </details>
  );
}
