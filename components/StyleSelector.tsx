
import React, { useState, useMemo } from 'react';

export interface StyleOption {
  id: string;
  name: string;
  category: string;
  description: string;
  visual: string; // CSS class for the swatch
}

const STYLES: StyleOption[] = [
  // 1. Poses
  { id: 'p_power', name: 'Power Stance', category: 'Poses', description: 'Dominant stance, broad shoulders, high-fashion confidence.', visual: 'bg-zinc-200' },
  { id: 'p_alpha', name: 'Street Alpha', category: 'Poses', description: 'Confident urban stride, looking directly at the lens.', visual: 'bg-zinc-400' },
  { id: 'p_soft', name: 'Soft Glance', category: 'Poses', description: 'Gentle turn, soft eyes, natural and approachable posture.', visual: 'bg-zinc-300' },
  { id: 'p_over', name: 'Over Shoulder Vibe', category: 'Poses', description: 'Back to camera, mysterious gaze over the shoulder.', visual: 'bg-zinc-500' },
  { id: 'p_casual', name: 'Casual Lean', category: 'Poses', description: 'Relaxed lean against a wall, effortless street style.', visual: 'bg-zinc-600' },
  { id: 'p_dream', name: 'Dreamer Pose', category: 'Poses', description: 'Looking slightly upward, thoughtful and ethereal expression.', visual: 'bg-zinc-100' },
  { id: 'p_royal', name: 'Royal Frame', category: 'Poses', description: 'Perfectly centered, regal posture, chin slightly raised.', visual: 'bg-gradient-to-t from-zinc-400 to-white' },
  { id: 'p_walk', name: 'Attitude Walk', category: 'Poses', description: 'Dynamic movement, high-fashion runway energy.', visual: 'bg-zinc-300' },
  { id: 'p_silent', name: 'Silent Thinker', category: 'Poses', description: 'Hand on chin, focused and intellectual vibe.', visual: 'bg-zinc-800' },
  { id: 'p_window', name: 'Window Light Pose', category: 'Poses', description: 'Subject angled toward natural window light source.', visual: 'bg-gradient-to-r from-zinc-900 via-zinc-400 to-white' },
  { id: 'p_hero', name: 'Hero Entry', category: 'Poses', description: 'Cinematic low angle, strong and heroic presence.', visual: 'bg-zinc-200' },
  { id: 'p_turn', name: 'Cinematic Turn', category: 'Poses', description: 'Mid-motion turn, hair and clothes showing movement.', visual: 'bg-zinc-400' },
  { id: 'p_fold', name: 'Confident Fold', category: 'Poses', description: 'Crossed arms, sharp focus, professional and stern.', visual: 'bg-zinc-600' },
  { id: 'p_moody', name: 'Moody Sit', category: 'Poses', description: 'Seated, hunched slightly forward, deep cinematic focus.', visual: 'bg-zinc-900' },
  { id: 'p_side', name: 'Side Shadow Look', category: 'Poses', description: 'Profile view highlighting jawline and silhouette.', visual: 'bg-gradient-to-l from-black to-zinc-500' },

  // 2. Cinematic / Color
  { id: 'c_golden', name: 'Golden Hour Glow', category: 'Cinematic', description: 'Warm low sun, long shadows, sun-kissed editorial glow.', visual: 'bg-gradient-to-tr from-orange-600 via-orange-400 to-yellow-200' },
  { id: 'c_midnight', name: 'Midnight Blue', category: 'Cinematic', description: 'Deep blue moonlit tones, cool shadows, noir vibe.', visual: 'bg-gradient-to-br from-blue-900 via-indigo-950 to-black' },
  { id: 'c_urban', name: 'Urban Noir', category: 'Cinematic', description: 'High contrast black and white with gritty street texture.', visual: 'bg-gradient-to-b from-zinc-400 via-zinc-800 to-black' },
  { id: 'c_vintage', name: 'Soft Vintage Fade', category: 'Cinematic', description: 'Muted colors, raised blacks, and a nostalgic 70s feel.', visual: 'bg-gradient-to-tr from-stone-600 via-stone-400 to-orange-100' },
  { id: 'c_grain', name: 'Retro Film Grain', category: 'Cinematic', description: '35mm grain, light leaks, and organic analog texture.', visual: 'bg-zinc-600 opacity-80' },
  { id: 'c_neon', name: 'Neon Night', category: 'Cinematic', description: 'Cyberpunk lighting, pink and teal reflections.', visual: 'bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-cyan-400' },
  { id: 'c_warm', name: 'Warm Memory', category: 'Cinematic', description: 'Soft sepia-inspired tones, warm and inviting.', visual: 'bg-amber-200' },
  { id: 'c_steel', name: 'Cold Steel Tone', category: 'Cinematic', description: 'Industrial desaturated look, sharp and metallic.', visual: 'bg-slate-400' },
  { id: 'c_sunset', name: 'Sunset Drama', category: 'Cinematic', description: 'Vivid orange and purple sky, high-fashion contrast.', visual: 'bg-gradient-to-t from-orange-500 via-purple-700 to-indigo-900' },
  { id: 'c_shadow', name: 'Shadow Contrast', category: 'Cinematic', description: 'Dramatic chiaroscuro lighting, heavy artistic shadows.', visual: 'bg-gradient-to-br from-zinc-300 via-zinc-900 to-black' },
  { id: 'c_matte', name: 'Matte Finish', category: 'Cinematic', description: 'Flat contrast, soft blacks, clean modern editorial.', visual: 'bg-zinc-400' },
  { id: 'c_pop', name: 'High Dynamic Pop', category: 'Cinematic', description: 'High dynamic range, vivid colors, razor sharp.', visual: 'bg-gradient-to-tr from-red-500 via-green-500 to-blue-500' },
  { id: 'c_pastel', name: 'Pastel Dream', category: 'Cinematic', description: 'Soft airy colors, light and whimsical aesthetic.', visual: 'bg-gradient-to-tr from-pink-200 via-purple-100 to-blue-100' },
  { id: 'c_cinema', name: 'Classic Cinema', category: 'Cinematic', description: 'Anamorphic lens look, teal and orange grade.', visual: 'bg-gradient-to-r from-teal-900 via-zinc-800 to-orange-800' },
  { id: 'c_dark', name: 'Dark Academia', category: 'Cinematic', description: 'Moody library tones, browns, greens, and wood.', visual: 'bg-gradient-to-br from-emerald-950 via-amber-950 to-black' },

  // 3. AI Beauty / Face
  { id: 'b_natural', name: 'Natural Glow', category: 'Beauty', description: 'Subtle skin refinement, natural luminosity.', visual: 'bg-rose-100' },
  { id: 'b_sharp', name: 'Sharp Focus Pro', category: 'Beauty', description: 'Extreme clarity on eyes, hair, and beard texture.', visual: 'bg-zinc-100' },
  { id: 'b_smooth', name: 'Skin Smooth Lite', category: 'Beauty', description: 'Professional airbrushing while keeping skin pores.', visual: 'bg-rose-50' },
  { id: 'b_clean', name: 'Clean Portrait', category: 'Beauty', description: 'Simple studio lighting, zero distraction, pure focus.', visual: 'bg-white' },
  { id: 'b_detail', name: 'Detail Boost', category: 'Beauty', description: 'Brings out hidden textures in skin and clothing.', visual: 'bg-zinc-300' },
  { id: 'b_blur', name: 'Soft Blur Edge', category: 'Beauty', description: 'Creamy bokeh and soft focus transitions.', visual: 'bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400' },
  { id: 'b_hd', name: 'HD Face Mode', category: 'Beauty', description: 'Ultra-high resolution face processing for 8k quality.', visual: 'bg-blue-50' },
  { id: 'b_studio', name: 'Studio Touch', category: 'Beauty', description: 'Three-point lighting setup for a professional headshot.', visual: 'bg-zinc-200' },
  { id: 'b_flawless', name: 'Flawless Frame', category: 'Beauty', description: 'Magazine cover grade retouching and symmetry.', visual: 'bg-zinc-50' },
  { id: 'b_real', name: 'Real Skin Texture', category: 'Beauty', description: 'Preserves micro-details, removes only blemishes.', visual: 'bg-orange-50' },

  // 4. Creative / Fantasy
  { id: 'cr_cyber', name: 'Cyberpunk Mode', category: 'Creative', description: 'Futuristic augmentations, glowing wires, tech city.', visual: 'bg-gradient-to-tr from-fuchsia-600 via-indigo-600 to-cyan-500' },
  { id: 'cr_anime', name: 'Anime Vision', category: 'Creative', description: 'Sharp lines, vibrant colors, classic shonen style.', visual: 'bg-gradient-to-b from-orange-400 via-yellow-300 to-sky-400' },
  { id: 'cr_ghibli', name: 'Ghibli Touch', category: 'Creative', description: 'Soft watercolor backgrounds, magical atmosphere.', visual: 'bg-gradient-to-tr from-emerald-400 via-green-200 to-blue-200' },
  { id: 'cr_oil', name: 'Oil Paint Art', category: 'Creative', description: 'Thick brushstrokes, classical museum masterpiece.', visual: 'bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-600' },
  { id: 'cr_water', name: 'Watercolor Mood', category: 'Creative', description: 'Fluid colors, soft paper texture, artistic bleed.', visual: 'bg-gradient-to-r from-blue-200 via-purple-100 to-pink-100' },
  { id: 'cr_sketch', name: 'Sketch Outline', category: 'Creative', description: 'Minimalist charcoal or pencil line drawing.', visual: 'bg-zinc-100 border-zinc-300' },
  { id: 'cr_comic', name: 'Comic Style', category: 'Creative', description: 'Halftone dots, bold inks, pop art aesthetic.', visual: 'bg-gradient-to-tr from-red-600 via-yellow-400 to-blue-600' },
  { id: 'cr_3d', name: '3D Pop Portrait', category: 'Creative', description: 'Pixar-style 3D rendered character aesthetic.', visual: 'bg-gradient-to-br from-sky-400 to-blue-600' },
  { id: 'cr_hologram', name: 'Hologram Effect', category: 'Creative', description: 'Flickering blue light, digital scan lines.', visual: 'bg-gradient-to-b from-cyan-400 via-blue-500 to-black' },
  { id: 'cr_aura', name: 'Dream Aura', category: 'Creative', description: 'Glowing silhouette, ethereal light particles.', visual: 'bg-gradient-to-tr from-purple-200 via-pink-100 to-white' },

  // 5. Vintage Film Looks
  { id: 'v_kodak', name: 'Kodachrome 64', category: 'Vintage', description: 'Deep saturated reds, rich contrast, and classic 20th-century color chemistry.', visual: 'bg-gradient-to-tr from-red-700 via-orange-600 to-yellow-400' },
  { id: 'v_ekta', name: 'Ektachrome 100', category: 'Vintage', description: 'Neutral skin tones with cool, crisp blue-green highlights. Professional slide film.', visual: 'bg-gradient-to-br from-blue-600 via-zinc-300 to-white' },
  { id: 'v_portra', name: 'Portra 400', category: 'Vintage', description: 'The gold standard for fashion. Soft, natural skin tones with a beautiful pastel color palette.', visual: 'bg-gradient-to-tr from-orange-200 via-rose-100 to-teal-50' },
  { id: 'v_polar', name: 'Polaroid 600', category: 'Vintage', description: 'Soft highlights, warm shadows, iconic instant-film haze, and high-key nostalgia.', visual: 'bg-gradient-to-tr from-stone-400 via-amber-100 to-zinc-50' },
  { id: 'v_agfa', name: 'Agfa Vista 200', category: 'Vintage', description: 'Vivid reds and punchy, warm everyday colors with a distinct nostalgic consumer-film feel.', visual: 'bg-gradient-to-br from-red-500 via-yellow-200 to-white' },
  { id: 'v_cine', name: 'Cinestill 800T', category: 'Vintage', description: 'Cinematic night-time look with tungsten balance and the iconic red halation glow around light sources.', visual: 'bg-gradient-to-br from-indigo-900 via-blue-700 to-red-600' },
  { id: 'v_fuji', name: 'Fuji Velvia', category: 'Vintage', description: 'Vibrant landscape colors, intense greens/magentas, and heavy shadow saturation.', visual: 'bg-gradient-to-tr from-emerald-600 via-rose-500 to-amber-200' },
  { id: 'v_tri', name: 'Tri-X 400', category: 'Vintage', description: 'Timeless black and white with beautiful silver-halide grain and punchy contrast.', visual: 'bg-gradient-to-b from-zinc-200 via-zinc-800 to-black' },
  { id: 'v_ilford', name: 'Ilford HP5', category: 'Vintage', description: 'Classic fine-grain black and white with smooth grey tones and moderate editorial contrast.', visual: 'bg-gradient-to-t from-zinc-900 to-zinc-100' },
  { id: 'v_lomo', name: 'Lomochrome Purple', category: 'Vintage', description: 'Surreal and experimental. Shifts greens to deep purples while keeping skin tones recognizable.', visual: 'bg-gradient-to-tr from-purple-800 via-fuchsia-600 to-indigo-900' },

  // 6. Backgrounds
  { id: 'bg_mount', name: 'Mountain Escape', category: 'Background', description: 'Snowy peaks, vast horizon, majestic wilderness.', visual: 'bg-gradient-to-t from-slate-400 to-white' },
  { id: 'bg_city', name: 'City Skyline', category: 'Background', description: 'Metropolis at night, glittering skyscrapers.', visual: 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black' },
  { id: 'bg_rain', name: 'Rainy Street', category: 'Background', description: 'Reflections on asphalt, moody urban rain.', visual: 'bg-gradient-to-b from-blue-900 via-slate-800 to-zinc-900' },
  { id: 'bg_palace', name: 'Royal Palace', category: 'Background', description: 'Golden halls, opulent luxury architecture.', visual: 'bg-gradient-to-br from-amber-400 via-yellow-600 to-amber-200' },
  { id: 'bg_beach', name: 'Sunset Beach', category: 'Background', description: 'Tropical waves, golden sand, palm silhouettes.', visual: 'bg-gradient-to-t from-orange-300 via-blue-400 to-sky-300' },
  { id: 'bg_luxury', name: 'Luxury Studio', category: 'Background', description: 'Minimalist modern interior with soft lighting.', visual: 'bg-gradient-to-br from-zinc-100 to-zinc-300' },
  { id: 'bg_space', name: 'Space Galaxy', category: 'Background', description: 'Nebulas, distant stars, cosmic atmosphere.', visual: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black' },
  { id: 'bg_snow', name: 'Snow Forest', category: 'Background', description: 'Deep winter woods, falling snowflakes.', visual: 'bg-gradient-to-b from-white via-zinc-100 to-zinc-300' },
  { id: 'bg_desert', name: 'Desert Glow', category: 'Background', description: 'Endless dunes, scorching heat, golden sand.', visual: 'bg-gradient-to-t from-orange-400 to-yellow-200' },
  { id: 'bg_alley', name: 'Dark Alley', category: 'Background', description: 'Moody backstreet, single lamppost, mystery.', visual: 'bg-gradient-to-tr from-black via-zinc-900 to-zinc-800' },
];

const CATEGORIES = ['Poses', 'Cinematic', 'Beauty', 'Creative', 'Vintage', 'Background'];

interface Props {
  selectedId: string;
  onSelect: (style: StyleOption) => void;
  disabled?: boolean;
}

const StyleSelector: React.FC<Props> = ({ selectedId, onSelect, disabled }) => {
  const [activeCategory, setActiveCategory] = useState('Poses');

  const filteredStyles = useMemo(() => {
    return STYLES.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="w-full space-y-4">
      {/* Category Filter */}
      <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1 px-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all border
              ${activeCategory === cat 
                ? 'bg-white text-black border-white shadow-lg' 
                : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex overflow-x-auto pb-4 gap-3 custom-scrollbar scroll-smooth">
        {filteredStyles.map((style) => (
          <button
            key={style.id}
            disabled={disabled}
            onClick={() => onSelect(style)}
            className={`flex-shrink-0 w-28 aspect-square rounded-xl p-3 flex flex-col justify-between transition-all duration-300 border
              ${selectedId === style.id 
                ? 'bg-white border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'}`}
          >
            <div className={`w-10 h-10 rounded-lg ${style.visual} shadow-inner border border-zinc-800/50 group-hover:scale-110 transition-transform`}></div>
            <span className={`text-[9px] font-bold uppercase tracking-wider text-left leading-tight mt-2 ${selectedId === style.id ? 'text-black' : 'text-zinc-400'}`}>
              {style.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
