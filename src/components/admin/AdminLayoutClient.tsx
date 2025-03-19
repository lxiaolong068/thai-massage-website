'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme, themeColors } from '@/contexts/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const { theme, themeColor } = useTheme();
  
  // 如果是登录页面，直接显示内容，不显示管理界面布局
  if (isLoginPage) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex h-screen" style={{ backgroundColor: themeColors[theme].secondary }}>
      {/* 侧边栏 */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 text-white" style={{ backgroundColor: themeColors[theme].primary }}>
          <h1 className="text-xl font-semibold">管理后台</h1>
        </div>
        <nav className="mt-2">
          <ul className="space-y-1">
            <li>
              <a
                href="/admin/dashboard"
                className={`flex items-center px-4 py-3 text-gray-700 hover:text-white transition-colors hover:bg-opacity-90 ${pathname === '/admin/dashboard' ? 'text-white' : ''}`}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeColors[theme].primary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = pathname === '/admin/dashboard' ? themeColors[theme].primary : 'transparent'}
                style={{
                  backgroundColor: pathname === '/admin/dashboard' ? themeColors[theme].primary : 'transparent'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                仪表盘
              </a>
            </li>
            <li>
              <a
                href="/admin/services"
                className={`flex items-center px-4 py-3 text-gray-700 hover:text-white transition-colors hover:bg-opacity-90 ${pathname.startsWith('/admin/services') ? 'text-white' : ''}`}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeColors[theme].primary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = pathname.startsWith('/admin/services') ? themeColors[theme].primary : 'transparent'}
                style={{
                  backgroundColor: pathname.startsWith('/admin/services') ? themeColors[theme].primary : 'transparent'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                服务管理
              </a>
            </li>
            <li>
              <a
                href="/admin/therapists"
                className={`flex items-center px-4 py-3 text-gray-700 hover:text-white transition-colors hover:bg-opacity-90 ${pathname.startsWith('/admin/therapists') ? 'text-white' : ''}`}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeColors[theme].primary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = pathname.startsWith('/admin/therapists') ? themeColors[theme].primary : 'transparent'}
                style={{
                  backgroundColor: pathname.startsWith('/admin/therapists') ? themeColors[theme].primary : 'transparent'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                按摩师管理
              </a>
            </li>
            <li>
              <a
                href="/admin/bookings"
                className={`flex items-center px-4 py-3 text-gray-700 hover:text-white transition-colors hover:bg-opacity-90 ${pathname.startsWith('/admin/bookings') ? 'text-white' : ''}`}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeColors[theme].primary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = pathname.startsWith('/admin/bookings') ? themeColors[theme].primary : 'transparent'}
                style={{
                  backgroundColor: pathname.startsWith('/admin/bookings') ? themeColors[theme].primary : 'transparent'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                预约管理
              </a>
            </li>
            <li>
              <a
                href="/admin/settings"
                className={`flex items-center px-4 py-3 text-gray-700 hover:text-white transition-colors hover:bg-opacity-90 ${pathname.startsWith('/admin/settings') ? 'text-white' : ''}`}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeColors[theme].primary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = pathname.startsWith('/admin/settings') ? themeColors[theme].primary : 'transparent'}
                style={{
                  backgroundColor: pathname.startsWith('/admin/settings') ? themeColors[theme].primary : 'transparent'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                网站设置
              </a>
            </li>
            <li>
              <a
                href="/admin/messages"
                className={`flex items-center px-4 py-3 text-gray-700 hover:text-white transition-colors hover:bg-opacity-90 ${pathname.startsWith('/admin/messages') ? 'text-white' : ''}`}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeColors[theme].primary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = pathname.startsWith('/admin/messages') ? themeColors[theme].primary : 'transparent'}
                style={{
                  backgroundColor: pathname.startsWith('/admin/messages') ? themeColors[theme].primary : 'transparent'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                留言管理
              </a>
            </li>
            <li className="mt-auto">
              <a
                href="/admin/logout"
                className="flex items-center px-4 py-3 text-gray-700 hover:text-white transition-colors hover:bg-opacity-90"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = themeColors[theme].primary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V8z" clipRule="evenodd" />
                </svg>
                登出
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 overflow-auto">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-3">
            <h2 className="text-xl font-semibold text-gray-800">管理后台</h2>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <span className="text-gray-600">管理员</span>
              <a
                href="/admin/logout"
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                退出
              </a>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
