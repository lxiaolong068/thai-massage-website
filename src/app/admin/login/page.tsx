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

  // 在组件加载时检查用户是否已登录
  useEffect(() => {
    // 防止重复初始化
    if (initialized) return;
    setInitialized(true);
    
    // 只在客户端运行
    if (typeof window === 'undefined') return;
    
    // 检查本地存储中的token
    const checkLocalToken = async () => {
      try {
        const adminToken = localStorage.getItem('admin_token');
        const adminUser = localStorage.getItem('adminUser');
        
        if (adminToken && adminUser) {
          console.log('检测到本地登录状态，正在验证...');
          
          // 验证token有效性
          const response = await fetch('/api/admin/check-session', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${adminToken}`
            },
            credentials: 'include',
            cache: 'no-store',
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log('会话验证成功，准备重定向');
            
            // 确保完全解码callbackUrl - 修改这里，处理任何格式的URL
            let decodedCallbackUrl = callbackUrl;
            try {
              // 尝试解码，可能需要多次解码
              while (decodedCallbackUrl.includes('%')) {
                const newDecoded = decodeURIComponent(decodedCallbackUrl);
                if (newDecoded === decodedCallbackUrl) break; // 如果解码没有变化，说明已经完全解码
                decodedCallbackUrl = newDecoded;
              }
            } catch (e) {
              console.error('解码URL出错:', e);
              // 解码失败则使用默认值
              decodedCallbackUrl = '/admin/dashboard';
            }
            
            router.push(decodedCallbackUrl);
          } else {
            console.log('会话验证失败，清除无效凭证');
            
            localStorage.removeItem('admin_token');
            localStorage.removeItem('adminUser');
          }
        } else {
          console.log('未检测到本地登录状态，保持登录页面');
        }
      } catch (err) {
        console.error('检查登录状态出错:', err);
        
        // 发生错误时清理存储
        localStorage.removeItem('admin_token');
        localStorage.removeItem('adminUser');
      }
    };
    
    checkLocalToken();
  }, [callbackUrl, router, initialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        cache: 'no-store',
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      // 将用户信息存储在本地
      // 注意：token可能为null，如果使用的是备用认证方式
      const userData = {
        id: data.data.id,
        email: data.data.email,
        name: data.data.name,
        role: data.data.role
      };
      
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      // 如果返回了JWT token，也存储它
      if (data.data?.token) {
        localStorage.setItem('admin_token', data.data.token);
      } else {
        // 清除可能存在的旧token
        localStorage.removeItem('admin_token');
      }
      
      console.log('登录成功，准备重定向到:', callbackUrl);
      
      // 确保完全解码callbackUrl - 修改这里，处理任何格式的URL
      let decodedCallbackUrl = callbackUrl;
      try {
        // 尝试解码，可能需要多次解码
        while (decodedCallbackUrl.includes('%')) {
          const newDecoded = decodeURIComponent(decodedCallbackUrl);
          if (newDecoded === decodedCallbackUrl) break; // 如果解码没有变化，说明已经完全解码
          decodedCallbackUrl = newDecoded;
        }
      } catch (e) {
        console.error('解码URL出错:', e);
        // 解码失败则使用默认值
        decodedCallbackUrl = '/admin/dashboard';
      }
      
      // 执行二次验证确认认证有效
      try {
        const verifyResponse = await fetch('/api/admin/check-session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        
        await verifyResponse.json();
      } catch (verifyErr) {
        console.error('二次验证出错:', verifyErr);
      }
      
      // 使用延时确保localStorage已更新
      setTimeout(() => {
        // 使用window.location直接重定向，确保完全刷新页面
        window.location.href = decodedCallbackUrl;
      }, 1000);
    } catch (err: any) {
      console.error('登录失败:', err);
      setError(err.message || 'Login failed, please try again later');
      
      // 清理可能的部分存储
      localStorage.removeItem('admin_token');
      localStorage.removeItem('adminUser');
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