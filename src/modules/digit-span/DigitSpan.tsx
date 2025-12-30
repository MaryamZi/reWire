import { useState, useCallback, useRef, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import type { ModuleProps } from '../../types/module';
import type { SessionResult } from '../../types';
import './DigitSpan.css';

type Phase = 'setup' | 'memorize' | 'recall' | 'feedback' | 'results';

interface Settings {
  startingLength: number;
  digitDuration: number; // ms per digit
  direction: 'forward' | 'backward';
}

interface TrialResult {
  sequence: number[];
  response: number[];
  correct: boolean;
}

function generateSequence(length: number): number[] {
  const digits: number[] = [];
  for (let i = 0; i < length; i++) {
    digits.push(Math.floor(Math.random() * 10));
  }
  return digits;
}

export function DigitSpan({ onBack, onSessionComplete }: ModuleProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [settings, setSettings] = useState<Settings>({
    startingLength: 4,
    digitDuration: 800,
    direction: 'forward'
  });

  const [currentLength, setCurrentLength] = useState(4);
  const [sequence, setSequence] = useState<number[]>([]);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [trials, setTrials] = useState<TrialResult[]>([]);
  const [maxSpan, setMaxSpan] = useState(0);
  
  const timer = useTimer();
  const inputRef = useRef<HTMLInputElement>(null);

  // Display digits one at a time during memorize phase
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (displayIndex < sequence.length) {
      const timeout = setTimeout(() => {
        setDisplayIndex(prev => prev + 1);
      }, settings.digitDuration);
      return () => clearTimeout(timeout);
    } else {
      // Brief pause after last digit, then move to recall
      const timeout = setTimeout(() => {
        setPhase('recall');
        setUserInput('');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [phase, displayIndex, sequence.length, settings.digitDuration]);

  // Focus input when entering recall phase
  useEffect(() => {
    if (phase === 'recall' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const startSession = useCallback(() => {
    const length = settings.startingLength;
    setCurrentLength(length);
    setTrials([]);
    setMaxSpan(0);
    timer.start();
    startTrial(length);
  }, [settings.startingLength, timer]);

  const startTrial = useCallback((length: number) => {
    const newSequence = generateSequence(length);
    setSequence(newSequence);
    setDisplayIndex(0);
    setPhase('memorize');
  }, []);

  const handleSubmit = useCallback(() => {
    const response = userInput.split('').map(Number);
    const expectedSequence = settings.direction === 'backward'
      ? [...sequence].reverse()
      : sequence;

    const correct = response.length === expectedSequence.length &&
      response.every((digit, i) => digit === expectedSequence[i]);

    const trial: TrialResult = {
      sequence: [...sequence],
      response,
      correct
    };

    setTrials(prev => [...prev, trial]);

    if (correct) {
      const newMax = Math.max(maxSpan, currentLength);
      setMaxSpan(newMax);
      setPhase('feedback');

      // Move to next length after brief feedback
      setTimeout(() => {
        const nextLength = currentLength + 1;
        setCurrentLength(nextLength);
        startTrial(nextLength);
      }, 1000);
    } else {
      // Session ends on first mistake
      timer.stop();
      const finalMax = Math.max(maxSpan, currentLength - 1);
      setMaxSpan(finalMax > 0 ? finalMax : currentLength - 1);
      setPhase('results');
    }
  }, [userInput, sequence, settings.direction, currentLength, maxSpan, timer, startTrial]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.length > 0) {
      handleSubmit();
    }
  }, [handleSubmit, userInput]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    setUserInput(value);
  }, []);

  const finishSession = useCallback(() => {
    const result: SessionResult = {
      timestamp: Date.now(),
      moduleId: 'digit-span',
      operation: '+', // Not applicable, but required by type
      gridSize: `${maxSpan} span`,
      totalCells: trials.length,
      correctCount: trials.filter(t => t.correct).length,
      accuracy: trials.length > 0
        ? Math.round((trials.filter(t => t.correct).length / trials.length) * 100)
        : 0,
      timeMs: timer.elapsedMs,
      direction: settings.direction
    };
    onSessionComplete(result);
    onBack();
  }, [maxSpan, trials, timer.elapsedMs, settings.direction, onSessionComplete, onBack]);

  const resetSession = useCallback(() => {
    setPhase('setup');
    setTrials([]);
    setMaxSpan(0);
    timer.reset();
  }, [timer]);

  // Setup phase
  if (phase === 'setup') {
    return (
      <div className="digit-span">
        <header className="module-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h2>Digit Span</h2>
        </header>

        <div className="setup-panel">
          <div className="setting-group">
            <label>Starting Length</label>
            <div className="button-group">
              {[3, 4, 5, 6].map(len => (
                <button
                  key={len}
                  className={settings.startingLength === len ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, startingLength: len }))}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Speed</label>
            <div className="button-group">
              <button
                className={settings.digitDuration === 1200 ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, digitDuration: 1200 }))}
              >
                Slow
              </button>
              <button
                className={settings.digitDuration === 800 ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, digitDuration: 800 }))}
              >
                Normal
              </button>
              <button
                className={settings.digitDuration === 500 ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, digitDuration: 500 }))}
              >
                Fast
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label>Direction</label>
            <div className="button-group">
              <button
                className={settings.direction === 'forward' ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, direction: 'forward' }))}
              >
                Forward
              </button>
              <button
                className={settings.direction === 'backward' ? 'active' : ''}
                onClick={() => setSettings(s => ({ ...s, direction: 'backward' }))}
              >
                Backward
              </button>
            </div>
          </div>

          <button className="start-button" onClick={startSession}>
            Start
          </button>
        </div>
      </div>
    );
  }

  // Memorize phase - showing digits
  if (phase === 'memorize') {
    return (
      <div className="digit-span">
        <header className="module-header">
          <span className="span-indicator">Length: {currentLength}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="display-area">
          <div className="digit-display">
            {displayIndex < sequence.length ? (
              <span key={displayIndex} className="digit">{sequence[displayIndex]}</span>
            ) : (
              <span className="digit fade">·</span>
            )}
          </div>
          <p className="instruction">Memorize</p>
        </div>
      </div>
    );
  }

  // Recall phase - user input
  if (phase === 'recall') {
    return (
      <div className="digit-span">
        <header className="module-header">
          <span className="span-indicator">Length: {currentLength}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="display-area">
          <div className="input-area">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={settings.direction === 'backward' ? 'Type backward...' : 'Type the digits...'}
              autoComplete="off"
            />
          </div>
          <p className="instruction">
            {settings.direction === 'backward' ? 'Recall Backward' : 'Recall'}
          </p>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={userInput.length === 0}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  // Feedback phase - brief correct indicator
  if (phase === 'feedback') {
    return (
      <div className="digit-span">
        <header className="module-header">
          <span className="span-indicator">Length: {currentLength}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="display-area">
          <div className="feedback correct">✓</div>
          <p className="instruction">Correct! Next: {currentLength + 1} digits</p>
        </div>
      </div>
    );
  }

  // Results phase
  return (
    <div className="digit-span">
      <header className="module-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h2>Results</h2>
      </header>

      <div className="results-panel">
        <div className="result-main">
          <span className="result-label">Max Span</span>
          <span className="result-value">{maxSpan}</span>
        </div>

        <div className="result-stats">
          <div className="stat">
            <span className="stat-label">Sequences</span>
            <span className="stat-value">{trials.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time</span>
            <span className="stat-value">{timer.formatTime(timer.elapsedMs)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Direction</span>
            <span className="stat-value">{settings.direction}</span>
          </div>
        </div>

        <div className="trial-history">
          <h4>Attempts</h4>
          {trials.map((trial, i) => (
            <div key={i} className={`trial ${trial.correct ? 'correct' : 'incorrect'}`}>
              <span className="trial-seq">{trial.sequence.join(' ')}</span>
              <span className="trial-arrow">→</span>
              <span className="trial-resp">{trial.response.join(' ') || '(empty)'}</span>
              <span className="trial-mark">{trial.correct ? '✓' : '✗'}</span>
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
