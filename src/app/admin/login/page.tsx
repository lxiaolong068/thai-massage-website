'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// 使用包含 useSearchParams 的子组件，便于 Suspense 包装
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 在组件加载时检查用户是否已登录 - 移除自动重定向到admin路径
  useEffect(() => {
    // 防止重复初始化
    if (initialized) return;
    setInitialized(true);
    
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    // 简化逻辑，只检查本地存储中的token
    const checkLocalToken = () => {
      try {
        // 只检查本地存储中是否有token
        const adminToken = localStorage.getItem('adminToken');
        
        if (adminToken) {
          console.log('本地token存在，重定向到:', callbackUrl);
          // 使用router.push代替window.location.replace
          router.push(callbackUrl);
        } else {
          console.log('本地无token，保持登录页面');
        }
      } catch (err) {
        console.error('检查token出错:', err);
      }
    };
    
    checkLocalToken();
  }, [callbackUrl, router, initialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('登录: 开始提交表单');
      // 使用API路由进行登录
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 确保包含cookie
      });

      console.log('登录: 请求状态:', response.status, response.statusText);
      console.log('登录: 响应头:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('登录: 响应数据:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      // 将token存储在本地存储中
      if (data.data?.token) {
        console.log('登录: 将token存储到localStorage, token长度:', data.data.token.length);
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify({
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          role: data.data.role
        }));

        // 检查cookie是否已设置
        console.log('登录: 当前document.cookie:', document.cookie);
      }

      // 登录成功，使用window.location.href强制重定向
      console.log('登录成功, 重定向到:', callbackUrl);
      window.location.href = callbackUrl;
    } catch (err: any) {
      console.error('登录失败:', err);
      setError(err.message || 'Login failed, please try again later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto h-20 w-auto"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your admin credentials
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 主页面组件，使用 Suspense 包装 LoginForm
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">加载中...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
} 