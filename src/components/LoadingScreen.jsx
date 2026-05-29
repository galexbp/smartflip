import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
import { LOADING_TIPS } from '../constants/settings';

export default function LoadingScreen({ message }) {
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((i) => (i + 1) % LOADING_TIPS.length);
    }, 4000);
    return () => clearInterval(tipTimer);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 92 ? p : p + Math.random() * 8));
    }, 600);
    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-brand-500/30 animate-ping" />
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 shadow-glow">
              <Brain size={40} className="text-white animate-pulse-soft" />
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Generando contenido
          </h1>
          <p className="text-white/70 mb-6">{message || 'La IA está procesando tu material...'}</p>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-accent-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 95)}%` }}
            />
          </div>

          <p className="text-sm text-white/50 italic min-h-[3rem] transition-opacity duration-300">
            💡 {LOADING_TIPS[tipIndex]}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
