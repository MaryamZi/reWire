import { ModuleCard } from '../components/ModuleCard';
import { Stats } from '../components/Stats';
import logo from '../assets/logo.svg';
import type { ModuleDefinition } from '../types/module';
import type { Stats as StatsType } from '../types';

interface HomeProps {
  modules: ModuleDefinition[];
  stats: StatsType;
  onModuleSelect: (moduleId: string) => void;
  onClearStats: () => void;
  formatTime: (ms: number) => string;
}

export function Home({ modules, stats, onModuleSelect, onClearStats, formatTime }: HomeProps) {
  const handleRandom = () => {
    const randomModule = modules[Math.floor(Math.random() * modules.length)];
    onModuleSelect(randomModule.id);
  };

  return (
    <>
      <header className="app-header">
        <img src={logo} alt="reWire" className="app-logo" />
        <p className="tagline">Train your brain, one session at a time</p>
        <button className="random-button" onClick={handleRandom}>
          Random
        </button>
      </header>

      <main className="app-main">
        <div className="module-grid">
          {modules.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => onModuleSelect(module.id)}
            />
          ))}
        </div>

        <Stats
          sessions={stats.sessions}
          formatTime={formatTime}
          onClear={onClearStats}
        />
      </main>
    </>
  );
}
