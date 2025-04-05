'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TestResetPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('发送重置请求...');
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('重置响应状态:', response.status);
      
      const text = await response.text();
      console.log('重置响应文本:', text);
      
      try {
        const data = JSON.parse(text);
        setResult(data);
      } catch (e) {
        setResult({ raw: text });
      }
    } catch (err) {
      console.error('重置请求错误:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">管理员账户重置测试页面</h1>
      
      <div className="flex space-x-4 mb-6">
        <Link href="/api/test" target="_blank" className="text-blue-500 underline">
          查看系统状态
        </Link>
        <Link href="/admin/login" className="text-blue-500 underline">
          前往登录页面
        </Link>
      </div>
      
      <button
        onClick={handleReset}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? '处理中...' : '重置管理员账户'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">错误:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-100 border rounded">
          <h3 className="font-bold mb-2">响应结果:</h3>
          <pre className="whitespace-pre-wrap overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 