import { MentalMap } from './MentalMap';
import type { ModuleDefinition } from '../../types/module';

export const mentalMapModule: ModuleDefinition = {
  id: 'mental-map',
  name: 'Mental Map',
  description: 'Follow directions from memory',
  icon: '🗺️',
  component: MentalMap
};
