'use client';

import { useEffect } from 'react';

export default function TestHeaderPage() {
  useEffect(() => {
    // 检查页面上的导航元素
    const headers = document.querySelectorAll('header');
    console.log('Headers found:', headers.length);
    
    // 记录每个header的位置和样式
    headers.forEach((header, index) => {
      console.log(`Header ${index + 1}:`, {
        position: getComputedStyle(header).position,
        top: getComputedStyle(header).top,
        zIndex: getComputedStyle(header).zIndex,
        classList: Array.from(header.classList),
        children: header.children.length,
        rect: header.getBoundingClientRect()
      });
    });
  }, []);
  
  return (
    <div className="container mx-auto py-32 px-4">
      <h1 className="text-3xl font-bold mb-6">Header Test Page</h1>
      <p className="mb-4">此页面用于测试头部导航栏问题</p>
      <div className="p-4 bg-gray-100 rounded">
        <pre className="text-sm">请查看浏览器控制台以获取详细信息</pre>
      </div>
    </div>
  );
}
