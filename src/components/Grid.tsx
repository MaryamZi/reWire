import { useRef, useCallback } from 'react';
import { Cell } from './Cell';
import { getCorrectAnswer } from '../utils/grid';

interface GridProps {
  rowHeaders: number[];
  colHeaders: number[];
  userAnswers: (number | null)[][];
  validation: boolean[][] | null;
  showResult: boolean;
  disabled: boolean;
  onAnswerChange: (row: number, col: number, value: number | null) => void;
  onSubmit?: () => void;
}

export function Grid({
  rowHeaders,
  colHeaders,
  userAnswers,
  validation,
  showResult,
  disabled,
  onAnswerChange,
  onSubmit
}: GridProps) {
  const cellRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const focusCell = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    const cell = document.querySelector(`[data-cell="${key}"] input`) as HTMLInputElement;
    cell?.focus();
  }, []);

  const handleNavigate = useCallback((row: number, col: number, direction: 'up' | 'down' | 'left' | 'right' | 'next') => {
    let newRow = row;
    let newCol = col;

    switch (direction) {
      case 'up':
        newRow = Math.max(0, row - 1);
        break;
      case 'down':
        newRow = Math.min(rowHeaders.length - 1, row + 1);
        break;
      case 'left':
        newCol = Math.max(0, col - 1);
        break;
      case 'right':
        newCol = Math.min(colHeaders.length - 1, col + 1);
        break;
      case 'next':
        if (col < colHeaders.length - 1) {
          newCol = col + 1;
        } else if (row < rowHeaders.length - 1) {
          newRow = row + 1;
          newCol = 0;
        } else if (onSubmit) {
          onSubmit();
          return;
        }
        break;
    }

    if (newRow !== row || newCol !== col) {
      focusCell(newRow, newCol);
    }
  }, [rowHeaders.length, colHeaders.length, focusCell, onSubmit]);

  return (
    <div className="grid-container">
      <table className="arithmetic-grid">
        <thead>
          <tr>
            <th className="corner">+</th>
            {colHeaders.map((num, i) => (
              <th key={i} className="col-header">{num}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowHeaders.map((rowNum, rowIndex) => (
            <tr key={rowIndex}>
              <th className="row-header">{rowNum}</th>
              {colHeaders.map((_, colIndex) => (
                <td key={colIndex} data-cell={`${rowIndex}-${colIndex}`}>
                  <Cell
                    value={userAnswers[rowIndex][colIndex]}
                    onChange={(value) => onAnswerChange(rowIndex, colIndex, value)}
                    isCorrect={validation?.[rowIndex][colIndex]}
                    correctAnswer={getCorrectAnswer(rowHeaders, colHeaders, rowIndex, colIndex)}
                    showResult={showResult}
                    disabled={disabled}
                    autoFocus={rowIndex === 0 && colIndex === 0}
                    onNavigate={(dir) => handleNavigate(rowIndex, colIndex, dir)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
