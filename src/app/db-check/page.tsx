'use client';

import { useState, useEffect } from 'react';

// 定义返回数据类型
type DataResult = {
  success: true;
  tables: any[];
  counts: Record<string, number>;
  examples: Record<string, any[]>;
} | {
  success: false;
  error: string;
};

export default function DbCheckPage() {
  const [data, setData] = useState<DataResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/db-check');
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
        <h1 className="text-2xl font-bold mb-4">数据库检查</h1>
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
        <h1 className="text-2xl font-bold mb-4">数据库检查</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">错误</h2>
          <p>无法加载数据</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">数据库检查</h1>
      
      {data.success ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">数据库表</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.tables.map((table: any) => (
                <div key={table.table_name} className="bg-white p-4 rounded shadow">
                  <div className="text-lg font-medium">{table.table_name}</div>
                  <div className="text-2xl font-bold">{data.counts[table.table_name] || 0}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">表数据示例</h2>
            {Object.entries(data.examples).map(([tableName, examples]) => (
              <div key={tableName} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{tableName}</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(examples, null, 2)}
                </pre>
              </div>
            ))}
          </div>
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