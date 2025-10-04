import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update body class for theme switching
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    
    // Update CSS custom properties
    const root = document.documentElement;
    if (isDarkMode) {
      // Dark theme colors
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#111827');
      root.style.setProperty('--bg-tertiary', '#1f2937');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#9ca3af');
      root.style.setProperty('--text-tertiary', '#6b7280');
      root.style.setProperty('--border-color', 'rgba(6, 182, 212, 0.2)');
      root.style.setProperty('--accent-primary', '#06b6d4');
      root.style.setProperty('--accent-secondary', '#8b5cf6');
      root.style.setProperty('--bg-secondary-rgb', '17, 24, 39');
      
      // ✨ Global background gradients
      root.style.setProperty('--global-background', 'linear-gradient(135deg, #000000 0%, #111827 50%, #000000 100%)');
      root.style.setProperty('--section-overlay', 'rgba(0, 0, 0, 0.3)');
    } else {
      // Light theme colors
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#e2e8f0');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-tertiary', '#64748b');
      root.style.setProperty('--border-color', 'rgba(6, 182, 212, 0.3)');
      root.style.setProperty('--accent-primary', '#0891b2');
      root.style.setProperty('--accent-secondary', '#7c3aed');
      root.style.setProperty('--bg-secondary-rgb', '248, 250, 252');
      
      // ✨ Global background gradients for light mode
      root.style.setProperty('--global-background', 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)');
      root.style.setProperty('--section-overlay', 'rgba(255, 255, 255, 0.3)');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
