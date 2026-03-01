import React, { useState, useEffect, useRef } from 'react';
import { X, Globe, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { refineReviewText } from '../services/gemini';

interface VoiceReviewAssistantProps {
  onReviewGenerated: (text: string) => void;
  onClose: () => void;
}

export function VoiceReviewAssistant({ onReviewGenerated, onClose }: VoiceReviewAssistantProps) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let recognition: any;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setTranscript(prev => finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
             setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } else {
      console.error('Speech recognition not supported');
      setTranscript("Speech recognition not supported in this browser.");
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const handleStop = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    
    if (!transcript.trim()) {
      onClose();
      return;
    }

    setIsProcessing(true);
    try {
      const refinedText = await refineReviewText(transcript);
      onReviewGenerated(refinedText || transcript);
    } catch (error) {
      console.error("Error processing review:", error);
      onReviewGenerated(transcript);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col font-sans"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant">
          <X className="w-6 h-6" />
        </button>
        
        {/* Language Pill */}
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-outline/20 rounded-full shadow-sm">
          <Globe className="w-4 h-4 text-on-surface-variant" />
          <span className="text-sm font-medium text-on-surface">English</span>
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </div>

        <div className="w-10" /> {/* Spacer for balance */}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        
        {/* Listening Text */}
        <h2 className="text-3xl font-normal text-on-surface mb-16">
          {transcript || "Listening..."}
        </h2>

        {/* Google Assistant Bars Animation */}
        <div className="flex items-center justify-center gap-3 h-24">
          {/* Blue Bar */}
          <motion.div
            animate={isListening ? { height: [20, 50, 20, 60, 20] } : { height: 20 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="w-4 bg-[#4285F4] rounded-full"
          />
          {/* Red Bar */}
          <motion.div
            animate={isListening ? { height: [30, 70, 30, 40, 30] } : { height: 30 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.1 }}
            className="w-4 bg-[#DB4437] rounded-full"
          />
          {/* Yellow Bar */}
          <motion.div
            animate={isListening ? { height: [25, 60, 25, 80, 25] } : { height: 25 }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.2 }}
            className="w-4 bg-[#F4B400] rounded-full"
          />
          {/* Green Bar */}
          <motion.div
            animate={isListening ? { height: [20, 55, 20, 45, 20] } : { height: 20 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.3 }}
            className="w-4 bg-[#0F9D58] rounded-full"
          />
        </div>

      </div>

      {/* Bottom Action */}
      <div className="pb-12 px-6 flex justify-center">
        <button 
          onClick={handleStop}
          disabled={isProcessing}
          className="bg-surface-container-high text-on-surface px-8 py-4 rounded-full font-medium text-lg hover:bg-surface-container-highest transition-colors flex items-center gap-3 disabled:opacity-50 shadow-md"
        >
          {isProcessing ? (
            <>
              <div className="w-3 h-3 bg-google-blue rounded-full animate-bounce" />
              Refining...
            </>
          ) : isListening ? (
            <>
              <div className="w-3 h-3 bg-google-red rounded-full animate-pulse" />
              Stop Listening
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-google-green rounded-full" />
              Processing...
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
