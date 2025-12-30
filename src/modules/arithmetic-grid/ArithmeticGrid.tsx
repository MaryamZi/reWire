import { useState, useCallback } from 'react';
import { Controls } from './components/Controls';
import { Grid } from './components/Grid';
import { Results } from './components/Results';
import { useTimer } from '../../hooks/useTimer';
import {
  generateHeaders,
  createEmptyAnswers,
  validateAnswers,
  countCorrect
} from './utils/grid';
import type { GridConfig, GridData, SessionResult, AppPhase } from '../../types';
import type { ModuleProps } from '../../types/module';
import './ArithmeticGrid.css';

const DEFAULT_CONFIG: GridConfig = {
  rows: 4,
  cols: 4,
  operation: '+',
  timerEnabled: false
};

export function ArithmeticGrid({ onBack, onSessionComplete }: ModuleProps) {
  const [phase, setPhase] = useState<AppPhase>('setup');
  const [config, setConfig] = useState<GridConfig>(DEFAULT_CONFIG);
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [validation, setValidation] = useState<boolean[][] | null>(null);

  const timer = useTimer();

  const handleStart = useCallback(() => {
    const { rowHeaders, colHeaders } = generateHeaders(config.rows, config.cols, config.operation);
    const userAnswers = createEmptyAnswers(config.rows, config.cols);

    setGridData({ rowHeaders, colHeaders, userAnswers });
    setValidation(null);
    setPhase('active');
    timer.reset();

    if (config.timerEnabled) {
      timer.start();
    }
  }, [config, timer]);

  const handleAnswerChange = useCallback((row: number, col: number, value: number | null) => {
    if (!gridData) return;

    const newAnswers = gridData.userAnswers.map((r, ri) =>
      r.map((c, ci) => (ri === row && ci === col ? value : c))
    );

    setGridData({ ...gridData, userAnswers: newAnswers });
  }, [gridData]);

  const handleSubmit = useCallback(() => {
    if (!gridData) return;

    timer.stop();

    const result = validateAnswers(
      gridData.rowHeaders,
      gridData.colHeaders,
      gridData.userAnswers,
      config.operation
    );
    setValidation(result);

    const correctCount = countCorrect(result);
    const totalCells = config.rows * config.cols;
    const accuracy = Math.round((correctCount / totalCells) * 100);

    const sessionResult: SessionResult = {
      timestamp: Date.now(),
      moduleId: 'arithmetic-grid',
      operation: config.operation,
      gridSize: `${config.rows}×${config.cols}`,
      totalCells,
      correctCount,
      accuracy,
      timeMs: config.timerEnabled ? timer.elapsedMs : null
    };

    onSessionComplete(sessionResult);
    setPhase('results');
  }, [gridData, config, timer, onSessionComplete]);

  const handleTryAgain = useCallback(() => {
    setPhase('setup');
    setGridData(null);
    setValidation(null);
    timer.reset();
  }, [timer]);

  const allFilled = gridData?.userAnswers.flat().every(v => v !== null) ?? false;

  return (
    <>
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <header className="app-header">
        <h1>Arithmetic Grid</h1>
        <p className="tagline">Row {config.operation} Column</p>
      </header>

      <main className="app-main">
        {phase === 'setup' && (
          <Controls
            config={config}
            onConfigChange={setConfig}
            onStart={handleStart}
          />
        )}

        {(phase === 'active' || phase === 'results') && gridData && (
          <>
            {config.timerEnabled && phase === 'active' && (
              <div className="timer">{timer.formatTime(timer.elapsedMs)}</div>
            )}

            <Grid
              rowHeaders={gridData.rowHeaders}
              colHeaders={gridData.colHeaders}
              userAnswers={gridData.userAnswers}
              validation={validation}
              showResult={phase === 'results'}
              disabled={phase === 'results'}
              operation={config.operation}
              onAnswerChange={handleAnswerChange}
              onSubmit={phase === 'active' && allFilled ? handleSubmit : undefined}
            />

            {phase === 'active' && (
              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={!allFilled}
              >
                Submit
              </button>
            )}

            {phase === 'results' && validation && (
              <Results
                correctCount={countCorrect(validation)}
                totalCells={config.rows * config.cols}
                timeMs={config.timerEnabled ? timer.elapsedMs : null}
                formatTime={timer.formatTime}
                onTryAgain={handleTryAgain}
              />
            )}
          </>
        )}
      </main>
    </>
  );
}
