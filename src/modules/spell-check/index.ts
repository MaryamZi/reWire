import { SpellCheck } from './SpellCheck';
import type { ModuleDefinition } from '../../types/module';

export const spellCheckModule: ModuleDefinition = {
  id: 'spell-check',
  name: 'Spell Check',
  description: 'Spot the misspelled words',
  icon: '✏️',
  component: SpellCheck
};
