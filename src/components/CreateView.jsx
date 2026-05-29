import {
  Upload,
  FileText,
  Type,
  Lightbulb,
  AlertCircle,
  Settings,
  Sparkles,
  Layers,
  Target,
  ClipboardList,
  Key,
} from 'lucide-react';
import { DIFFICULTY_OPTIONS, COUNT_OPTIONS } from '../constants/settings';

const MODES = [
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: Layers,
    gradient: 'from-indigo-500 to-violet-600',
    emoji: '🃏',
  },
  {
    id: 'quiz',
    label: 'Opción múltiple',
    icon: Target,
    gradient: 'from-emerald-500 to-teal-600',
    emoji: '🎯',
  },
  {
    id: 'test',
    label: 'Prueba mixta',
    icon: ClipboardList,
    gradient: 'from-sky-500 to-cyan-600',
    emoji: '📝',
  },
];

const TABS = [
  { id: 'describe', label: 'Describir', icon: Lightbulb },
  { id: 'paste', label: 'Pegar', icon: Type },
  { id: 'file', label: 'Archivo', icon: Upload },
];

export default function CreateView({
  activeTab,
  setActiveTab,
  content,
  setContent,
  file,
  onFileUpload,
  error,
  setError,
  difficulty,
  setDifficulty,
  itemCount,
  setItemCount,
  onGenerate,
  onOpenSettings,
  onOpenApiKey,
  hasApiKey,
  canGenerate,
}) {
  return (
    <div className="w-full max-w-3xl mx-auto animate-stagger">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-white/80 mb-4">
          <Sparkles size={16} className="text-accent-400" />
          Potenciado por DeepSeek IA
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-gradient mb-3">
          SmartFlip
        </h1>
        <p className="text-lg text-white/70 max-w-lg mx-auto">
          Convierte cualquier tema o documento en material de estudio interactivo en segundos
        </p>
      </header>

      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={onOpenApiKey} className="btn-secondary text-sm flex items-center gap-2">
          <Key size={16} />
          {hasApiKey ? 'API configurada' : 'Configurar API'}
        </button>
        <button onClick={onOpenSettings} className="btn-secondary text-sm flex items-center gap-2">
          <Settings size={16} />
          Ajustes
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <div className="glass p-1 rounded-2xl inline-flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setContent('');
                setError('');
              }}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                activeTab === id
                  ? 'bg-white text-gray-800 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-6">
        {activeTab === 'describe' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Lightbulb className="text-amber-500" size={22} />
              Describe el tema
            </h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ej: Sistema nervioso central, Revolución Francesa, derivadas en cálculo..."
              className="input-field h-44 resize-none"
            />
          </div>
        )}

        {activeTab === 'paste' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Type className="text-brand-500" size={22} />
              Pega tu texto
            </h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pega apuntes, artículos o cualquier texto del que quieras generar material..."
              className="input-field h-44 resize-none"
            />
          </div>
        )}

        {activeTab === 'file' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Upload className="text-emerald-500" size={22} />
              Sube un archivo
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-brand-400 transition-colors">
              <input
                type="file"
                id="fileInput"
                onChange={onFileUpload}
                accept=".pdf,.txt,.docx"
                className="hidden"
              />
              <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center">
                  <FileText size={28} className="text-brand-500" />
                </div>
                <p className="font-semibold text-gray-700">{file ? file.name : 'Seleccionar archivo'}</p>
                <p className="text-sm text-gray-500">PDF, TXT o DOCX · máx. 10 MB</p>
              </label>
            </div>
            {file?.type === 'application/pdf' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2 text-sm text-blue-700">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>Los PDF escaneados pueden no extraer texto. Usa PDFs con texto seleccionable.</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-2 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <span className="text-white/60 text-sm self-center mr-1">Dificultad:</span>
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDifficulty(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                difficulty === opt.id
                  ? 'bg-white text-gray-800'
                  : 'text-white/70 hover:bg-white/10'
              }`}
              title={opt.description}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Cantidad:</span>
          {COUNT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setItemCount(opt.id)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                itemCount === opt.id
                  ? 'bg-accent-500 text-gray-900'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {MODES.map(({ id, label, gradient, emoji }) => (
          <button
            key={id}
            onClick={() => onGenerate(id)}
            disabled={!canGenerate}
            className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200
              bg-gradient-to-br ${gradient} text-white shadow-lg
              hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg`}
          >
            <span className="text-2xl mb-2 block">{emoji}</span>
            <span className="font-display font-bold text-lg block">{label}</span>
            <span className="text-white/80 text-sm">Generar con IA</span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
