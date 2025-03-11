import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';

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
        <div className="flex h-screen bg-gray-100">
          {/* 侧边栏 */}
          <div className="w-64 bg-white shadow-md">
            <div className="p-6 bg-primary text-white">
              <h1 className="text-xl font-semibold">泰式按摩管理后台</h1>
            </div>
            <nav className="mt-6">
              <ul>
                <li>
                  <a
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    仪表盘
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/services"
                    className="block px-4 py-2 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    服务管理
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/therapists"
                    className="block px-4 py-2 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    按摩师管理
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/bookings"
                    className="block px-4 py-2 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    预约管理
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/settings"
                    className="block px-4 py-2 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    网站设置
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/messages"
                    className="block px-4 py-2 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                  >
                    留言管理
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
      </body>
    </html>
  );
} 