import { useState } from 'react';
import { Key, X, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSave, required = false }) {
  const [value, setValue] = useState(apiKey || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!value.trim()) {
      setError('Introduce una clave API válida.');
      return;
    }
    onSave(value.trim());
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md glass-card rounded-3xl p-8 animate-slide-up"
        role="dialog"
        aria-labelledby="api-modal-title"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-100 text-brand-600">
              <Key size={24} />
            </div>
            <div>
              <h2 id="api-modal-title" className="text-xl font-bold text-gray-900">
                Clave API DeepSeek
              </h2>
              <p className="text-sm text-gray-500">Se guarda solo en tu navegador</p>
            </div>
          </div>
          {!required && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Obtén tu clave en{' '}
          <a
            href="https://platform.deepseek.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-brand-600 font-medium hover:underline"
          >
            platform.deepseek.com
            <ExternalLink size={14} />
          </a>
          . También puedes usar la variable{' '}
          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">VITE_DEEPSEEK_API_KEY</code>.
        </p>

        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError('');
          }}
          placeholder="sk-..."
          className="input-field mb-2 font-mono text-sm"
          autoComplete="off"
        />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button onClick={handleSave} className="btn-primary w-full">
          Guardar clave
        </button>
      </div>
    </div>
  );
}
