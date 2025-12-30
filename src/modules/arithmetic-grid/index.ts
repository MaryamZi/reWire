import { ArithmeticGrid } from './ArithmeticGrid';
import type { ModuleDefinition } from '../../types/module';

export const arithmeticGridModule: ModuleDefinition = {
  id: 'arithmetic-grid',
  name: 'Arithmetic Grid',
  description: 'Practice mental math with addition, subtraction, multiplication, and division.',
  icon: '🧮',
  component: ArithmeticGrid
};
