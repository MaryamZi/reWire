interface ResultsProps {
  correctCount: number;
  totalCells: number;
  timeMs: number | null;
  formatTime: (ms: number) => string;
  onTryAgain: () => void;
}

export function Results({
  correctCount,
  totalCells,
  timeMs,
  formatTime,
  onTryAgain
}: ResultsProps) {
  const accuracy = Math.round((correctCount / totalCells) * 100);
  const allCorrect = correctCount === totalCells;

  return (
    <div className="results">
      <div className="results-summary">
        <div className="result-item">
          <span className="result-label">Accuracy</span>
          <span className={`result-value ${allCorrect ? 'perfect' : ''}`}>
            {accuracy}%
          </span>
        </div>
        <div className="result-item">
          <span className="result-label">Correct</span>
          <span className="result-value">
            {correctCount} / {totalCells}
          </span>
        </div>
        {timeMs !== null && (
          <div className="result-item">
            <span className="result-label">Time</span>
            <span className="result-value">{formatTime(timeMs)}</span>
          </div>
        )}
      </div>
      <button className="try-again-button" onClick={onTryAgain}>
        Try Again
      </button>
    </div>
  );
}
