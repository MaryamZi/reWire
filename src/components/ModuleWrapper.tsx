import { getModule } from '../modules';
import type { SessionResult } from '../types';

interface ModuleWrapperProps {
  moduleId: string;
  onBack: () => void;
  onSessionComplete: (result: SessionResult) => void;
}

export function ModuleWrapper({ moduleId, onBack, onSessionComplete }: ModuleWrapperProps) {
  const module = getModule(moduleId);

  if (!module) {
    return (
      <div className="app-main">
        <p>Module not found.</p>
        <button className="back-button" onClick={onBack}>← Back to Home</button>
      </div>
    );
  }

  const ModuleComponent = module.component;

  return <ModuleComponent onBack={onBack} onSessionComplete={onSessionComplete} />;
}
