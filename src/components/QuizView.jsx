import { useState, useCallback } from 'react';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import NavControls from './NavControls';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';

export default function QuizView({ quizQuestions, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];
  const selectedAnswer = answers[currentIndex] ?? null;
  const isCorrect =
    selectedAnswer !== null && selectedAnswer === currentQuestion.correctAnswer;

  const handleSelect = (index) => {
    if (selectedAnswer !== null) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: index }));
  };


  const handleKey = useCallback((e) => {
    if (e.key === 'ArrowLeft') setCurrentIndex((i) => Math.max(0, i - 1));
    if (e.key === 'ArrowRight' && selectedAnswer !== null) {
      setCurrentIndex((i) => Math.min(quizQuestions.length - 1, i + 1));
    }
    if (e.key >= '1' && e.key <= '4' && selectedAnswer === null) {
      handleSelect(parseInt(e.key, 10) - 1);
    }
  }, [currentIndex, selectedAnswer, quizQuestions.length]);

  useKeyboardNav(handleKey, [currentIndex, selectedAnswer]);

  const score = Object.entries(answers).reduce((acc, [i, ans]) => {
    return acc + (ans === quizQuestions[Number(i)].correctAnswer ? 1 : 0);
  }, 0);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === quizQuestions.length;

  if (showResults) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="min-h-screen flex flex-col relative">
        <AnimatedBackground />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-10 max-w-md w-full text-center animate-slide-up">
            <Trophy size={56} className="mx-auto text-accent-400 mb-4" />
            <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">¡Sesión completada!</h2>
            <p className="text-5xl font-extrabold text-brand-600 mb-1">
              {score}/{quizQuestions.length}
            </p>
            <p className="text-gray-500 mb-8">{pct}% de aciertos</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowResults(false); setAnswers({}); setCurrentIndex(0); }} className="btn-primary w-full">
                Repetir quiz
              </button>
              <button onClick={onReset} className="btn-secondary w-full justify-center flex items-center gap-2">
                <RotateCcw size={18} />
                Nuevo contenido
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              Opción múltiple
            </span>
            {allAnswered && (
              <button
                onClick={() => setShowResults(true)}
                className="ml-auto text-sm font-semibold text-brand-600 hover:text-brand-500"
              >
                Ver resultados →
              </button>
            )}
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-800 mb-6 leading-snug">
            {currentQuestion.question}
          </h2>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => {
              let style = 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-2 border-transparent';
              if (selectedAnswer !== null) {
                if (index === currentQuestion.correctAnswer) {
                  style = 'bg-emerald-50 text-emerald-800 border-emerald-400';
                } else if (index === selectedAnswer) {
                  style = 'bg-red-50 text-red-800 border-red-400';
                } else {
                  style = 'bg-gray-50 text-gray-400 opacity-60 border-transparent';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full py-4 px-5 rounded-xl text-left font-medium transition-all border-2 ${style}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      <span className="text-brand-500 font-bold mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </span>
                    {selectedAnswer === index &&
                      (isCorrect ? (
                        <CheckCircle className="text-emerald-500 shrink-0" size={22} />
                      ) : (
                        <XCircle className="text-red-500 shrink-0" size={22} />
                      ))}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && currentQuestion.explanation && (
            <div className="mt-5 p-4 bg-brand-50 border border-brand-100 rounded-xl text-sm text-brand-800">
              <strong>Explicación:</strong> {currentQuestion.explanation}
            </div>
          )}
        </div>

        <NavControls
          currentIndex={currentIndex}
          total={quizQuestions.length}
          onPrevious={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentIndex((i) => Math.min(quizQuestions.length - 1, i + 1))}
          canGoNext={selectedAnswer !== null}
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
