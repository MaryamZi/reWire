import type { GridConfig } from '../types';

interface ControlsProps {
  config: GridConfig;
  onConfigChange: (config: GridConfig) => void;
  onStart: () => void;
}

const GRID_SIZES = [
  { label: '3×3', rows: 3, cols: 3 },
  { label: '4×4', rows: 4, cols: 4 },
  { label: '5×5', rows: 5, cols: 5 },
  { label: '6×6', rows: 6, cols: 6 },
];

export function Controls({ config, onConfigChange, onStart }: ControlsProps) {
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = GRID_SIZES.find(s => s.label === e.target.value);
    if (size) {
      onConfigChange({ ...config, rows: size.rows, cols: size.cols });
    }
  };

  const handleTimerToggle = () => {
    onConfigChange({ ...config, timerEnabled: !config.timerEnabled });
  };

  const currentSize = GRID_SIZES.find(s => s.rows === config.rows && s.cols === config.cols);

  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="grid-size">Grid size</label>
        <select
          id="grid-size"
          value={currentSize?.label ?? '4×4'}
          onChange={handleSizeChange}
        >
          {GRID_SIZES.map(size => (
            <option key={size.label} value={size.label}>
              {size.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="timer-toggle">Timer</label>
        <button
          id="timer-toggle"
          className={`toggle ${config.timerEnabled ? 'on' : 'off'}`}
          onClick={handleTimerToggle}
          aria-pressed={config.timerEnabled}
        >
          {config.timerEnabled ? 'On' : 'Off'}
        </button>
      </div>

      <button className="start-button" onClick={onStart}>
        Start
      </button>
    </div>
  );
}
