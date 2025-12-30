import { useState, useRef, useCallback } from 'react';

export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now() - elapsedMs;
    setIsRunning(true);
    intervalRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - (startTimeRef.current ?? Date.now()));
    }, 100);
  }, [isRunning, elapsedMs]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsedMs(0);
    startTimeRef.current = null;
  }, [stop]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
  }, []);

  return {
    elapsedMs,
    isRunning,
    start,
    stop,
    reset,
    formatTime
  };
}
