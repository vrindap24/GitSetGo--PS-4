
import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { AudioRecorder, AudioPlayer } from '../lib/audio-utils';

export function useLiveAPI() {
  const [isConnected, setIsConnected] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const sessionRef = useRef<any>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);

  const disconnect = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
    }
    if (playerRef.current) {
      playerRef.current.stop();
    }
    if (sessionRef.current) {
        try {
            // @ts-ignore
            sessionRef.current.close();
        } catch (e) {
            console.warn("Error closing session", e);
        }
    }
    
    sessionRef.current = null;
    setIsConnected(false);
    setVolume(0);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const connect = useCallback(async () => {
    if (isConnected) return;

    try {
      const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // Initialize audio player
      playerRef.current = new AudioPlayer();

      // Initialize audio recorder
      recorderRef.current = new AudioRecorder((base64Data, vol) => {
        setVolume(vol);
        if (sessionRef.current) {
          sessionRef.current.sendRealtimeInput([
            {
              mimeType: "audio/pcm;rate=16000",
              data: base64Data,
            },
          ]);
        }
      });

      const sessionPromise = client.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        callbacks: {
            onopen: async () => {
                console.log("Connection opened");
                setIsConnected(true);
                // Start recording once connected
                if (recorderRef.current) {
                    await recorderRef.current.start();
                }
            },
            onmessage: async (message: LiveServerMessage) => {
                // Handle audio output
                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (base64Audio) {
                    playerRef.current?.play(base64Audio);
                }
            },
            onclose: () => {
                console.log("Connection closed");
                disconnect();
            },
            onerror: (err) => {
                console.error("Connection error:", err);
                disconnect();
            }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
        },
      });
      
      // Wait for session to be established
      const session = await sessionPromise;
      sessionRef.current = session;

    } catch (error) {
      console.error("Error connecting to Live API:", error);
      disconnect();
    }
  }, [isConnected, disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
    volume,
  };
}
