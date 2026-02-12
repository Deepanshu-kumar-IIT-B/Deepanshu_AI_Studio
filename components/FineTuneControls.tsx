
import React from 'react';

interface FineTuneParams {
  lighting: number;
  temperature: number;
  contrast: number;
}

interface Props {
  params: FineTuneParams;
  onChange: (params: FineTuneParams) => void;
  disabled?: boolean;
}

const FineTuneControls: React.FC<Props> = ({ params, onChange, disabled }) => {
  const handleLightingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...params, lighting: parseInt(e.target.value) });
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...params, temperature: parseInt(e.target.value) });
  };

  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...params, contrast: parseInt(e.target.value) });
  };

  const handleAutoContrast = () => {
    onChange({ ...params, contrast: 80 }); // 80% is typically the "sweet spot" for punchy editorial contrast
  };

  return (
    <div className={`space-y-6 p-5 bg-zinc-950/50 border border-zinc-900 rounded-2xl transition-opacity duration-300 ${disabled ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex justify-between items-center px-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Neural Parameters</p>
        <div className="flex gap-4">
          <button 
            onClick={handleAutoContrast}
            className="text-[8px] uppercase tracking-widest text-white hover:text-zinc-300 transition-colors font-black"
          >
            Auto Contrast
          </button>
          <button 
            onClick={() => onChange({ lighting: 50, temperature: 50, contrast: 50 })}
            className="text-[8px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Lighting Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] uppercase tracking-widest text-zinc-500 font-bold">
            <span>Lighting Intensity</span>
            <span className="text-zinc-300">{params.lighting}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={params.lighting}
            onChange={handleLightingChange}
            className="w-full h-[1px] bg-zinc-800 appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Contrast Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] uppercase tracking-widest text-zinc-500 font-bold">
            <span>Contrast Level</span>
            <span className="text-zinc-300">{params.contrast}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={params.contrast}
            onChange={handleContrastChange}
            className="w-full h-[1px] bg-zinc-800 appearance-none cursor-pointer accent-white"
          />
        </div>

        {/* Temperature Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[8px] uppercase tracking-widest text-zinc-500 font-bold">
            <span>Color Temperature</span>
            <span className="text-zinc-300">{params.temperature < 50 ? 'Cool' : params.temperature > 50 ? 'Warm' : 'Neutral'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={params.temperature}
            onChange={handleTemperatureChange}
            className="w-full h-[1px] bg-zinc-800 appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </div>
  );
};

export default FineTuneControls;
