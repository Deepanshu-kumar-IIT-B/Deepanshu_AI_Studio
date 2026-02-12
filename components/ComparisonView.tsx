
import React, { useState } from 'react';

interface Props {
  before: string;
  after: string;
}

const ComparisonView: React.FC<Props> = ({ before, after }) => {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative w-full h-auto overflow-hidden rounded-2xl group border border-zinc-800 bg-black shadow-2xl">
      {/* After Image (Background) - This sets the height of the container */}
      <img src={after} className="w-full h-auto block" alt="Enhanced" />
      
      {/* Before Image (Foreground Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none" 
        style={{ width: `${sliderPos}%` }}
      >
        <img 
          src={before} 
          className="absolute inset-0 w-full h-full object-cover origin-left" 
          style={{ maxWidth: 'none' }}
          alt="Original" 
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute inset-y-0 w-[2px] bg-white/50 cursor-ew-resize z-10"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-zinc-200 pointer-events-none">
          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-5 5m0 0l5 5m-5-5h18m-5-5l5 5m0 0l-5 5" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] uppercase tracking-widest text-white/90 font-bold border border-white/10 pointer-events-none">Original</div>
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] uppercase tracking-widest text-black font-bold pointer-events-none">Editorial</div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-ew-resize z-20"
      />
    </div>
  );
};

export default ComparisonView;
