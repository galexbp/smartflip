import { useEffect } from 'react';

export function useKeyboardNav(handlers, deps = []) {
  useEffect(() => {
    const onKey = (e) => handlers(e);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
