
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
  currentImage: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div 
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`relative group cursor-pointer w-full rounded-2xl border border-zinc-800 transition-all duration-500 flex items-center justify-center overflow-hidden bg-zinc-950
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-zinc-500'}
        ${currentImage ? 'h-auto' : 'aspect-[3/4] min-h-[320px]'}`}
    >
      {currentImage ? (
        <div className="w-full h-full relative">
          <img 
            src={currentImage} 
            alt="Reference" 
            className="w-full h-auto block grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-[10px] uppercase tracking-[0.3em] font-bold">Replace Portrait</span>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4 px-10">
          <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform bg-zinc-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium leading-relaxed">
            Click to upload your portrait
          </p>
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default ImageUploader;
