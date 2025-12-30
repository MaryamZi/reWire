export type Operation = '+' | '−' | '×' | '÷';

export interface GridConfig {
  rows: number;
  cols: number;
  operation: Operation;
  timerEnabled: boolean;
}

export interface GridData {
  rowHeaders: number[];
  colHeaders: number[];
  userAnswers: (number | null)[][];
}

export interface SessionResult {
  timestamp: number;
  moduleId: string;
  operation: Operation;
  gridSize: string;
  totalCells: number;
  correctCount: number;
  accuracy: number;
  timeMs: number | null;
}

export interface Stats {
  sessions: SessionResult[];
}

export type AppPhase = 'setup' | 'active' | 'results';
