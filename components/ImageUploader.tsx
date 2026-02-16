
import React, { useRef, useState, useEffect } from 'react';

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
  currentImage: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', aspectRatio: 3/4 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onImageUpload(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (isCameraActive) {
    return (
      <div className="relative w-full rounded-2xl border border-zinc-800 overflow-hidden bg-black aspect-[3/4]">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover grayscale-[20%]"
        />
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-6 px-6">
          <button 
            onClick={stopCamera}
            className="p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white hover:text-black transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button 
            onClick={capturePhoto}
            className="w-16 h-16 bg-white rounded-full border-[4px] border-zinc-900 shadow-xl active:scale-90 transition-transform flex items-center justify-center group"
          >
            <div className="w-12 h-12 rounded-full border border-black/10 group-hover:scale-110 transition-transform"></div>
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        onClick={() => !disabled && !currentImage && fileInputRef.current?.click()}
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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm space-y-3">
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="text-white text-[10px] uppercase tracking-[0.3em] font-bold border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Upload New
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); startCamera(); }}
                className="text-white text-[10px] uppercase tracking-[0.3em] font-bold border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all"
              >
                Retake with Camera
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 px-10">
            <div className="space-y-4">
              <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform bg-zinc-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium leading-relaxed">
                Add your portrait to begin
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="w-full py-3 px-6 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] uppercase tracking-widest font-bold text-zinc-300 hover:bg-white hover:text-black transition-all"
              >
                Upload Image
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); startCamera(); }}
                className="w-full py-3 px-6 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] uppercase tracking-widest font-bold text-zinc-300 hover:bg-white hover:text-black transition-all"
              >
                Use Webcam
              </button>
            </div>
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
    </div>
  );
};

export default ImageUploader;
