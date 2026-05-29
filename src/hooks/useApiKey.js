import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'smartflip_api_key';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const envKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    const key = stored || envKey || '';
    setApiKeyState(key);
    if (!key) {
      setShowModal(true);
    }
  }, []);

  const setApiKey = useCallback((key) => {
    const trimmed = key?.trim() || '';
    setApiKeyState(trimmed);
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const hasApiKey = Boolean(apiKey && apiKey !== 'YOUR_DEEPSEEK_API_HERE');

  return { apiKey, setApiKey, hasApiKey, showModal, setShowModal };
}

export function getStoredApiKey() {
  return (
    localStorage.getItem(STORAGE_KEY) ||
    import.meta.env.VITE_DEEPSEEK_API_KEY ||
    ''
  );
}
