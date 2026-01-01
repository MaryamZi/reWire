export type Direction = 'up' | 'down' | 'left' | 'right';
export type Cell = [number, number]; // [row, col]

export interface DirectionSet {
  directions: Direction[];
  start: Cell;
  end: Cell;
}

const DIRECTION_DELTAS: Record<Direction, Cell> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

export const DIRECTION_ARROWS: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export const DIRECTION_KEYS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateDirections(gridSize: number, stepCount: number): DirectionSet {
  const allDirections: Direction[] = ['up', 'down', 'left', 'right'];
  const directions: Direction[] = [];

  // Start from a position that allows movement in all directions
  const margin = Math.ceil(stepCount / 2);
  const startRow = Math.floor(Math.random() * (gridSize - 2 * margin)) + margin;
  const startCol = Math.floor(Math.random() * (gridSize - 2 * margin)) + margin;
  const start: Cell = [startRow, startCol];

  let currentRow = startRow;
  let currentCol = startCol;

  for (let i = 0; i < stepCount; i++) {
    // Get valid directions (stay within grid)
    const validDirections = shuffle(allDirections.filter(dir => {
      const [dr, dc] = DIRECTION_DELTAS[dir];
      const newRow = currentRow + dr;
      const newCol = currentCol + dc;
      return newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize;
    }));

    if (validDirections.length === 0) break;

    const dir = validDirections[0];
    directions.push(dir);

    const [dr, dc] = DIRECTION_DELTAS[dir];
    currentRow += dr;
    currentCol += dc;
  }

  return {
    directions,
    start,
    end: [currentRow, currentCol]
  };
}

export function applyDirection(cell: Cell, direction: Direction, gridSize: number): Cell | null {
  const [dr, dc] = DIRECTION_DELTAS[direction];
  const newRow = cell[0] + dr;
  const newCol = cell[1] + dc;

  if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
    return null; // Out of bounds
  }

  return [newRow, newCol];
}

export function cellsMatch(a: Cell, b: Cell): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
