import { useState, useCallback, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import {
  generateDirections,
  applyRelativeDirection,
  cellsMatch,
  directionsToText,
  DIRECTION_KEYS,
  FACING_ARROWS,
  type Cell,
  type Facing,
  type RelativeDirection,
  type DirectionSet
} from './paths';
import type { ModuleProps } from '../../types/module';
import type { SessionResult } from '../../types';
import './MentalMap.css';

type Phase = 'setup' | 'read' | 'navigate' | 'feedback' | 'results';

interface Settings {
  gridSize: number;
  stepCount: number;
  rounds: number;
  readTime: number; // seconds
}

interface TrialResult {
  directions: DirectionSet;
  finalPosition: Cell;
  correct: boolean;
}

interface PositionState {
  cell: Cell;
  facing: Facing;
}

function cellKey(cell: Cell): string {
  return `${cell[0]},${cell[1]}`;
}

export function MentalMap({ onBack, onSessionComplete }: ModuleProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [settings, setSettings] = useState<Settings>({
    gridSize: 5,
    stepCount: 5,
    rounds: 3,
    readTime: 5
  });

  const [currentRound, setCurrentRound] = useState(0);
  const [currentDirections, setCurrentDirections] = useState<DirectionSet | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Cell>([0, 0]);
  const [currentFacing, setCurrentFacing] = useState<Facing>('north');
  const [moveHistory, setMoveHistory] = useState<PositionState[]>([]);
  const [trials, setTrials] = useState<TrialResult[]>([]);
  const [countdown, setCountdown] = useState(0);

  const timer = useTimer();

  // Countdown during read phase
  useEffect(() => {
    if (phase !== 'read') return;

    if (countdown > 0) {
      const timeout = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      // Time's up, move to navigate
      setPhase('navigate');
    }
  }, [phase, countdown]);

  const startSession = useCallback(() => {
    setTrials([]);
    setCurrentRound(0);
    timer.start();
    startRound();
  }, [timer]);

  const startRound = useCallback(() => {
    const directions = generateDirections(settings.gridSize, settings.stepCount);
    setCurrentDirections(directions);
    setCurrentPosition(directions.start);
    setCurrentFacing(directions.startFacing);
    setMoveHistory([]);
    setCountdown(settings.readTime);
    setPhase('read');
  }, [settings.gridSize, settings.stepCount, settings.readTime]);

  const handleSubmit = useCallback(() => {
    if (!currentDirections) return;

    const correct = cellsMatch(currentPosition, currentDirections.end);

    const trial: TrialResult = {
      directions: currentDirections,
      finalPosition: currentPosition,
      correct
    };

    const newTrials = [...trials, trial];
    setTrials(newTrials);

    // Show feedback
    setPhase('feedback');

    const nextRound = currentRound + 1;
    const isLastRound = nextRound >= settings.rounds;

    if (isLastRound) {
      timer.stop();
    }

    setTimeout(() => {
      if (isLastRound) {
        setPhase('results');
      } else {
        setCurrentRound(nextRound);
        startRound();
      }
    }, 1500);
  }, [currentDirections, currentPosition, trials, currentRound, settings.rounds, timer, startRound]);

  // Move handler for both keyboard and touch
  const handleMove = useCallback((direction: RelativeDirection) => {
    if (phase !== 'navigate' || !currentDirections) return;

    const result = applyRelativeDirection(currentPosition, currentFacing, direction, settings.gridSize);
    if (result) {
      setMoveHistory(prev => [...prev, { cell: currentPosition, facing: currentFacing }]);
      setCurrentPosition(result.cell);
      setCurrentFacing(result.facing);
    }
  }, [phase, currentPosition, currentFacing, currentDirections, settings.gridSize]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'navigate' || !currentDirections) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
        return;
      }

      const direction = DIRECTION_KEYS[e.key];
      if (!direction) return;

      e.preventDefault();
      handleMove(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentDirections, handleSubmit, handleMove]);

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0) return;
    const previous = moveHistory[moveHistory.length - 1];
    setCurrentPosition(previous.cell);
    setCurrentFacing(previous.facing);
    setMoveHistory(prev => prev.slice(0, -1));
  }, [moveHistory]);

  const correctCount = trials.filter(t => t.correct).length;
  const accuracy = trials.length > 0
    ? Math.round((correctCount / trials.length) * 100)
    : 0;

  const finishSession = useCallback(() => {
    const result: SessionResult = {
      timestamp: Date.now(),
      moduleId: 'mental-map',
      operation: '+',
      gridSize: `${settings.gridSize}×${settings.gridSize}`,
      totalCells: trials.length,
      correctCount,
      accuracy,
      timeMs: timer.elapsedMs
    };
    onSessionComplete(result);
    onBack();
  }, [settings.gridSize, trials.length, correctCount, accuracy, timer.elapsedMs, onSessionComplete, onBack]);

  const resetSession = useCallback(() => {
    setPhase('setup');
    setTrials([]);
    setCurrentRound(0);
    timer.reset();
  }, [timer]);

  // Setup phase
  if (phase === 'setup') {
    return (
      <div className="mental-map">
        <header className="module-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h2>Mental Map</h2>
        </header>

        <div className="setup-panel">
          <p className="instructions">
            Memorize the directions, then navigate to the target.
          </p>

          <div className="setting-group">
            <label>Grid Size</label>
            <div className="button-group">
              {[4, 5, 6].map(size => (
                <button
                  key={size}
                  className={settings.gridSize === size ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, gridSize: size }))}
                >
                  {size}×{size}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Steps</label>
            <div className="button-group">
              {[4, 5, 6].map(count => (
                <button
                  key={count}
                  className={settings.stepCount === count ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, stepCount: count }))}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Rounds</label>
            <div className="button-group">
              {[1, 3, 5].map(r => (
                <button
                  key={r}
                  className={settings.rounds === r ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, rounds: r }))}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Read Time</label>
            <div className="button-group">
              {[3, 5, 8].map(t => (
                <button
                  key={t}
                  className={settings.readTime === t ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, readTime: t }))}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          <button className="start-button" onClick={startSession}>
            Start
          </button>
        </div>
      </div>
    );
  }

  // Grid renderer
  const renderGrid = (showTarget: boolean, showFacing: boolean = true) => {
    const cells = [];

    for (let row = 0; row < settings.gridSize; row++) {
      for (let col = 0; col < settings.gridSize; col++) {
        const key = cellKey([row, col]);
        const isCurrentPosition = currentPosition[0] === row && currentPosition[1] === col;
        const isTarget = showTarget && currentDirections &&
          currentDirections.end[0] === row && currentDirections.end[1] === col;
        const isStart = currentDirections &&
          currentDirections.start[0] === row && currentDirections.start[1] === col;

        let className = 'grid-cell';
        let content: React.ReactNode = null;

        if (phase === 'feedback') {
          if (isCurrentPosition && isTarget) {
            className += ' correct';
            content = '✓';
          } else if (isCurrentPosition) {
            className += ' incorrect current';
            content = '✗';
          } else if (isTarget) {
            className += ' target';
            content = '◎';
          }
        } else if (isCurrentPosition) {
          className += ' current';
          content = showFacing ? FACING_ARROWS[currentFacing] : '●';
        } else if (phase === 'read' && isStart) {
          className += ' start';
          content = currentDirections ? FACING_ARROWS[currentDirections.startFacing] : '○';
        }

        cells.push(
          <div key={key} className={className}>
            {content}
          </div>
        );
      }
    }

    return (
      <div
        className="map-grid"
        style={{
          gridTemplateColumns: `repeat(${settings.gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${settings.gridSize}, 1fr)`
        }}
      >
        {cells}
      </div>
    );
  };

  // Read phase
  if (phase === 'read' && currentDirections) {
    return (
      <div className="mental-map">
        <header className="module-header">
          <span className="round-indicator">Round {currentRound + 1}/{settings.rounds}</span>
          <span className="countdown">{countdown}s</span>
        </header>

        <div className="play-area">
          <p className="phase-label">Memorize the directions</p>

          <div className="directions-display">
            <p className="directions-text">
              {directionsToText(currentDirections.directions)}
            </p>
          </div>

          {renderGrid(false)}
        </div>
      </div>
    );
  }

  // Navigate phase
  if (phase === 'navigate' && currentDirections) {
    return (
      <div className="mental-map">
        <header className="module-header">
          <span className="round-indicator">Round {currentRound + 1}/{settings.rounds}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="play-area">
          <p className="phase-label">Navigate to target</p>

          {renderGrid(false)}

          <div className="dpad">
            <button
              className="dpad-btn dpad-up"
              onClick={() => handleMove('forward')}
              aria-label="Move forward"
            >
              ↑
            </button>
            <button
              className="dpad-btn dpad-left"
              onClick={() => handleMove('left')}
              aria-label="Turn left and move"
            >
              ←
            </button>
            <button
              className="dpad-btn dpad-right"
              onClick={() => handleMove('right')}
              aria-label="Turn right and move"
            >
              →
            </button>
            <button
              className="dpad-btn dpad-down"
              onClick={() => handleMove('back')}
              aria-label="Turn back and move"
            >
              ↓
            </button>
          </div>

          <div className="navigate-actions">
            <span className="move-count">{moveHistory.length} moves</span>
            <button
              className="undo-button"
              onClick={handleUndo}
              disabled={moveHistory.length === 0}
            >
              Undo
            </button>
            <button
              className="submit-button"
              onClick={handleSubmit}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Feedback phase
  if (phase === 'feedback' && currentDirections) {
    const lastTrial = trials[trials.length - 1];
    return (
      <div className="mental-map">
        <header className="module-header">
          <span className="round-indicator">Round {currentRound + 1}/{settings.rounds}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="play-area">
          <p className={`phase-label feedback-result ${lastTrial.correct ? 'correct' : 'incorrect'}`}>
            {lastTrial.correct ? 'Correct!' : 'Wrong spot'}
          </p>
          {renderGrid(true, false)}
        </div>
      </div>
    );
  }

  // Results phase
  return (
    <div className="mental-map">
      <header className="module-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Results</h2>
      </header>

      <div className="results-panel">
        <div className="result-main">
          <span className="result-label">Accuracy</span>
          <span className="result-value">{accuracy}%</span>
        </div>

        <div className="result-stats">
          <div className="stat">
            <span className="stat-label">Correct</span>
            <span className="stat-value">{correctCount}/{trials.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Rounds</span>
            <span className="stat-value">{trials.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timer.formatTime(timer.elapsedMs)}</span>
          </div>
        </div>

        <div className="trial-summary">
          {trials.map((trial, i) => (
            <div key={i} className={`trial-row ${trial.correct ? 'correct' : 'incorrect'}`}>
              <span className="trial-label">Round {i + 1}</span>
              <span className="trial-result">{trial.correct ? '✓' : '✗'}</span>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button onClick={resetSession}>Try Again</button>
          <button onClick={finishSession}>Done</button>
        </div>
      </div>
    </div>
  );
}
