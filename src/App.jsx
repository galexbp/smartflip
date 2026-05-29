// WEBAPP CREATED BY ALEXANDER BONE, HTTPS://WWW.ALEXBOPE75.COM
import { useState, useEffect, useCallback } from 'react';
import { generateFlashcards, generateQuiz, generatePracticeTest } from '/services/deepseekApi';
import { parseFile } from '/utils/fileParser';
import { useApiKey } from './hooks/useApiKey';
import { shuffleArray } from './utils/shuffle';
import AnimatedBackground from './components/AnimatedBackground';
import CreateView from './components/CreateView';
import LoadingScreen from './components/LoadingScreen';
import StudyView from './components/StudyView';
import QuizView from './components/QuizView';
import TestView from './components/TestView';
import ApiKeyModal from './components/ApiKeyModal';
import Footer from './components/Footer';

const App = () => {
  const { apiKey, setApiKey, hasApiKey, showModal, setShowModal } = useApiKey();

  const [mode, setMode] = useState('create');
  const [content, setContent] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [testQuestions, setTestQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('describe');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [itemCount, setItemCount] = useState(15);
  const [showSettings, setShowSettings] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 10 MB.');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Tipo no soportado. Solo PDF, TXT y DOCX.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const canGenerate =
    hasApiKey &&
    ((activeTab === 'file' && file) || (activeTab !== 'file' && content.trim()));

  const handleGenerateContent = async (type) => {
    if (!hasApiKey) {
      setShowModal(true);
      return;
    }

    if (activeTab === 'describe' && !content.trim()) {
      setError('Describe un tema para generar contenido.');
      return;
    }
    if (activeTab === 'paste' && !content.trim()) {
      setError('Pega texto para generar contenido.');
      return;
    }
    if (activeTab === 'file' && !file) {
      setError('Selecciona un archivo.');
      return;
    }

    setMode('loading');
    setError('');
    setLoadingMessage('Iniciando...');

    const genOptions = { count: itemCount, difficulty };

    try {
      let textContent = content;

      if (activeTab === 'file' && file) {
        setLoadingMessage(`Procesando ${file.name}...`);
        if (file.type === 'application/pdf') {
          setLoadingMessage('Extrayendo texto del PDF...');
        }
        textContent = await parseFile(file);
        if (!textContent || textContent.trim().length < 50) {
          throw new Error('No se extrajo suficiente texto. Usa un archivo con texto legible.');
        }
      }

      const labels = {
        flashcards: 'flashcards',
        quiz: 'preguntas',
        test: 'prueba',
      };
      setLoadingMessage(`Generando ${labels[type]} con IA...`);

      let result;
      if (type === 'flashcards') {
        result = await generateFlashcards(textContent, activeTab, genOptions);
        if (!result?.length) throw new Error('No se generaron flashcards.');
        setFlashcards(result);
        setMode('study');
      } else if (type === 'quiz') {
        result = await generateQuiz(textContent, activeTab, genOptions);
        if (!result?.length) throw new Error('No se generaron preguntas.');
        setQuizQuestions(result);
        setMode('quiz');
      } else {
        result = await generatePracticeTest(textContent, activeTab, genOptions);
        if (!result?.length) throw new Error('No se generó la prueba.');
        setTestQuestions(result);
        setMode('test');
      }

      setLoadingMessage('');
    } catch (err) {
      console.error(err);
      let msg = err.message || 'Error desconocido.';
      if (err.message?.includes('PDF')) msg = err.message;
      else if (err.message?.includes('Word')) msg = err.message;
      else if (err.message?.includes('API') || err.message?.includes('clave')) msg = err.message;
      setError(msg);
      setMode('create');
      setLoadingMessage('');
    }
  };

  const resetApp = useCallback(() => {
    setMode('create');
    setContent('');
    setFlashcards([]);
    setQuizQuestions([]);
    setTestQuestions([]);
    setFile(null);
    setError('');
    setLoadingMessage('');
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && mode !== 'create' && mode !== 'loading') {
        if (window.confirm('¿Volver al inicio? Se perderá el progreso actual.')) {
          resetApp();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, resetApp]);

  if (mode === 'loading') {
    return <LoadingScreen message={loadingMessage} />;
  }

  if (mode === 'study') {
    return (
      <StudyView
        flashcards={flashcards}
        onReset={resetApp}
        onShuffle={shuffleArray}
      />
    );
  }

  if (mode === 'quiz') {
    return <QuizView quizQuestions={quizQuestions} onReset={resetApp} />;
  }

  if (mode === 'test') {
    return <TestView testQuestions={testQuestions} onReset={resetApp} />;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <ApiKeyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        apiKey={apiKey}
        onSave={setApiKey}
        required={!hasApiKey}
      />

      {showSettings && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full animate-slide-up">
            <h3 className="font-display text-xl font-bold text-gray-800 mb-4">Atajos de teclado</h3>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li><kbd className="px-2 py-0.5 bg-gray-100 rounded">←</kbd> / <kbd className="px-2 py-0.5 bg-gray-100 rounded">→</kbd> Navegar</li>
              <li><kbd className="px-2 py-0.5 bg-gray-100 rounded">↑</kbd> / <kbd className="px-2 py-0.5 bg-gray-100 rounded">↓</kbd> Voltear tarjeta</li>
              <li><kbd className="px-2 py-0.5 bg-gray-100 rounded">1-4</kbd> Seleccionar opción (quiz)</li>
              <li><kbd className="px-2 py-0.5 bg-gray-100 rounded">Esc</kbd> Volver al inicio</li>
            </ul>
            <button onClick={() => setShowSettings(false)} className="btn-primary w-full">
              Cerrar
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <CreateView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          content={content}
          setContent={setContent}
          file={file}
          onFileUpload={handleFileUpload}
          error={error}
          setError={setError}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          itemCount={itemCount}
          setItemCount={setItemCount}
          onGenerate={handleGenerateContent}
          onOpenSettings={() => setShowSettings(true)}
          onOpenApiKey={() => setShowModal(true)}
          hasApiKey={hasApiKey}
          canGenerate={canGenerate}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
