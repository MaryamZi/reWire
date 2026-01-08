// Cardinal directions (absolute, for grid movement)
export type Facing = 'north' | 'south' | 'east' | 'west';

// Relative directions (what the user sees/does)
export type RelativeDirection = 'forward' | 'left' | 'right' | 'back';

export type Cell = [number, number]; // [row, col]

export interface DirectionSet {
  directions: RelativeDirection[];
  start: Cell;
  startFacing: Facing;
  end: Cell;
}

// Grid deltas for cardinal directions [row, col]
// North = up (decreasing row), South = down (increasing row)
const FACING_DELTAS: Record<Facing, Cell> = {
  north: [-1, 0],
  south: [1, 0],
  west: [0, -1],
  east: [0, 1],
};

// Turn results: given current facing and relative direction, what's the new facing?
const TURN_MAP: Record<Facing, Record<RelativeDirection, Facing>> = {
  north: { forward: 'north', left: 'west', right: 'east', back: 'south' },
  south: { forward: 'south', left: 'east', right: 'west', back: 'north' },
  east: { forward: 'east', left: 'north', right: 'south', back: 'west' },
  west: { forward: 'west', left: 'south', right: 'north', back: 'east' },
};

export const FACING_ARROWS: Record<Facing, string> = {
  north: '↑',
  south: '↓',
  east: '→',
  west: '←',
};

// For keyboard controls during navigation
export const DIRECTION_KEYS: Record<string, RelativeDirection> = {
  ArrowUp: 'forward',
  ArrowDown: 'back',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'forward',
  s: 'back',
  a: 'left',
  d: 'right',
};

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomFacing(): Facing {
  const facings: Facing[] = ['north', 'south', 'east', 'west'];
  return facings[Math.floor(Math.random() * facings.length)];
}

export function generateDirections(gridSize: number, stepCount: number): DirectionSet {
  const allRelative: RelativeDirection[] = ['forward', 'left', 'right'];
  const directions: RelativeDirection[] = [];

  // Start near center to allow room for movement
  const margin = Math.min(Math.ceil(stepCount / 2), Math.floor(gridSize / 2) - 1);
  const safeMargin = Math.max(1, margin);
  const range = Math.max(1, gridSize - 2 * safeMargin);
  const startRow = Math.floor(Math.random() * range) + safeMargin;
  const startCol = Math.floor(Math.random() * range) + safeMargin;
  const start: Cell = [startRow, startCol];
  const startFacing = randomFacing();

  let currentRow = startRow;
  let currentCol = startCol;
  let currentFacing = startFacing;

  for (let i = 0; i < stepCount; i++) {
    // Get valid relative directions (resulting position stays within grid)
    const validDirections = shuffle(allRelative.filter(rel => {
      const newFacing = TURN_MAP[currentFacing][rel];
      const [dr, dc] = FACING_DELTAS[newFacing];
      const newRow = currentRow + dr;
      const newCol = currentCol + dc;
      return newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize;
    }));

    if (validDirections.length === 0) break;

    const dir = validDirections[0];
    directions.push(dir);

    // Update facing and position
    currentFacing = TURN_MAP[currentFacing][dir];
    const [dr, dc] = FACING_DELTAS[currentFacing];
    currentRow += dr;
    currentCol += dc;
  }

  return {
    directions,
    start,
    startFacing,
    end: [currentRow, currentCol]
  };
}

// Apply a relative direction given current facing, returns new position and new facing
export function applyRelativeDirection(
  cell: Cell,
  facing: Facing,
  direction: RelativeDirection,
  gridSize: number
): { cell: Cell; facing: Facing } | null {
  const newFacing = TURN_MAP[facing][direction];
  const [dr, dc] = FACING_DELTAS[newFacing];
  const newRow = cell[0] + dr;
  const newCol = cell[1] + dc;

  if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
    return null; // Out of bounds
  }

  return { cell: [newRow, newCol], facing: newFacing };
}

export function cellsMatch(a: Cell, b: Cell): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

const DIRECTION_WORDS: Record<RelativeDirection, string> = {
  forward: 'forward',
  left: 'left',
  right: 'right',
  back: 'back',
};

export function directionsToText(directions: RelativeDirection[]): string {
  if (directions.length === 0) return '';

  const parts: string[] = [];
  let i = 0;

  while (i < directions.length) {
    const dir = directions[i];

    if (dir === 'forward') {
      // Group consecutive forwards
      let count = 1;
      while (i + count < directions.length && directions[i + count] === 'forward') {
        count++;
      }

      if (parts.length === 0) {
        parts.push(`Go forward ${count}`);
      } else {
        parts.push(`forward ${count}`);
      }
      i += count;
    } else {
      // Turns are not grouped - each is a separate turn+move
      parts.push(`turn ${DIRECTION_WORDS[dir]}`);
      i++;
    }
  }

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]}, then ${parts[1]}`;

  const last = parts.pop();
  return `${parts.join(', ')}, then ${last}`;
}
