import type { Operation } from '../types';

function pickUnique(count: number, min: number, max: number): number[] {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  // Shuffle
  for (let i = range.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [range[i], range[j]] = [range[j], range[i]];
  }
  return range.slice(0, count);
}

export function generateHeaders(
  rows: number,
  cols: number,
  operation: Operation
): { rowHeaders: number[]; colHeaders: number[] } {
  switch (operation) {
    case '+': {
      const rowHeaders = pickUnique(rows, 1, 9);
      const colHeaders = pickUnique(cols, 1, 9);
      return { rowHeaders, colHeaders };
    }
    case '−': {
      const rowHeaders = pickUnique(rows, 10, 18);
      const colHeaders = pickUnique(cols, 1, 9);
      return { rowHeaders, colHeaders };
    }
    case '×': {
      const rowHeaders = pickUnique(rows, 2, 9);
      const colHeaders = pickUnique(cols, 2, 9);
      return { rowHeaders, colHeaders };
    }
    case '÷': {
      const rowHeaders = pickUnique(rows, 20, 81);
      const colHeaders = pickUnique(cols, 2, 9);
      return { rowHeaders, colHeaders };
    }
  }
}

export function createEmptyAnswers(rows: number, cols: number): (number | null)[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );
}

export function computeAnswer(
  rowValue: number,
  colValue: number,
  operation: Operation
): number {
  switch (operation) {
    case '+': return rowValue + colValue;
    case '−': return rowValue - colValue;
    case '×': return rowValue * colValue;
    case '÷': return Math.floor(rowValue / colValue);
  }
}

export function validateAnswers(
  rowHeaders: number[],
  colHeaders: number[],
  userAnswers: (number | null)[][],
  operation: Operation
): boolean[][] {
  return userAnswers.map((row, rowIndex) =>
    row.map((answer, colIndex) =>
      answer === computeAnswer(rowHeaders[rowIndex], colHeaders[colIndex], operation)
    )
  );
}

export function countCorrect(validation: boolean[][]): number {
  return validation.flat().filter(Boolean).length;
}

export function getCorrectAnswer(
  rowHeaders: number[],
  colHeaders: number[],
  rowIndex: number,
  colIndex: number,
  operation: Operation
): number {
  return computeAnswer(rowHeaders[rowIndex], colHeaders[colIndex], operation);
}
