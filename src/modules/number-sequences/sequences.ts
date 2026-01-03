export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export interface Sequence {
  numbers: number[];
  answer: number;
  type: string;
}

// Helper to get random int in range [min, max]
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// EASY: Arithmetic sequences (constant difference)
function generateArithmetic(): Sequence {
  const start = randInt(1, 50);
  const diff = randInt(2, 12) * (Math.random() < 0.3 ? -1 : 1);
  const length = randInt(4, 6);

  const numbers: number[] = [];
  for (let i = 0; i < length; i++) {
    numbers.push(start + diff * i);
  }

  return {
    numbers,
    answer: start + diff * length,
    type: 'arithmetic'
  };
}

// EASY: Geometric sequences (constant multiplier)
function generateGeometric(): Sequence {
  const start = randInt(1, 7);
  const ratio = randInt(2, 4);
  const length = randInt(4, 5);

  const numbers: number[] = [];
  let current = start;
  for (let i = 0; i < length; i++) {
    numbers.push(current);
    current *= ratio;
  }

  return {
    numbers,
    answer: current,
    type: 'geometric'
  };
}

// MEDIUM: Square numbers
function generateSquares(): Sequence {
  const startN = randInt(1, 8);
  const length = randInt(4, 5);

  const numbers: number[] = [];
  for (let i = 0; i < length; i++) {
    numbers.push((startN + i) ** 2);
  }

  return {
    numbers,
    answer: (startN + length) ** 2,
    type: 'squares'
  };
}

// MEDIUM: Fibonacci-like (each number is sum of previous two)
function generateFibonacci(): Sequence {
  const a = randInt(1, 8);
  const b = randInt(1, 8);
  const length = randInt(5, 6);

  const numbers: number[] = [a, b];
  for (let i = 2; i < length; i++) {
    numbers.push(numbers[i - 1] + numbers[i - 2]);
  }

  return {
    numbers,
    answer: numbers[length - 1] + numbers[length - 2],
    type: 'fibonacci'
  };
}

// MEDIUM: Triangular numbers (1, 3, 6, 10, 15...)
function generateTriangular(): Sequence {
  const startN = randInt(1, 6);
  const length = randInt(4, 5);

  const numbers: number[] = [];
  for (let i = 0; i < length; i++) {
    const n = startN + i;
    numbers.push((n * (n + 1)) / 2);
  }

  const nextN = startN + length;
  return {
    numbers,
    answer: (nextN * (nextN + 1)) / 2,
    type: 'triangular'
  };
}

// MEDIUM: Cubes
function generateCubes(): Sequence {
  const startN = randInt(1, 5);
  const length = randInt(4, 5);

  const numbers: number[] = [];
  for (let i = 0; i < length; i++) {
    numbers.push((startN + i) ** 3);
  }

  return {
    numbers,
    answer: (startN + length) ** 3,
    type: 'cubes'
  };
}

// HARD: Prime numbers
function generatePrimes(): Sequence {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
  const startIdx = randInt(0, 10);
  const length = randInt(4, 5);

  const numbers = primes.slice(startIdx, startIdx + length);

  return {
    numbers,
    answer: primes[startIdx + length],
    type: 'primes'
  };
}

// HARD: Alternating two-step pattern (e.g., +2, *2, +2, *2)
function generateAlternating(): Sequence {
  const start = randInt(1, 10);
  const addend = randInt(1, 5);
  const multiplier = randInt(2, 3);
  const length = 5;

  const numbers: number[] = [start];
  for (let i = 1; i < length; i++) {
    const prev = numbers[i - 1];
    if (i % 2 === 1) {
      numbers.push(prev + addend);
    } else {
      numbers.push(prev * multiplier);
    }
  }

  const lastIdx = length - 1;
  const answer = length % 2 === 1
    ? numbers[lastIdx] + addend
    : numbers[lastIdx] * multiplier;

  return {
    numbers,
    answer,
    type: 'alternating'
  };
}

// HARD: Double arithmetic (difference increases by constant)
function generateDoubleArithmetic(): Sequence {
  const start = randInt(1, 20);
  const initialDiff = randInt(1, 4);
  const diffIncrement = randInt(1, 3);
  const length = randInt(5, 6);

  const numbers: number[] = [start];
  let diff = initialDiff;
  for (let i = 1; i < length; i++) {
    numbers.push(numbers[i - 1] + diff);
    diff += diffIncrement;
  }

  return {
    numbers,
    answer: numbers[length - 1] + diff,
    type: 'double-arithmetic'
  };
}

const easyGenerators = [generateArithmetic, generateGeometric];
const mediumGenerators = [generateSquares, generateFibonacci, generateTriangular, generateCubes];
const hardGenerators = [generatePrimes, generateAlternating, generateDoubleArithmetic];

// Create a picker that avoids immediate repeats, with encapsulated state
function createPicker<T>(arr: readonly T[]): () => T {
  let lastIndex = -1;

  return () => {
    if (arr.length <= 1) {
      return arr[0];
    }

    let idx: number;
    do {
      idx = Math.floor(Math.random() * arr.length);
    } while (idx === lastIndex);

    lastIndex = idx;
    return arr[idx];
  };
}

// Each difficulty has its own picker with isolated state
const pickEasy = createPicker(easyGenerators);
const pickMedium = createPicker(mediumGenerators);
const pickHard = createPicker(hardGenerators);
const pickMixed = createPicker([...easyGenerators, ...mediumGenerators, ...hardGenerators]);

export function generateSequence(difficulty: Difficulty): Sequence {
  switch (difficulty) {
    case 'easy':
      return pickEasy()();
    case 'medium':
      return pickMedium()();
    case 'hard':
      return pickHard()();
    case 'mixed':
      return pickMixed()();
  }
}
