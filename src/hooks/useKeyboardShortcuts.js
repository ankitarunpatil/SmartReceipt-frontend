import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      Object.entries(shortcuts).forEach(([shortcut, callback]) => {
        const [modifier, ...keys] = shortcut.split('+');
        const keyString = keys.join('+');

        if (modifier === 'ctrl' && ctrl && key === keyString) {
          e.preventDefault();
          callback();
        } else if (modifier !== 'ctrl' && key === shortcut) {
          e.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
};