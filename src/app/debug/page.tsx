'use client';

import { useState, useEffect } from 'react';

// 定义返回数据类型
type DataResult = {
  success: true;
  counts: {
    services: number;
    therapists: number;
    users: number;
    bookings: number;
    messages: number;
    shopSettings: number;
  };
  examples: {
    services: any[];
    therapists: any[];
  };
} | {
  success: false;
  error: string;
};

export default function DebugPage() {
  const [data, setData] = useState<DataResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/debug');
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData({
          success: false,
          error: String(error),
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">数据库调试信息</h1>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3">加载中...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">数据库调试信息</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">错误</h2>
          <p>无法加载数据</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">数据库调试信息</h1>
      
      {data.success ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">数据统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">服务</div>
                <div className="text-2xl font-bold">{data.counts.services}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">按摩师</div>
                <div className="text-2xl font-bold">{data.counts.therapists}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">用户</div>
                <div className="text-2xl font-bold">{data.counts.users}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">预约</div>
                <div className="text-2xl font-bold">{data.counts.bookings}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">留言</div>
                <div className="text-2xl font-bold">{data.counts.messages}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">店铺设置</div>
                <div className="text-2xl font-bold">{data.counts.shopSettings}</div>
              </div>
            </div>
          </div>
          
          {data.examples.services.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">服务示例</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(data.examples.services, null, 2)}
              </pre>
            </div>
          )}
          
          {data.examples.therapists.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">按摩师示例</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(data.examples.therapists, null, 2)}
              </pre>
            </div>
          )}
        </>
      ) : (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">错误</h2>
          <pre className="whitespace-pre-wrap">{data.error}</pre>
        </div>
      )}
    </div>
  );
} 