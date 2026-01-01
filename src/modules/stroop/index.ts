import { Stroop } from './Stroop';
import type { ModuleDefinition } from '../../types/module';

export const stroopModule: ModuleDefinition = {
  id: 'stroop',
  name: 'Stroop Test',
  description: 'Name the ink color, not the word',
  icon: '🎨',
  component: Stroop
};
