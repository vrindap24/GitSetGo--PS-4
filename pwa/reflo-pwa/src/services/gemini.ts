import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client lazily — only when actually needed.
// Uses Vite's import.meta.env for browser-safe environment variable access.
// This prevents the "API Key must be set" error from crashing the app on load.

let _ai: InstanceType<typeof GoogleGenAI> | null = null;

function getAI(): InstanceType<typeof GoogleGenAI> {
  if (!_ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn(
        '⚠️ VITE_GEMINI_API_KEY is not set. Audio transcription and text refinement features will be disabled. ' +
        'Create a .env file in the PWA root with: VITE_GEMINI_API_KEY=your_key_here'
      );
      throw new Error('Gemini API key not configured. This feature requires VITE_GEMINI_API_KEY in .env');
    }
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

export async function transcribeAudioReview(audioBlob: Blob): Promise<string> {
  try {
    const ai = getAI();

    // Convert Blob to Base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const base64Audio = await base64Promise;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || "audio/webm",
              data: base64Audio,
            },
          },
          {
            text: "You are a helpful assistant for a restaurant app. The user is dictating a review for a food item. The audio may be in Hindi or English. Transcribe the audio exactly as spoken into English text (if spoken in Hindi, translate it to English, but keep the sentiment). If it's already English, just refine it slightly for grammar. Output ONLY the final review text, nothing else.",
          },
        ],
      },
    });

    return response.text || "Could not transcribe audio.";
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
}

export async function refineReviewText(text: string): Promise<string> {
  try {
    const ai = getAI();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview",
      contents: {
        parts: [
          {
            text: `Refine the following restaurant review text. Fix grammar, improve clarity, and ensure it sounds natural. Keep the original sentiment and meaning. If the text is very short or nonsensical, just return it as is.
            
            Original Text: "${text}"
            
            Refined Text:`,
          },
        ],
      },
    });
    return response.text || text;
  } catch (error) {
    console.error("Error refining review:", error);
    return text;
  }
}
