'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const logout = async () => {
      try {
        // 调用登出 API
        const response = await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include', // 确保包含 cookie
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error?.message || '登出失败');
        }

        // 清除本地存储
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        
        // 重定向到登录页面
        router.replace('/admin/login');
      } catch (err) {
        console.error('登出错误:', err);
        setError(err instanceof Error ? err.message : '登出失败，请重试');
        
        // 即使出错也尝试重定向到登录页面
        setTimeout(() => {
          router.replace('/admin/login');
        }, 2000);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-semibold mb-2 text-red-500">登出遇到问题</h1>
            <p className="text-red-500">{error}</p>
            <p className="mt-2">正在跳转到登录页面...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-2">正在登出...</h1>
            <p>正在清除登录信息并跳转到登录页面</p>
          </>
        )}
      </div>
    </div>
  );
}
