import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * High-fidelity, centralized ThemeProvider for the Buy Together frontend.
 * Toggles a 'data-theme' attribute on the '#root' shell wrapper to dynamically update CSS variables.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Fallback to default light theme
    return 'light';
  });

  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        rootEl.classList.add('dark');
      } else {
        rootEl.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
