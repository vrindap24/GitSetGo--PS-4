import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Send, Image as ImageIcon, FileText, Sparkles, MoreVertical } from 'lucide-react';
import clsx from 'clsx';
import { GoogleGenAI } from "@google/genai";
import { useLiveAPI } from '../hooks/use-live-api';

interface RefloAssistantProps {
  onClose?: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  attachments?: string[];
  actions?: string[];
}

export default function RefloAssistant({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { connect, disconnect, isConnected, volume } = useLiveAPI();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: 'Hi, I\'m Reflo AI. How can I help you today?',
      actions: ['Analyze Reviews', 'Draft Response', 'Check Sales']
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      // Initialize Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      // Use standard flash model for text interactions
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: response.text || "I'm sorry, I couldn't process that.",
        actions: ['Follow up', 'Details']
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: "I'm having trouble connecting to the Reflo network right now.",
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const toggleListening = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  // Google Assistant Style UI
  return (
    <>
      {/* Assistant Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[80vh] md:h-[600px] md:w-[400px] md:right-6 md:left-auto md:bottom-6 md:rounded-[24px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden rounded-t-[24px]"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Sparkles className="w-4 h-4 text-[#4285F4]" />
                </div>
                <span className="font-medium text-gray-700">Reflo AI</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={clsx("flex flex-col gap-2", msg.type === 'user' ? "items-end" : "items-start")}>
                  <div className={clsx(
                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.type === 'user'
                      ? "bg-[#4285F4] text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                  )}>
                    {msg.text}
                  </div>

                  {/* AI Action Chips */}
                  {msg.type === 'ai' && msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Google Assistant Style */}
            <div className="p-4 bg-white border-t border-gray-100 relative">
              {/* Google Colors Bar */}
              {isConnected && (
                <div className="absolute top-0 left-0 right-0 h-1 flex">
                  <motion.div
                    animate={{ height: Math.max(4, volume * 20) }}
                    className="flex-1 bg-[#4285F4]"
                  />
                  <motion.div
                    animate={{ height: Math.max(4, volume * 30) }}
                    className="flex-1 bg-[#DB4437]"
                  />
                  <motion.div
                    animate={{ height: Math.max(4, volume * 25) }}
                    className="flex-1 bg-[#F4B400]"
                  />
                  <motion.div
                    animate={{ height: Math.max(4, volume * 20) }}
                    className="flex-1 bg-[#0F9D58]"
                  />
                </div>
              )}

              <div className="relative flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mt-2">
                <button
                  onClick={toggleListening}
                  className={clsx(
                    "p-2 rounded-full transition-colors",
                    isConnected ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-gray-200 text-gray-500"
                  )}
                >
                  <Mic size={20} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isConnected ? "Listening..." : "Ask anything..."}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-sm"
                />
                <button
                  onClick={handleSend}
                  className={clsx(
                    "p-2 rounded-full transition-colors",
                    input.trim() ? "text-[#4285F4]" : "text-gray-400"
                  )}
                >
                  <Send size={20} />
                </button>
              </div>

              <div className="flex justify-center mt-4 gap-6">
                <button className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#4285F4]">
                    <ImageIcon size={18} />
                  </div>
                  <span>Lens</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#4285F4]">
                    <FileText size={18} />
                  </div>
                  <span>Summarize</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
