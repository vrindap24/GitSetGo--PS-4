import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Camera, Send, CheckCircle2 } from 'lucide-react';

export default function QRIntake() {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  };

  const handleSubmit = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-surface-variant/20 rounded-[24px] border border-outline-variant/20 overflow-hidden shadow-elevation-1"
      >
        {/* Header */}
        <div className="h-32 bg-primary-container flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80')] bg-cover opacity-10 mix-blend-multiply"></div>
          <h1 className="text-2xl font-sans font-normal text-on-primary-container relative z-10">Prasad Food Divine</h1>
          <p className="text-sm text-on-primary-container/80 relative z-10">Table 4 • Dinner Service</p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-lg font-medium text-center mb-6 text-on-surface">How was your experience?</h2>

              <div className="flex justify-center space-x-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-2 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${rating >= star ? 'fill-secondary text-secondary' : 'text-outline-variant'}`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-sm text-center text-on-surface-variant mb-4">What stood out?</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {['Food Taste', 'Service', 'Ambience', 'Hygiene', 'Music'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${tags.includes(tag)
                          ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                          : 'border-outline text-on-surface-variant'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-primary text-on-primary rounded-full font-medium shadow-elevation-2 hover:shadow-elevation-3 transition-shadow"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h2 className="text-lg font-medium text-center mb-2 text-on-surface">Any details?</h2>
              <p className="text-xs text-center text-on-surface-variant mb-6">Your feedback helps us improve.</p>

              <textarea
                className="w-full h-32 p-4 rounded-xl bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary resize-none mb-4 text-sm"
                placeholder="Tell us more..."
              ></textarea>

              <button className="w-full py-3 border border-dashed border-outline rounded-xl text-on-surface-variant flex items-center justify-center mb-6 hover:bg-surface-variant/30 transition-colors">
                <Camera className="w-5 h-5 mr-2" />
                Add Photo (Optional)
              </button>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-primary text-on-primary rounded-full font-medium shadow-elevation-2 hover:shadow-elevation-3 transition-shadow flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-xl font-medium text-on-surface mb-2">Thank You!</h2>
              <p className="text-on-surface-variant text-sm mb-6">Your feedback has been sent directly to the Branch Manager.</p>
              <button onClick={() => window.location.reload()} className="text-primary font-medium text-sm hover:underline">
                Close
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
