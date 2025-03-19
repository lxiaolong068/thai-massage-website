import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '管理后台 | 泰式按摩',
  description: '泰式按摩服务管理后台',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ThemeProvider>
          <AdminLayoutClient>{children}</AdminLayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}