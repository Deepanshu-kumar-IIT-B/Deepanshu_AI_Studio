
import { GoogleGenAI } from "@google/genai";

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export interface FineTuneParams {
  lighting: number;
  temperature: number;
  contrast: number;
}

export interface GenerationParams {
  sourceImage: string;
  styleName: string;
  styleDescription: string;
  aspectRatio?: AspectRatio;
  fineTune?: FineTuneParams;
}

export interface EditParams {
  sourceImage: string;
  prompt: string;
  aspectRatio?: AspectRatio;
}

export interface NewImageParams {
  prompt: string;
  imageSize: "1K" | "2K" | "4K";
  aspectRatio?: AspectRatio;
}

export const analyzeImage = async (sourceImage: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = sourceImage.split(',')[1];
  const mimeType = sourceImage.split(',')[0].split(':')[1].split(';')[0];

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: "Perform a professional fashion analysis. Focus on the subject's unique features, hairstyle, and facial hair. Identify the core visual essence that must be preserved.",
        },
      ],
    },
  });

  return response.text || "Analysis unavailable.";
};

export const generateFashionPortrait = async ({ 
  sourceImage, 
  styleName, 
  styleDescription, 
  aspectRatio = "3:4",
  fineTune 
}: GenerationParams) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = sourceImage.split(',')[1];
  const mimeType = sourceImage.split(',')[0].split(':')[1].split(';')[0];

  let categoryInstruction = "";
  if (styleDescription.toLowerCase().includes("background")) {
    categoryInstruction = "SCENE REPLACEMENT: Extract the person from the current image and place them in the described background. Keep the person lighting consistent with the new scene.";
  } else if (styleDescription.toLowerCase().includes("pose")) {
    categoryInstruction = "POSE ADJUSTMENT: Subtle adjustment of the posture while keeping the face perfectly static and identical.";
  } else if (styleDescription.toLowerCase().includes("creative")) {
    categoryInstruction = "ARTISTIC TRANSLATION: Interpret the person's features into the specified art style (Anime, Sketch, Oil) while maintaining the recognizable likeness of Deepanshu.";
  } else if (styleName.toLowerCase().includes("kodachrome") || styleName.toLowerCase().includes("ektachrome") || styleName.toLowerCase().includes("film") || styleName.toLowerCase().includes("polaroid")) {
    categoryInstruction = "ANALOG EMULATION: Apply specific film grain, color shifts, and halation characteristic of the requested film stock. Ensure the result looks like it was shot on professional analog hardware.";
  }

  // Handle fine-tuning logic
  let tuningInstructions = "";
  if (fineTune) {
    const { lighting, temperature, contrast } = fineTune;
    
    if (lighting < 30) {
      tuningInstructions += "- Lighting: Moody, low-key, heavy shadows.\n";
    } else if (lighting > 70) {
      tuningInstructions += "- Lighting: Bright, high-key, clean studio fill.\n";
    }

    if (temperature < 30) {
      tuningInstructions += "- Color: Cool, arctic blue tones.\n";
    } else if (temperature > 70) {
      tuningInstructions += "- Color: Warm golden hour glow.\n";
    }

    if (contrast > 70) {
      tuningInstructions += "- Contrast: High dynamic range, punchy blacks and crisp highlights for maximum pop.\n";
    } else if (contrast < 30) {
      tuningInstructions += "- Contrast: Low contrast, soft, filmic look with raised blacks.\n";
    }
  }

  const promptText = `Act as a world-class AI visual retoucher. 
  Target Style: ${styleName}
  Target Details: ${styleDescription}
  ${categoryInstruction}
  ${tuningInstructions}

  STRICT IDENTITY PRESERVATION:
  1. The FACE structure, eyes, and nose must remain 100% identical to the source.
  2. The BEARD and FACIAL HAIR style and grooming must be exactly as seen in the source.
  3. The HAIRSTYLE and hair texture must remain unchanged.
  4. Only apply the style effects (lighting, colors, background, pose) around this preserved core identity.

  Technical Quality: Cinematic, 8k, professional fashion editorial output.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: promptText },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio
      }
    }
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("Generation failed.");
};

export const editImageWithPrompt = async ({ sourceImage, prompt, aspectRatio = "3:4" }: EditParams) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = sourceImage.split(',')[1];
  const mimeType = sourceImage.split(',')[0].split(':')[1].split(';')[0];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: `Modify this image: ${prompt}. Maintain facial identity, beard, and hair perfectly.` },
      ],
    },
    config: { imageConfig: { aspectRatio } }
  });

  if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
    return `data:image/png;base64,${response.candidates[0].content.parts[0].inlineData.data}`;
  }
  throw new Error("Edit failed.");
};

export const generateNewImage = async ({ prompt, imageSize, aspectRatio = "3:4" }: NewImageParams) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `Fashion Editorial: ${prompt}` }] },
    config: { imageConfig: { aspectRatio, imageSize } },
  });

  if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
    return `data:image/png;base64,${response.candidates[0].content.parts[0].inlineData.data}`;
  }
  throw new Error("Creation failed.");
};
