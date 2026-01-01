import { useState, useCallback, useRef, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { generateSequence, type Difficulty, type Sequence } from './sequences';
import type { ModuleProps } from '../../types/module';
import type { SessionResult } from '../../types';
import './NumberSequences.css';

type Phase = 'setup' | 'active' | 'feedback' | 'results';

interface Settings {
  sequenceCount: number;
  difficulty: Difficulty;
}

interface Trial {
  sequence: Sequence;
  userAnswer: number | null;
  correct: boolean;
  responseTimeMs: number;
}

export function NumberSequences({ onBack, onSessionComplete }: ModuleProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [settings, setSettings] = useState<Settings>({
    sequenceCount: 10,
    difficulty: 'medium'
  });

  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [currentSequence, setCurrentSequence] = useState<Sequence | null>(null);
  const [userInput, setUserInput] = useState('');
  const [trialStartTime, setTrialStartTime] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useTimer();

  const startNextTrial = useCallback(() => {
    const sequence = generateSequence(settings.difficulty);
    setCurrentSequence(sequence);
    setUserInput('');
    setTrialStartTime(Date.now());
    setPhase('active');
  }, [settings.difficulty]);

  const startSession = useCallback(() => {
    setTrials([]);
    setCurrentTrialIndex(0);
    timer.start();
    startNextTrial();
  }, [timer, startNextTrial]);

  // Focus input when entering active phase
  useEffect(() => {
    if (phase === 'active' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentTrialIndex]);

  const submitAnswer = useCallback(() => {
    if (phase !== 'active' || !currentSequence) return;

    const responseTime = Date.now() - trialStartTime;
    const userAnswer = parseInt(userInput, 10);
    const correct = !isNaN(userAnswer) && userAnswer === currentSequence.answer;

    const trial: Trial = {
      sequence: currentSequence,
      userAnswer: isNaN(userAnswer) ? null : userAnswer,
      correct,
      responseTimeMs: responseTime
    };

    setTrials(prev => [...prev, trial]);
    setLastCorrect(correct);
    setPhase('feedback');

    setTimeout(() => {
      const nextIndex = currentTrialIndex + 1;
      if (nextIndex >= settings.sequenceCount) {
        timer.stop();
        setPhase('results');
      } else {
        setCurrentTrialIndex(nextIndex);
        startNextTrial();
      }
    }, 500);
  }, [phase, currentSequence, userInput, trialStartTime, currentTrialIndex, settings.sequenceCount, timer, startNextTrial]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  }, [submitAnswer]);

  const correctCount = trials.filter(t => t.correct).length;
  const accuracy = trials.length > 0 ? Math.round((correctCount / trials.length) * 100) : 0;
  const avgResponseTime = trials.length > 0
    ? Math.round(trials.reduce((sum, t) => sum + t.responseTimeMs, 0) / trials.length)
    : 0;

  const finishSession = useCallback(() => {
    const result: SessionResult = {
      timestamp: Date.now(),
      moduleId: 'number-sequences',
      operation: '+',
      gridSize: `${settings.sequenceCount} sequences`,
      totalCells: trials.length,
      correctCount,
      accuracy,
      timeMs: timer.elapsedMs
    };
    onSessionComplete(result);
    onBack();
  }, [settings.sequenceCount, trials.length, correctCount, accuracy, timer.elapsedMs, onSessionComplete, onBack]);

  const resetSession = useCallback(() => {
    setPhase('setup');
    setTrials([]);
    setCurrentTrialIndex(0);
    setUserInput('');
    timer.reset();
  }, [timer]);

  // Setup phase
  if (phase === 'setup') {
    return (
      <div className="number-sequences">
        <header className="module-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h2>Number Sequences</h2>
        </header>

        <div className="setup-panel">
          <p className="instructions">
            Find the pattern. Enter the next number.
          </p>

          <div className="setting-group">
            <label>Sequences</label>
            <div className="button-group">
              {[5, 10, 15].map(count => (
                <button
                  key={count}
                  className={settings.sequenceCount === count ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, sequenceCount: count }))}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-group">
            <label>Difficulty</label>
            <div className="button-group">
              {(['easy', 'medium', 'hard', 'mixed'] as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  className={settings.difficulty === diff ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, difficulty: diff }))}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
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

  // Active / Feedback phase
  if ((phase === 'active' || phase === 'feedback') && currentSequence) {
    return (
      <div className="number-sequences">
        <header className="module-header">
          <span className="progress">{currentTrialIndex + 1} / {settings.sequenceCount}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="play-area">
          <div className={`sequence-display ${phase === 'feedback' ? (lastCorrect ? 'correct' : 'incorrect') : ''}`}>
            <div className="sequence-numbers">
              {currentSequence.numbers.map((num, idx) => (
                <span key={idx} className="sequence-number">{num}</span>
              ))}
              <span className="sequence-number unknown">?</span>
            </div>
          </div>

          <div className="answer-input">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={userInput}
              onChange={e => setUserInput(e.target.value.replace(/[^0-9-]/g, ''))}
              onKeyDown={handleKeyDown}
              placeholder="?"
              disabled={phase === 'feedback'}
              autoComplete="off"
            />
            <button
              className="submit-button"
              onClick={submitAnswer}
              disabled={phase === 'feedback' || userInput === ''}
            >
              Enter
            </button>
          </div>

          {phase === 'feedback' && (
            <div className={`feedback-text ${lastCorrect ? 'correct' : 'incorrect'}`}>
              {lastCorrect ? 'Correct!' : `${currentSequence.answer}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results phase
  return (
    <div className="number-sequences">
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
            <span className="stat-value">{(avgResponseTime / 1000).toFixed(1)}s</span>
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
