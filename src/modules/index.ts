import { arithmeticGridModule } from './arithmetic-grid';
import { digitSpanModule } from './digit-span';
import { stroopModule } from './stroop';
import { numberSequencesModule } from './number-sequences';
import { spellCheckModule } from './spell-check';
import type { ModuleDefinition } from '../types/module';

export const modules: ModuleDefinition[] = [
  arithmeticGridModule,
  digitSpanModule,
  stroopModule,
  numberSequencesModule,
  spellCheckModule
];

export function getModule(id: string): ModuleDefinition | undefined {
  return modules.find(m => m.id === id);
}
