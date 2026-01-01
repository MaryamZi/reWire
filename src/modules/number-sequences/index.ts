import { NumberSequences } from './NumberSequences';
import type { ModuleDefinition } from '../../types/module';

export const numberSequencesModule: ModuleDefinition = {
  id: 'number-sequences',
  name: 'Number Sequences',
  description: 'Find the pattern, predict the next number',
  icon: '📐',
  component: NumberSequences
};
