'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme types
export type ThemeType = 'gold' | 'blue' | 'green' | 'purple' | 'red';

// Theme configuration
export const themeColors = {
  gold: {
    primary: '#D4AF37',
    secondary: '#FFF8E1',
    accent: '#8B4513',
    name: 'Gold Theme'
  },
  blue: {
    primary: '#1E40AF',
    secondary: '#DBEAFE',
    accent: '#1E3A8A',
    name: 'Blue Theme'
  },
  green: {
    primary: '#047857',
    secondary: '#ECFDF5',
    accent: '#065F46',
    name: 'Green Theme'
  },
  purple: {
    primary: '#7E22CE',
    secondary: '#F3E8FF',
    accent: '#6B21A8',
    name: 'Purple Theme'
  },
  red: {
    primary: '#B91C1C',
    secondary: '#FEE2E2',
    accent: '#991B1B',
    name: 'Red Theme'
  }
};

// Create theme context
type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeColor: typeof themeColors.gold;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to gold theme
  const [theme, setTheme] = useState<ThemeType>('gold');
  
  // Get current theme color configuration
  const themeColor = themeColors[theme];
  
  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') as ThemeType;
    if (savedTheme && Object.keys(themeColors).includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);
  
  // Save theme to localStorage
  const handleSetTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, themeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook for using theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
