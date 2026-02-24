import { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings } from '../utils/storage';

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => getSettings().darkMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    document.title = darkMode ? 'Brotein Pal' : 'Protein Pal';
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      const settings = getSettings();
      saveSettings({ ...settings, darkMode: next });
      return next;
    });
  }, []);

  return { darkMode, toggleDarkMode };
}
