'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 定义主题类型
export type ThemeType = 'gold' | 'blue' | 'green' | 'purple' | 'red';

// 主题配置
export const themeColors = {
  gold: {
    primary: '#D4AF37',
    secondary: '#FFF8E1',
    accent: '#8B4513',
    name: '金色主题'
  },
  blue: {
    primary: '#1E40AF',
    secondary: '#DBEAFE',
    accent: '#1E3A8A',
    name: '蓝色主题'
  },
  green: {
    primary: '#047857',
    secondary: '#ECFDF5',
    accent: '#065F46',
    name: '绿色主题'
  },
  purple: {
    primary: '#7E22CE',
    secondary: '#F3E8FF',
    accent: '#6B21A8',
    name: '紫色主题'
  },
  red: {
    primary: '#B91C1C',
    secondary: '#FEE2E2',
    accent: '#991B1B',
    name: '红色主题'
  }
};

// 创建主题上下文
type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeColor: typeof themeColors.gold;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 默认使用金色主题
  const [theme, setTheme] = useState<ThemeType>('gold');
  
  // 获取当前主题的颜色配置
  const themeColor = themeColors[theme];
  
  // 从localStorage加载保存的主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') as ThemeType;
    if (savedTheme && Object.keys(themeColors).includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);
  
  // 保存主题到localStorage
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

// 使用主题的Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
