'use client';

import React, { useState } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  
  const testPassword = async () => {
    try {
      const response = await fetch('/api/test/password?email=admin@admin.com&password=admin123');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: String(error) });
    }
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">调试页面</h1>
      <button 
        className="bg-blue-500 text-white p-2 rounded"
        onClick={testPassword}
      >
        测试密码验证
      </button>
      
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
} 