import { arithmeticGridModule } from './arithmetic-grid';
import type { ModuleDefinition } from '../types/module';

export const modules: ModuleDefinition[] = [
  arithmeticGridModule
];

export function getModule(id: string): ModuleDefinition | undefined {
  return modules.find(m => m.id === id);
}
