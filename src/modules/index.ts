import { arithmeticGridModule } from './arithmetic-grid';
import { digitSpanModule } from './digit-span';
import type { ModuleDefinition } from '../types/module';

export const modules: ModuleDefinition[] = [
  arithmeticGridModule,
  digitSpanModule
];

export function getModule(id: string): ModuleDefinition | undefined {
  return modules.find(m => m.id === id);
}
