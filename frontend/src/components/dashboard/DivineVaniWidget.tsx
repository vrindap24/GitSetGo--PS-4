import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Sparkles } from 'lucide-react';
import { assistantQuery } from '../../services/gemini';
import clsx from 'clsx';

export default function RefloAIWidget() {
  const [isListening, setIsListening] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuery = async (text: string) => {
    setQuery(text);
    setIsProcessing(true);
    const res = await assistantQuery(text);
    setResponse(res);
    setIsProcessing(false);
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleQuery(transcript);
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald/5 h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={100} className="text-saffron" />
      </div>

      <h3 className="text-lg font-serif font-bold text-emerald mb-2 flex items-center gap-2">
        Reflo AI
        <span className="text-[10px] bg-saffron/20 text-saffron-dark px-2 py-0.5 rounded-full">Beta</span>
      </h3>
      <p className="text-xs text-gray-500 mb-6">Powered by Gemini 3 Flash</p>

      {/* Voice Interface */}
      <div className="flex-1 flex flex-col items-center justify-center mb-6">
        <button
          onClick={toggleListening}
          className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500",
            isListening ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]" : "bg-saffron shadow-[0_0_30px_rgba(0,150,190,0.3)] hover:scale-105"
          )}
        >
          <Mic size={32} className="text-white" />
        </button>

        {/* Dynamic Waveform Visual */}
        <div className="h-12 flex items-center gap-1 mt-6">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: isListening || isProcessing ? [10, 30, 10] : 4 }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
              className={clsx("w-1 rounded-full", isListening ? "bg-red-400" : "bg-emerald/20")}
            />
          ))}
        </div>
      </div>

      {/* Response Area */}
      <div className="bg-ivory rounded-xl p-4 border border-emerald/5 min-h-[120px] relative">
        <AnimatePresence mode="wait">
          {response ? (
            <motion.div
              key="response"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-800"
            >
              <p className="font-bold text-emerald mb-1">Gemini Analysis:</p>
              {response}
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-xs text-gray-400 italic mb-3">Try asking:</p>
              <button
                onClick={() => handleQuery("Why are Dal Khichdi reviews dropping?")}
                className="text-sm font-medium text-emerald bg-white border border-emerald/10 px-3 py-2 rounded-lg hover:bg-emerald/5 transition-colors"
              >
                "Why are Dal Khichdi reviews dropping?"
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="w-6 h-6 border-2 border-emerald border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
