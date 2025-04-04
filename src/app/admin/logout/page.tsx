'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // 清除本地存储
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // 调用登出API清除服务器cookie
        await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include',
        });
        
        // 重定向到登录页面
        router.replace('/admin/login');
      } catch (error) {
        console.error('Logout failed:', error);
        // 即使失败也重定向到登录页面
        router.replace('/admin/login');
      }
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <p>You are being logged out and redirected to the login page.</p>
      </div>
    </div>
  );
}
