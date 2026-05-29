import { useState, useCallback } from 'react';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { Shuffle, Download, RotateCcw, ThumbsUp } from 'lucide-react';
import NavControls from './NavControls';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
import { downloadJson } from '../utils/exportData';

export default function StudyView({ flashcards: initialCards, onReset, onShuffle }) {
  const [flashcards, setFlashcards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [mastered, setMastered] = useState(new Set());

  const currentCard = flashcards[currentIndex];
  const masteredCount = mastered.size;

  const goTo = (index) => {
    if (animating || index < 0 || index >= flashcards.length) return;
    setAnimating(true);
    setTimeout(() => {
      setFlipped(false);
      setCurrentIndex(index);
      setTimeout(() => setAnimating(false), 50);
    }, 150);
  };

  const handleShuffle = () => {
    const shuffled = onShuffle(flashcards);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setFlipped(false);
    setMastered(new Set());
  };

  const toggleMastered = () => {
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  };

  const progressPct = flashcards.length
    ? Math.round((masteredCount / flashcards.length) * 100)
    : 0;

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    },
    [currentIndex, animating, flashcards.length]
  );

  useKeyboardNav(handleKey, [currentIndex, animating, flipped]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-8">
        <div className="w-full max-w-2xl mb-4">
          <div className="flex justify-between items-center text-sm text-white/60 mb-2">
            <span>Dominadas: {masteredCount}/{flashcards.length}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-brand-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="relative w-full max-w-2xl mb-8" style={{ perspective: '1200px' }}>
          <div
            className={`relative w-full min-h-[320px] sm:min-h-[380px] cursor-pointer transition-all duration-700 ${
              flipped ? 'rotate-y-180' : ''
            } ${animating ? 'scale-95 opacity-80' : ''}`}
            onClick={() => setFlipped(!flipped)}
            style={{ transformStyle: 'preserve-3d' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setFlipped(!flipped);
              }
            }}
            aria-label={flipped ? 'Mostrar pregunta' : 'Mostrar respuesta'}
          >
            <div
              className="absolute inset-0 glass-card rounded-3xl flex flex-col items-center justify-center p-8 sm:p-12"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-500 mb-4">
                Pregunta
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-gray-800 text-center leading-tight">
                {currentCard.front}
              </h2>
              <p className="mt-auto text-gray-400 text-sm">Clic o ↑↓ para voltear</p>
            </div>

            <div
              className="absolute inset-0 rounded-3xl flex items-center justify-center p-8 sm:p-12 bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-100 shadow-card"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-500 mb-4 block">
                  Respuesta
                </span>
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                  {currentCard.back}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={toggleMastered}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              mastered.has(currentIndex)
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'glass text-white/80 hover:bg-white/15'
            }`}
          >
            <ThumbsUp size={18} />
            {mastered.has(currentIndex) ? 'Dominada' : 'Marcar dominada'}
          </button>
          <button onClick={handleShuffle} className="btn-secondary flex items-center gap-2">
            <Shuffle size={18} />
            Mezclar
          </button>
          <button
            onClick={() => downloadJson(flashcards, 'smartflip-flashcards.json')}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>

        <NavControls
          currentIndex={currentIndex}
          total={flashcards.length}
          onPrevious={() => goTo(currentIndex - 1)}
          onNext={() => goTo(currentIndex + 1)}
        />

        <button onClick={onReset} className="mt-8 btn-secondary flex items-center gap-2">
          <RotateCcw size={18} />
          Crear nuevo contenido
        </button>
      </div>
      <Footer />
    </div>
  );
}
