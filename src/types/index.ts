export interface GridConfig {
  rows: number;
  cols: number;
  timerEnabled: boolean;
}

export interface GridData {
  rowHeaders: number[];
  colHeaders: number[];
  userAnswers: (number | null)[][];
}

export interface SessionResult {
  timestamp: number;
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
