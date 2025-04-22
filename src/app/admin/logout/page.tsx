'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // 清除所有本地存储相关认证信息
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('adminUser');
        
        // 调用登出API清除服务器cookie
        await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include',
          cache: 'no-store',
        });
        
        console.log('Successfully logged out');
        
        // 强制使用窗口重定向确保完全刷新
        window.location.href = '/admin/login';
      } catch (error) {
        console.error('Logout failed:', error);
        // 即使失败也重定向到登录页面
        window.location.href = '/admin/login';
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin w-12 h-12 border-4 border-t-gold border-gold/20 rounded-full mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p>You are being logged out and redirected to the login page.</p>
      </div>
    </div>
  );
}
