import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  HelpCircle,
} from 'lucide-react';
import NavControls from './NavControls';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';

const TYPE_LABELS = {
  multiple: 'Opción múltiple',
  truefalse: 'Verdadero / Falso',
  fill: 'Completar',
  match: 'Emparejar',
};

function isAnswerCorrect(question, answer) {
  if (answer === null || answer === undefined) return false;
  if (question.type === 'multiple' || question.type === 'truefalse') {
    return answer === question.correctAnswer;
  }
  if (question.type === 'fill') {
    return answer?.toLowerCase()?.trim() === question.correctAnswer.toLowerCase().trim();
  }
  if (question.type === 'match') {
    return JSON.stringify(answer) === JSON.stringify(question.correctAnswer);
  }
  return false;
}

export default function TestView({ testQuestions, onReset }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState(() => new Array(testQuestions.length).fill(null));
  const [testSubmitted, setTestSubmitted] = useState(() =>
    new Array(testQuestions.length).fill(false)
  );
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = testQuestions[currentIndex];
  const submitted = testSubmitted[currentIndex];
  const answer = testAnswers[currentIndex];

  const handleTestAnswer = (index, value) => {
    if (testSubmitted[index]) return;
    const next = [...testAnswers];
    next[index] = value;
    setTestAnswers(next);
  };

  const handleSubmit = (index) => {
    if (testAnswers[index] === null || testSubmitted[index]) return;
    const next = [...testSubmitted];
    next[index] = true;
    setTestSubmitted(next);
  };

  const calculateScore = () => {
    let correct = 0;
    testQuestions.forEach((q, i) => {
      if (testSubmitted[i] && isAnswerCorrect(q, testAnswers[i])) correct++;
    });
    const pct = Math.round((correct / testQuestions.length) * 100);
    return { correct, total: testQuestions.length, percentage: pct, scoreOutOf10: Number(((pct / 100) * 10).toFixed(1)) };
  };

  const allSubmitted = testSubmitted.every(Boolean);

  if (showResults) {
    const { correct, total, percentage, scoreOutOf10 } = calculateScore();
    const byType = {};
    testQuestions.forEach((q, i) => {
      if (!byType[q.type]) byType[q.type] = { correct: 0, total: 0 };
      byType[q.type].total++;
      if (isAnswerCorrect(q, testAnswers[i])) byType[q.type].correct++;
    });

    return (
      <div className="min-h-screen flex flex-col relative">
        <AnimatedBackground />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-lg w-full animate-slide-up">
            <Trophy size={52} className="mx-auto text-accent-400 mb-4" />
            <h2 className="font-display text-2xl font-bold text-gray-800 text-center mb-1">
              Resultado de la prueba
            </h2>
            <p className="text-center text-5xl font-extrabold text-brand-600 mb-1">
              {scoreOutOf10}/10
            </p>
            <p className="text-center text-gray-500 mb-6">
              {correct}/{total} correctas ({percentage}%)
            </p>

            <div className="space-y-2 mb-8">
              {Object.entries(byType).map(([type, stats]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-gray-600">{TYPE_LABELS[type] || type}</span>
                  <span className="font-semibold text-gray-800">
                    {stats.correct}/{stats.total}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowResults(false);
                  setTestAnswers(new Array(testQuestions.length).fill(null));
                  setTestSubmitted(new Array(testQuestions.length).fill(false));
                  setCurrentIndex(0);
                }}
                className="btn-primary w-full"
              >
                Repetir prueba
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
        <div className="w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
              {TYPE_LABELS[currentQuestion.type]}
            </span>
            {allSubmitted && (
              <button
                onClick={() => setShowResults(true)}
                className="text-sm font-semibold text-brand-600 hover:text-brand-500"
              >
                Ver resultados →
              </button>
            )}
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          {currentQuestion.type === 'multiple' && (
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleTestAnswer(currentIndex, index)}
                  disabled={submitted}
                  className={`w-full py-4 px-5 rounded-xl text-left font-medium border-2 transition-all ${
                    submitted && answer === index
                      ? isAnswerCorrect(currentQuestion, answer)
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : 'bg-red-50 border-red-400 text-red-800'
                      : answer === index
                        ? 'bg-brand-50 border-brand-400 text-brand-800'
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{String.fromCharCode(65 + index)}. {option}</span>
                    {submitted && answer === index &&
                      (isAnswerCorrect(currentQuestion, answer) ? (
                        <CheckCircle className="text-emerald-500" size={22} />
                      ) : (
                        <XCircle className="text-red-500" size={22} />
                      ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'truefalse' && (
            <div className="grid gap-3 sm:grid-cols-2">
              {['Verdadero', 'Falso'].map((label, index) => {
                const value = index === 0;
                return (
                  <button
                    key={label}
                    onClick={() => handleTestAnswer(currentIndex, value)}
                    disabled={submitted}
                    className={`py-4 px-5 rounded-xl font-semibold border-2 transition-all ${
                      submitted && answer === value
                        ? isAnswerCorrect(currentQuestion, answer)
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                          : 'bg-red-50 border-red-400 text-red-800'
                        : answer === value
                          ? 'bg-brand-50 border-brand-400'
                          : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'fill' && (
            <input
              type="text"
              value={answer || ''}
              onChange={(e) => handleTestAnswer(currentIndex, e.target.value)}
              disabled={submitted}
              placeholder="Escribe tu respuesta..."
              className={`input-field text-lg ${
                submitted
                  ? isAnswerCorrect(currentQuestion, answer)
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-red-400 bg-red-50'
                  : ''
              }`}
            />
          )}

          {currentQuestion.type === 'match' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="flex-1 font-medium text-gray-800">{option}</span>
                  <select
                    value={answer?.[index] || ''}
                    onChange={(e) => {
                      const matches = answer
                        ? [...answer]
                        : new Array(currentQuestion.options.length).fill('');
                      matches[index] = e.target.value;
                      handleTestAnswer(currentIndex, matches);
                    }}
                    disabled={submitted}
                    className="flex-1 input-field py-2"
                  >
                    <option value="">Selecciona...</option>
                    {currentQuestion.matches.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => handleSubmit(currentIndex)}
            disabled={answer === null || submitted}
            className="mt-6 btn-primary w-full disabled:opacity-50"
          >
            Comprobar respuesta
          </button>

          {submitted && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-brand-50 rounded-xl text-sm text-brand-800 flex gap-2">
              <HelpCircle size={18} className="shrink-0" />
              <span>
                <strong>Explicación:</strong> {currentQuestion.explanation}
              </span>
            </div>
          )}
        </div>

        <NavControls
          currentIndex={currentIndex}
          total={testQuestions.length}
          onPrevious={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentIndex((i) => Math.min(testQuestions.length - 1, i + 1))}
          canGoNext={submitted}
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
