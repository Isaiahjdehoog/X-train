import { useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';

export function useDarkMode() {
  const { darkMode, setDarkMode } = useAppData();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
}
