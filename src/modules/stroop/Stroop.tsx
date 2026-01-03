import { useState, useCallback, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import type { ModuleProps } from '../../types/module';
import type { SessionResult } from '../../types';
import './Stroop.css';

type Phase = 'setup' | 'active' | 'feedback' | 'results';
type StroopMode = 'incongruent' | 'congruent' | 'mixed';

interface Settings {
  trialCount: number;
  mode: StroopMode;
}

interface Trial {
  word: ColorName;
  inkColor: ColorName;
  response: ColorName | null;
  correct: boolean;
  responseTimeMs: number | null;
}

type ColorName = 'red' | 'blue' | 'green' | 'yellow';

const COLORS: ColorName[] = ['red', 'blue', 'green', 'yellow'];

const COLOR_VALUES: Record<ColorName, string> = {
  red: '#dc3545',
  blue: '#0d6efd',
  green: '#198754',
  yellow: '#ffc107'
};

const COLOR_LABELS: Record<ColorName, string> = {
  red: 'RED',
  blue: 'BLUE',
  green: 'GREEN',
  yellow: 'YELLOW'
};

function generateTrial(mode: StroopMode): { word: ColorName; inkColor: ColorName } {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];

  if (mode === 'congruent') {
    return { word, inkColor: word };
  }

  if (mode === 'incongruent') {
    const otherColors = COLORS.filter(c => c !== word);
    const inkColor = otherColors[Math.floor(Math.random() * otherColors.length)];
    return { word, inkColor };
  }

  // Mixed mode: 50/50 chance
  if (Math.random() < 0.5) {
    return { word, inkColor: word };
  }
  const otherColors = COLORS.filter(c => c !== word);
  const inkColor = otherColors[Math.floor(Math.random() * otherColors.length)];
  return { word, inkColor };
}

export function Stroop({ onBack, onSessionComplete }: ModuleProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [settings, setSettings] = useState<Settings>({
    trialCount: 20,
    mode: 'incongruent'
  });

  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<ColorName>('red');
  const [currentInkColor, setCurrentInkColor] = useState<ColorName>('blue');
  const [trialStartTime, setTrialStartTime] = useState<number>(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const timer = useTimer();

  const startNextTrial = useCallback(() => {
    const { word, inkColor } = generateTrial(settings.mode);
    setCurrentWord(word);
    setCurrentInkColor(inkColor);
    setTrialStartTime(Date.now());
    setPhase('active');
  }, [settings.mode]);

  const startSession = useCallback(() => {
    setTrials([]);
    setCurrentTrialIndex(0);
    timer.start();
    startNextTrial();
  }, [timer, startNextTrial]);

  const handleColorClick = useCallback((color: ColorName) => {
    if (phase !== 'active') return;

    const responseTime = Date.now() - trialStartTime;
    const correct = color === currentInkColor;

    const trial: Trial = {
      word: currentWord,
      inkColor: currentInkColor,
      response: color,
      correct,
      responseTimeMs: responseTime
    };

    setTrials(prev => [...prev, trial]);
    setLastCorrect(correct);
    setPhase('feedback');

    const nextIndex = currentTrialIndex + 1;
    const isLastTrial = nextIndex >= settings.trialCount;

    if (isLastTrial) {
      timer.stop();
    }

    // Brief feedback, then next trial or results
    setTimeout(() => {
      if (isLastTrial) {
        setPhase('results');
      } else {
        setCurrentTrialIndex(nextIndex);
        startNextTrial();
      }
    }, 400);
  }, [phase, trialStartTime, currentInkColor, currentWord, currentTrialIndex, settings.trialCount, timer, startNextTrial]);

  // Keyboard support
  useEffect(() => {
    if (phase !== 'active') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, ColorName> = {
        'r': 'red',
        'b': 'blue',
        'g': 'green',
        'y': 'yellow'
      };
      const color = keyMap[e.key.toLowerCase()];
      if (color) {
        handleColorClick(color);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleColorClick]);

  const correctCount = trials.filter(t => t.correct).length;
  const accuracy = trials.length > 0 ? Math.round((correctCount / trials.length) * 100) : 0;
  const avgResponseTime = trials.length > 0
    ? Math.round(trials.reduce((sum, t) => sum + (t.responseTimeMs || 0), 0) / trials.length)
    : 0;

  const finishSession = useCallback(() => {
    const result: SessionResult = {
      timestamp: Date.now(),
      moduleId: 'stroop',
      operation: '+', // Not applicable
      gridSize: `${settings.trialCount} trials`,
      totalCells: trials.length,
      correctCount,
      accuracy,
      timeMs: timer.elapsedMs
    };
    onSessionComplete(result);
    onBack();
  }, [settings.trialCount, trials.length, correctCount, accuracy, timer.elapsedMs, onSessionComplete, onBack]);

  const resetSession = useCallback(() => {
    setPhase('setup');
    setTrials([]);
    setCurrentTrialIndex(0);
    timer.reset();
  }, [timer]);

  // Setup phase
  if (phase === 'setup') {
    return (
      <div className="stroop">
        <header className="module-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h2>Stroop Test</h2>
        </header>

        <div className="setup-panel">
          <p className="instructions">
            Name the <strong>ink color</strong>, not the word.
          </p>

          <div className="setting-group">
            <label>Trials</label>
            <div className="button-group">
              {[10, 20, 30].map(count => (
                <button
                  key={count}
                  className={settings.trialCount === count ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, trialCount: count }))}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Mode</label>
            <div className="button-group">
              <button
                className={settings.mode === 'incongruent' ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, mode: 'incongruent' }))}
              >
                Hard
              </button>
              <button
                className={settings.mode === 'mixed' ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, mode: 'mixed' }))}
              >
                Mixed
              </button>
              <button
                className={settings.mode === 'congruent' ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, mode: 'congruent' }))}
              >
                Easy
              </button>
            </div>
          </div>

          <div className="key-hint">
            Keyboard: <span className="key">R</span> <span className="key">B</span> <span className="key">G</span> <span className="key">Y</span>
          </div>

          <button className="start-button" onClick={startSession}>
            Start
          </button>
        </div>
      </div>
    );
  }

  // Active / Feedback phase
  if (phase === 'active' || phase === 'feedback') {
    return (
      <div className="stroop">
        <header className="module-header">
          <span className="progress">{currentTrialIndex + 1} / {settings.trialCount}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="play-area">
          <div className={`word-display ${phase === 'feedback' ? (lastCorrect ? 'correct' : 'incorrect') : ''}`}>
            <span style={{ color: COLOR_VALUES[currentInkColor] }}>
              {COLOR_LABELS[currentWord]}
            </span>
          </div>

          <div className="color-buttons">
            {COLORS.map(color => (
              <button
                key={color}
                className="color-button"
                style={{ backgroundColor: COLOR_VALUES[color] }}
                onClick={() => handleColorClick(color)}
                disabled={phase === 'feedback'}
                aria-label={color}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results phase
  return (
    <div className="stroop">
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
            <span className="stat-label">Avg Time</span>
            <span className="stat-value">{avgResponseTime}ms</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{timer.formatTime(timer.elapsedMs)}</span>
          </div>
        </div>

        <div className="result-actions">
          <button onClick={resetSession}>Try Again</button>
          <button onClick={finishSession}>Done</button>
        </div>
      </div>
    </div>
  );
}
