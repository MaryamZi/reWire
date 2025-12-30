import type { SessionResult } from './index';

export interface ModuleProps {
  onBack: () => void;
  onSessionComplete: (result: SessionResult) => void;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;
  component: React.ComponentType<ModuleProps>;
}
