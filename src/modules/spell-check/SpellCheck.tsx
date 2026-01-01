import { useState, useCallback, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { generateTrials, type Trial } from './words';
import type { ModuleProps } from '../../types/module';
import type { SessionResult } from '../../types';
import './SpellCheck.css';

type Phase = 'setup' | 'active' | 'feedback' | 'results';

interface Settings {
  wordCount: number;
}

interface CompletedTrial extends Trial {
  userSaidCorrect: boolean;
  wasRight: boolean;
  responseTimeMs: number;
}

export function SpellCheck({ onBack, onSessionComplete }: ModuleProps) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [settings, setSettings] = useState<Settings>({
    wordCount: 20
  });

  const [trials, setTrials] = useState<Trial[]>([]);
  const [completedTrials, setCompletedTrials] = useState<CompletedTrial[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [trialStartTime, setTrialStartTime] = useState(0);
  const [lastResult, setLastResult] = useState<{ wasRight: boolean; correctSpelling: string } | null>(null);

  const timer = useTimer();

  const startSession = useCallback(() => {
    const newTrials = generateTrials(settings.wordCount);
    setTrials(newTrials);
    setCompletedTrials([]);
    setCurrentTrialIndex(0);
    setTrialStartTime(Date.now());
    timer.start();
    setPhase('active');
  }, [settings.wordCount, timer]);

  const handleAnswer = useCallback((userSaidCorrect: boolean) => {
    if (phase !== 'active') return;

    const trial = trials[currentTrialIndex];
    const responseTime = Date.now() - trialStartTime;
    const wasRight = userSaidCorrect === trial.isCorrect;

    const completed: CompletedTrial = {
      ...trial,
      userSaidCorrect,
      wasRight,
      responseTimeMs: responseTime
    };

    setCompletedTrials(prev => [...prev, completed]);
    setLastResult({ wasRight, correctSpelling: trial.sourceWord });
    setPhase('feedback');

    // Longer pause on mistakes so user can read the correct spelling
    const feedbackTime = wasRight ? 400 : 1200;

    setTimeout(() => {
      const nextIndex = currentTrialIndex + 1;
      if (nextIndex >= trials.length) {
        timer.stop();
        setPhase('results');
      } else {
        setCurrentTrialIndex(nextIndex);
        setTrialStartTime(Date.now());
        setPhase('active');
      }
    }, feedbackTime);
  }, [phase, trials, currentTrialIndex, trialStartTime, timer]);

  // Keyboard support
  useEffect(() => {
    if (phase !== 'active') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'c' || e.key === 'C') {
        handleAnswer(true); // Correct
      } else if (e.key === 'ArrowRight' || e.key === 'w' || e.key === 'W') {
        handleAnswer(false); // Wrong
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleAnswer]);

  const correctCount = completedTrials.filter(t => t.wasRight).length;
  const accuracy = completedTrials.length > 0
    ? Math.round((correctCount / completedTrials.length) * 100)
    : 0;
  const avgResponseTime = completedTrials.length > 0
    ? Math.round(completedTrials.reduce((sum, t) => sum + t.responseTimeMs, 0) / completedTrials.length)
    : 0;

  const finishSession = useCallback(() => {
    const result: SessionResult = {
      timestamp: Date.now(),
      moduleId: 'spell-check',
      operation: '+',
      gridSize: `${settings.wordCount} words`,
      totalCells: completedTrials.length,
      correctCount,
      accuracy,
      timeMs: timer.elapsedMs
    };
    onSessionComplete(result);
    onBack();
  }, [settings.wordCount, completedTrials.length, correctCount, accuracy, timer.elapsedMs, onSessionComplete, onBack]);

  const resetSession = useCallback(() => {
    setPhase('setup');
    setTrials([]);
    setCompletedTrials([]);
    setCurrentTrialIndex(0);
    timer.reset();
  }, [timer]);

  // Setup phase
  if (phase === 'setup') {
    return (
      <div className="spell-check">
        <header className="module-header">
          <button className="back-button" onClick={onBack}>← Back</button>
          <h2>Spell Check</h2>
        </header>

        <div className="setup-panel">
          <p className="instructions">
            Is the word spelled <strong>correctly</strong> or <strong>incorrectly</strong>?
          </p>

          <div className="setting-group">
            <label>Words</label>
            <div className="button-group">
              {[10, 20, 30].map(count => (
                <button
                  key={count}
                  className={settings.wordCount === count ? 'active' : ''}
                  onClick={() => setSettings(s => ({ ...s, wordCount: count }))}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="key-hint">
            Keyboard: <span className="key">C</span> correct <span className="key">W</span> wrong
          </div>

          <button className="start-button" onClick={startSession}>
            Start
          </button>
        </div>
      </div>
    );
  }

  // Active / Feedback phase
  if ((phase === 'active' || phase === 'feedback') && trials[currentTrialIndex]) {
    const currentTrial = trials[currentTrialIndex];

    return (
      <div className="spell-check">
        <header className="module-header">
          <span className="progress">{currentTrialIndex + 1} / {trials.length}</span>
          <span className="timer">{timer.formatTime(timer.elapsedMs)}</span>
        </header>

        <div className="play-area">
          <div className={`word-display ${phase === 'feedback' ? (lastResult?.wasRight ? 'correct' : 'incorrect') : ''}`}>
            <span className="word">{currentTrial.word}</span>
          </div>

          <div className="answer-buttons">
            <button
              className="answer-button correct-btn"
              onClick={() => handleAnswer(true)}
              disabled={phase === 'feedback'}
            >
              Correct
            </button>
            <button
              className="answer-button wrong-btn"
              onClick={() => handleAnswer(false)}
              disabled={phase === 'feedback'}
            >
              Wrong
            </button>
          </div>

          {phase === 'feedback' && lastResult && (
            <div className={`feedback-text ${lastResult.wasRight ? 'correct' : 'incorrect'}`}>
              {lastResult.wasRight ? 'Correct!' : `Correct spelling: ${lastResult.correctSpelling}`}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Results phase
  return (
    <div className="spell-check">
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
            <span className="stat-value">{correctCount}/{completedTrials.length}</span>
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
