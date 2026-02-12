
import React from 'react';

interface GenerationDisplayProps {
  image: string | null;
  isLoading: boolean;
  status: string;
}

const GenerationDisplay: React.FC<GenerationDisplayProps> = ({ image, isLoading, status }) => {
  return (
    <div className="relative aspect-[3/4] bg-zinc-950 border border-zinc-900 shadow-2xl overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-zinc-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-b-2 border-white rounded-full animate-spin-slow"></div>
          </div>
          <div className="text-center">
            <p className="text-white text-xs uppercase tracking-[0.3em] font-medium animate-pulse">
              Generating Editorial
            </p>
            <p className="text-zinc-500 text-[10px] mt-2 italic font-light">
              {status}
            </p>
          </div>
        </div>
      ) : image ? (
        <div className="relative w-full h-full animate-reveal">
          <img 
            src={image} 
            alt="Generated Editorial" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-6 left-6 right-6">
             <div className="bg-black/40 backdrop-blur-md p-4 border border-white/10">
                <p className="text-white text-[10px] uppercase tracking-widest font-bold">Issue #001</p>
                <p className="text-zinc-300 text-[8px] uppercase tracking-widest font-light mt-1">Cinematic Series • Autumn 2024</p>
             </div>
          </div>
          
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = image;
              link.download = 'vogue-editorial.png';
              link.click();
            }}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-12 text-center">
           <div className="space-y-2 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-zinc-600 text-xs uppercase tracking-widest font-light">
                Output Canvas Waiting...
              </p>
           </div>
        </div>
      )}

      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: scale(1.02); filter: blur(10px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        .animate-reveal {
          animation: reveal 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GenerationDisplay;
