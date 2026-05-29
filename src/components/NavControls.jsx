import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavControls({
  currentIndex,
  total,
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
}) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious || currentIndex === 0}
        className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Anterior"
      >
        <ChevronLeft size={22} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="glass px-5 py-2.5 rounded-2xl min-w-[5rem] text-center">
        <span className="text-white font-bold text-lg">
          {currentIndex + 1}
          <span className="text-white/50 font-normal"> / {total}</span>
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={!canGoNext || currentIndex >= total - 1}
        className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Siguiente"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
