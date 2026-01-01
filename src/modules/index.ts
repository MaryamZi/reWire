import { arithmeticGridModule } from './arithmetic-grid';
import { digitSpanModule } from './digit-span';
import { stroopModule } from './stroop';
import type { ModuleDefinition } from '../types/module';

export const modules: ModuleDefinition[] = [
  arithmeticGridModule,
  digitSpanModule,
  stroopModule
];

export function getModule(id: string): ModuleDefinition | undefined {
  return modules.find(m => m.id === id);
}
