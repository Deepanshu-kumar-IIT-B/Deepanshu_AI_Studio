
import React, { useState, useEffect } from 'react';
import { StyleOption } from './StyleSelector';
import { FineTuneParams } from '../services/api_service';

export interface Preset {
  id: string;
  name: string;
  style: StyleOption;
  fineTune: FineTuneParams;
}

interface Props {
  currentStyle: StyleOption | null;
  currentFineTune: FineTuneParams;
  onApply: (style: StyleOption, fineTune: FineTuneParams) => void;
  disabled?: boolean;
}

const PresetManager: React.FC<Props> = ({ currentStyle, currentFineTune, onApply, disabled }) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedPresets = localStorage.getItem('studio_presets');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Failed to parse presets', e);
      }
    }
  }, []);

  const savePresets = (newPresets: Preset[]) => {
    setPresets(newPresets);
    localStorage.setItem('studio_presets', JSON.stringify(newPresets));
  };

  const handleSave = () => {
    if (!currentStyle || !newPresetName.trim()) return;

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: newPresetName.trim(),
      style: currentStyle,
      fineTune: { ...currentFineTune },
    };

    savePresets([...presets, newPreset]);
    setNewPresetName('');
    setIsSaving(false);
  };

  const handleDelete = (id: string) => {
    savePresets(presets.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Custom Presets</p>
        {!isSaving && currentStyle && !disabled && (
          <button 
            onClick={() => setIsSaving(true)}
            className="text-[8px] uppercase tracking-widest text-white hover:text-zinc-300 transition-colors font-black"
          >
            + Save Current
          </button>
        )}
      </div>

      {isSaving && (
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <input 
            type="text"
            placeholder="Preset Name (e.g. My Cinematic Look)"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white transition-colors"
            autoFocus
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSaving(false)}
              className="flex-1 py-2 text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={!newPresetName.trim()}
              className="flex-1 py-2 bg-white text-black rounded-lg text-[9px] uppercase tracking-widest font-bold disabled:opacity-50"
            >
              Confirm Save
            </button>
          </div>
        </div>
      )}

      {presets.length > 0 ? (
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar custom-scrollbar">
          {presets.map((preset) => (
            <div 
              key={preset.id}
              className="flex-shrink-0 group relative"
            >
              <button
                disabled={disabled}
                onClick={() => onApply(preset.style, preset.fineTune)}
                className="w-32 p-3 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-zinc-700 transition-all text-left space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${preset.style.visual}`}></div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-300 truncate">
                    {preset.name}
                  </span>
                </div>
                <div className="text-[8px] text-zinc-600 truncate">
                  {preset.style.name} • L:{preset.fineTune.lighting} C:{preset.fineTune.contrast}
                </div>
              </button>
              <button 
                onClick={() => handleDelete(preset.id)}
                className="absolute -top-1 -right-1 bg-red-900 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Delete Preset"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : !isSaving && (
        <div className="py-6 border border-dashed border-zinc-900 rounded-2xl text-center">
          <p className="text-[9px] uppercase tracking-widest text-zinc-700">No custom presets saved yet</p>
        </div>
      )}
    </div>
  );
};

export default PresetManager;
