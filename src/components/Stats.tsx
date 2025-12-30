import type { SessionResult, Operation } from '../types';

interface StatsProps {
  sessions: SessionResult[];
  formatTime: (ms: number) => string;
  onClear: () => void;
}

const MODULE_LABELS: Record<string, string> = {
  'arithmetic-grid': 'Arithmetic Grid',
  'digit-span': 'Digit Span',
};

const OPERATION_SYMBOLS: Record<Operation, string> = {
  '+': '+',
  '−': '−',
  '×': '×',
  '÷': '÷',
};

export function Stats({ sessions, formatTime, onClear }: StatsProps) {
  if (sessions.length === 0) {
    return null;
  }

  // Group by module
  const byModule = sessions.reduce((acc, session) => {
    const moduleId = session.moduleId ?? 'arithmetic-grid'; // fallback for old sessions
    if (!acc[moduleId]) acc[moduleId] = [];
    acc[moduleId].push(session);
    return acc;
  }, {} as Record<string, SessionResult[]>);

  const moduleIds = Object.keys(byModule);

  return (
    <details className="stats-panel">
      <summary>History ({sessions.length} sessions)</summary>
      <div className="stats-content">
        {moduleIds.map(moduleId => {
          const moduleSessions = byModule[moduleId].slice(-10).reverse();
          const showOperation = moduleId === 'arithmetic-grid';

          const isDigitSpan = moduleId === 'digit-span';

          return (
            <div key={moduleId} className="stats-group">
              <h4 className="stats-group-title">{MODULE_LABELS[moduleId] ?? moduleId}</h4>
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    {showOperation && <th>Op</th>}
                    <th>{isDigitSpan ? 'Span' : 'Size'}</th>
                    {isDigitSpan && <th>Dir</th>}
                    {!isDigitSpan && <th>Accuracy</th>}
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleSessions.map((session) => (
                    <tr key={session.timestamp}>
                      <td>{new Date(session.timestamp).toLocaleDateString()}</td>
                      {showOperation && <td>{OPERATION_SYMBOLS[session.operation]}</td>}
                      <td>{isDigitSpan ? session.gridSize.replace(' span', '') : session.gridSize}</td>
                      {isDigitSpan && <td>{session.direction === 'backward' ? '←' : '→'}</td>}
                      {!isDigitSpan && <td>{session.accuracy}%</td>}
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
