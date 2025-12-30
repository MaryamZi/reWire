export function generateHeaders(count: number): number[] {
  const headers: number[] = [];
  for (let i = 0; i < count; i++) {
    headers.push(Math.floor(Math.random() * 9) + 1);
  }
  return headers;
}

export function createEmptyAnswers(rows: number, cols: number): (number | null)[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );
}

export function validateAnswers(
  rowHeaders: number[],
  colHeaders: number[],
  userAnswers: (number | null)[][]
): boolean[][] {
  return userAnswers.map((row, rowIndex) =>
    row.map((answer, colIndex) =>
      answer === rowHeaders[rowIndex] + colHeaders[colIndex]
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
  colIndex: number
): number {
  return rowHeaders[rowIndex] + colHeaders[colIndex];
}
