import { useRef, useEffect, useCallback } from 'react';

interface CellProps {
  value: number | null;
  onChange: (value: number | null) => void;
  isCorrect?: boolean;
  correctAnswer?: number;
  showResult: boolean;
  disabled: boolean;
  autoFocus?: boolean;
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right' | 'next') => void;
  inputRef?: (el: HTMLInputElement | null) => void;
}

export function Cell({
  value,
  onChange,
  isCorrect,
  correctAnswer,
  showResult,
  disabled,
  autoFocus,
  onNavigate,
  inputRef: externalRef
}: CellProps) {
  const internalRef = useRef<HTMLInputElement>(null);

  const setRef = useCallback((el: HTMLInputElement | null) => {
    (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
    externalRef?.(el);
  }, [externalRef]);

  useEffect(() => {
    if (autoFocus && internalRef.current) {
      internalRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(null);
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0 && num <= 99) {
      onChange(num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onNavigate) return;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onNavigate('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        onNavigate('down');
        break;
      case 'ArrowLeft':
        if (internalRef.current?.selectionStart === 0) {
          e.preventDefault();
          onNavigate('left');
        }
        break;
      case 'ArrowRight':
        if (internalRef.current?.selectionStart === internalRef.current?.value.length) {
          e.preventDefault();
          onNavigate('right');
        }
        break;
      case 'Enter':
        e.preventDefault();
        onNavigate('next');
        break;
    }
  };

  let className = 'cell';
  if (showResult) {
    className += isCorrect ? ' correct' : ' incorrect';
  }

  return (
    <div className={className}>
      <input
        ref={setRef}
        type="text"
        inputMode="numeric"
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Sum"
      />
      {showResult && !isCorrect && (
        <span className="correct-answer">{correctAnswer}</span>
      )}
    </div>
  );
}
