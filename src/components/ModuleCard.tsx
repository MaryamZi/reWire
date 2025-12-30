import type { ModuleDefinition } from '../types/module';

interface ModuleCardProps {
  module: ModuleDefinition;
  onClick: () => void;
}

export function ModuleCard({ module, onClick }: ModuleCardProps) {
  return (
    <button className="module-card" onClick={onClick}>
      {module.icon && <span className="module-icon">{module.icon}</span>}
      <h3 className="module-name">{module.name}</h3>
      <p className="module-description">{module.description}</p>
    </button>
  );
}
