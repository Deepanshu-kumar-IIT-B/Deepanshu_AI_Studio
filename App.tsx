
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector, { StyleOption } from './components/StyleSelector';
import ComparisonView from './components/ComparisonView';
import FineTuneControls from './components/FineTuneControls';
import { generateFashionPortrait, editImageWithPrompt, generateNewImage, analyzeImage, AspectRatio, FineTuneParams } from './services/api_service';

type AppTab = 'enhance' | 'create';
type ImageResolution = '1K' | '2K' | '4K';

const REFINEMENTS = [
  { label: "Ultra Enhance", prompt: "Perform deep neural upscaling and restoration. Sharpen all facial features, recover skin texture, and remove noise while keeping the original style identical." },
  { label: "Editorial Pack", prompt: "Apply a cinematic fashion editor pack: enhance micro-details, add subtle anamorphic lens characteristics, and professional high-fashion color grading." },
  { label: "Studio Polish", prompt: "Senior magazine retouch: smooth skin realistically, brighten eyes, and add professional studio lighting highlights to the cheekbones and jawline." },
  { label: "Golden Glow", prompt: "Add warm sunset cinematic lighting, soft backlighting, and a sun-drenched editorial atmosphere." },
  { label: "Hyper-Sharp", prompt: "Maximize micro-contrast and sharpening for a hyper-realistic commercial fashion look. Extreme clarity in eyes and hair." },
  { label: "Film Aesthetic", prompt: "Apply 35mm high-end film stock aesthetic with organic grain, slight halation on highlights, and rich cinematic colors." },
  { label: "Vogue Noir", prompt: "Dramatic high-contrast monochrome editorial. Deep blacks, crisp white highlights, and a timeless fashion mood." },
  { label: "Cyber Neon", prompt: "Add sharp futuristic neon light accents, vibrant colored shadows, and a high-tech midnight editorial vibe." },
  { label: "Soft Dream", prompt: "Ethereal soft-focus look with a subtle bloom on highlights and a romantic, painterly editorial texture." },
  { label: "Urban Edge", prompt: "Gritty urban high-fashion grade: punchy contrast, cool shadows, and sharp industrial lighting." },
];

const CURATED_THEMES = [
  { label: "Nordic Winter", prompt: "High fashion editorial in a stark, beautiful Nordic winter landscape, fur coats, cool blue lighting." },
  { label: "Desert Mirage", prompt: "Cinematic fashion shot in a sun-drenched dunes, silk flowing fabrics, warm golden hour." },
  { label: "Cyber Punk", prompt: "Neon-lit urban future, metallic fabrics, rain-slicked streets, ultra-sharp detail." },
  { label: "Secret Garden", prompt: "Whimsical haute couture in a lush over-grown secret garden, soft lighting, floral motifs." }
];

const getClosestAspectRatio = (width: number, height: number): AspectRatio => {
  const ratio = width / height;
  const targets: { ratio: number; value: AspectRatio }[] = [
    { ratio: 1, value: "1:1" },
    { ratio: 3/4, value: "3:4" },
    { ratio: 4/3, value: "4:3" },
    { ratio: 9/16, value: "9:16" },
    { ratio: 16/9, value: "16:9" },
  ];
  return targets.sort((a, b) => Math.abs(ratio - a.ratio) - Math.abs(ratio - b.ratio))[0].value;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('enhance');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [detectedRatio, setDetectedRatio] = useState<AspectRatio>("3:4");
  const [selectedStyle, setSelectedStyle] = useState<StyleOption | null>(null);
  const [fineTuneParams, setFineTuneParams] = useState<FineTuneParams>({ lighting: 50, temperature: 50, contrast: 50 });
  const [imageSize, setImageSize] = useState<ImageResolution>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [showFullScreen, setShowFullScreen] = useState(false);

  const steps = [
    "Analyzing visual canvas...",
    "Sampling texture patterns...",
    "Synthesizing stylistic layers...",
    "Refining neural contours...",
    "Applying high-fashion grade..."
  ];

  const handleImageUpload = (img: string) => {
    setSourceImage(img);
    const i = new Image();
    i.onload = () => {
      setDetectedRatio(getClosestAspectRatio(i.width, i.height));
    };
    i.src = img;
  };

  const handleAction = async (forcedPrompt?: string) => {
    if (activeTab === 'enhance' && !sourceImage) return;

    if (activeTab === 'create' || imageSize !== '1K') {
      try {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      } catch (e) {
        console.error("Failed to check or open API key dialog", e);
      }
    }

    setIsGenerating(true);
    setError(null);
    setResultImage(null);
    setAnalysisText(null);

    let idx = 0;
    const interval = setInterval(() => {
      setStatus(steps[idx % steps.length]);
      idx++;
    }, 2000);

    try {
      let res: string;
      if (activeTab === 'enhance') {
        if (forcedPrompt) {
          res = await editImageWithPrompt({ 
            sourceImage: sourceImage!, 
            prompt: forcedPrompt,
            aspectRatio: detectedRatio
          });
        } else if (selectedStyle) {
          res = await generateFashionPortrait({
            sourceImage: sourceImage!,
            styleName: selectedStyle.name,
            styleDescription: selectedStyle.description,
            aspectRatio: detectedRatio,
            fineTune: fineTuneParams
          });
        } else {
          throw new Error("Please select a style or refinement.");
        }
      } else {
        const finalPrompt = forcedPrompt || CURATED_THEMES[0].prompt;
        res = await generateNewImage({ 
          prompt: finalPrompt, 
          imageSize,
          aspectRatio: "3:4" 
        });
      }
      setResultImage(res);
    } catch (err: any) {
      setError(err.message || "Operation failed. Please try again.");
      if (err.message?.includes("Requested entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!sourceImage) return;

    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    } catch (e) {
      console.error("Failed to check or open API key dialog", e);
    }

    setIsGenerating(true);
    setStatus("Deep Neural Thinking...");
    try {
      const text = await analyzeImage(sourceImage);
      setAnalysisText(text);
    } catch (err: any) {
      setError("Analysis failed. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResultImage(null);
    setAnalysisText(null);
    setError(null);
    setSelectedStyle(null);
    setFineTuneParams({ lighting: 50, temperature: 50, contrast: 50 });
  };

  const handleFullReset = () => {
    setSourceImage(null);
    setResultImage(null);
    setAnalysisText(null);
    setError(null);
    setSelectedStyle(null);
    setFineTuneParams({ lighting: 50, temperature: 50, contrast: 50 });
    setStatus("");
    setDetectedRatio("3:4");
  };

  const isButtonDisabled = activeTab === 'enhance' 
    ? (!sourceImage || (!selectedStyle && isGenerating)) 
    : isGenerating;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-lg mx-auto pb-24 shadow-2xl overflow-hidden relative">
      <Header />
      
      {/* Tab Selector */}
      <div className="flex px-6 mb-8 gap-1">
        <button 
          onClick={() => { setActiveTab('enhance'); handleReset(); }}
          className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 
            ${activeTab === 'enhance' ? 'border-white text-white' : 'border-zinc-900 text-zinc-600 hover:text-zinc-400'}`}
        >
          Studio Boutique
        </button>
        <button 
          onClick={() => { setActiveTab('create'); handleReset(); }}
          className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border-b-2 
            ${activeTab === 'create' ? 'border-white text-white' : 'border-zinc-900 text-zinc-600 hover:text-zinc-400'}`}
        >
          Visions Lab
        </button>
      </div>

      <main className="px-6 flex-1 space-y-8 pb-10">
        {resultImage ? (
          <div className="animate-in fade-in zoom-in duration-500 space-y-6">
            <div className="relative group">
              {sourceImage && activeTab === 'enhance' ? (
                <ComparisonView before={sourceImage} after={resultImage} />
              ) : (
                <div className="w-full h-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                  <img src={resultImage} className="w-full h-auto block" alt="Generated" />
                </div>
              )}
              
              <button 
                onClick={() => setShowFullScreen(true)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-white hover:text-black p-2 rounded-full backdrop-blur-md transition-all z-20 border border-white/10"
                title="Full Screen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleReset}
                className="py-4 border border-zinc-800 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-900 transition-all"
              >
                Reset Studio
              </button>
              <button 
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = resultImage;
                  a.download = `studio-export-${Date.now()}.png`;
                  a.click();
                }}
                className="py-4 bg-white text-black rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
              >
                Save Masterpiece
              </button>
            </div>
            <button 
              onClick={() => setShowFullScreen(true)}
              className="w-full py-4 text-[9px] uppercase tracking-[0.4em] text-zinc-400 font-bold border border-zinc-900 rounded-2xl transition-all hover:bg-zinc-900"
            >
              View Full Screen
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {activeTab === 'enhance' ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold px-1">Phase 1: Input Portrait</p>
                  <ImageUploader 
                    onImageUpload={handleImageUpload} 
                    currentImage={sourceImage} 
                    disabled={isGenerating}
                  />
                  
                  {sourceImage && !isGenerating && (
                    <button 
                      onClick={handleAnalyze}
                      className="w-full py-2 text-[9px] uppercase tracking-widest text-zinc-400 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all"
                    >
                      AI Insight: Deep Analysis
                    </button>
                  )}

                  {analysisText && (
                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Neural Insights</p>
                      <p className="text-[11px] leading-relaxed text-zinc-300 font-light italic">
                        {analysisText}
                      </p>
                    </div>
                  )}

                  <StyleSelector 
                    selectedId={selectedStyle?.id || ''} 
                    onSelect={(style) => setSelectedStyle(style)} 
                    disabled={isGenerating}
                  />

                  {selectedStyle && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <FineTuneControls 
                        params={fineTuneParams} 
                        onChange={setFineTuneParams} 
                        disabled={isGenerating}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold px-1">Editorial Refinements</p>
                  <div className="flex flex-wrap gap-2">
                    {REFINEMENTS.map((ref) => (
                      <button
                        key={ref.label}
                        disabled={!sourceImage || isGenerating}
                        onClick={() => handleAction(ref.prompt)}
                        className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all border disabled:opacity-30
                          ${ref.label === "Editorial Pack" ? "bg-white text-black border-white" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"}`}
                      >
                        {ref.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold px-1">Neural Vision Themes</p>
                  <div className="grid grid-cols-2 gap-3">
                    {CURATED_THEMES.map((theme) => (
                      <button
                        key={theme.label}
                        disabled={isGenerating}
                        onClick={() => handleAction(theme.prompt)}
                        className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:border-zinc-500 hover:text-white transition-all text-center h-24 flex items-center justify-center leading-relaxed"
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold px-1">Export Resolution</p>
                  <div className="flex gap-2">
                    {(['1K', '2K', '4K'] as ImageResolution[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setImageSize(size)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold tracking-widest border transition-all
                          ${imageSize === size ? 'bg-white text-black border-white' : 'bg-zinc-950 text-zinc-600 border-zinc-800 hover:border-zinc-700'}`}
                        disabled={isGenerating}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-4">
              {isGenerating ? (
                <div className="w-full py-5 space-y-5">
                  <div className="h-[2px] bg-zinc-900 overflow-hidden relative rounded-full">
                    <div className="absolute inset-0 bg-white w-1/4 animate-progress-slide"></div>
                  </div>
                  <p className="text-center text-[9px] uppercase tracking-[0.4em] text-zinc-400 font-medium animate-pulse">
                    {status}
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAction()}
                    disabled={isButtonDisabled}
                    className={`w-full py-5 rounded-2xl text-xs font-bold uppercase tracking-[0.3em] shadow-2xl transition-all duration-500
                      ${isButtonDisabled 
                        ? 'bg-zinc-900 text-zinc-600 opacity-50 cursor-not-allowed border border-transparent' 
                        : 'bg-white text-black border border-white hover:scale-[1.02] active:scale-95'}`}
                  >
                    {activeTab === 'enhance' ? 'Execute Transformation' : 'Generate Creation'}
                  </button>
                  
                  {(sourceImage || resultImage || error) && (
                    <button 
                      onClick={handleFullReset}
                      className="w-full py-4 text-[9px] uppercase tracking-[0.4em] text-zinc-600 hover:text-zinc-300 font-bold border border-zinc-900 rounded-2xl transition-all"
                    >
                      Reset Studio Session
                    </button>
                  )}
                </>
              )}

              {error && (
                <div className="mt-6 p-4 rounded-xl border border-red-900/50 bg-red-900/10 text-red-400 text-[10px] uppercase tracking-widest text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Full Screen Modal */}
      {showFullScreen && resultImage && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <button 
            onClick={() => setShowFullScreen(false)}
            className="absolute top-6 right-6 text-white p-4 z-[110] hover:scale-110 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-full h-full flex items-center justify-center relative">
            <img 
              src={resultImage} 
              className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 animate-in zoom-in-95 duration-500" 
              alt="Editorial View" 
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 opacity-60">
              <p className="text-[10px] uppercase tracking-[0.6em] text-white font-bold whitespace-nowrap">Neural Masterpiece Output</p>
            </div>
          </div>
        </div>
      )}

      {!isGenerating && !resultImage && (
        <footer className="absolute bottom-8 left-0 right-0 text-center px-10">
          <p className="text-zinc-600 text-[8px] uppercase tracking-[0.5em] font-light leading-relaxed">
            Neural Engine v3.0 • Intelligent Fashion Lab
          </p>
        </footer>
      )}

      <style>{`
        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-progress-slide {
          animation: progress-slide 2.5s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
