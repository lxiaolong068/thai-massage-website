'use client';

import React, { useEffect } from 'react';

/**
 * 客户端工具组件，处理全局请求拦截和token管理
 */
export default function ClientUtils() {
  // 在客户端执行请求拦截器设置
  useEffect(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;

    // 设置请求拦截（可选，用于非fetch的XHR请求）
    const originalOpen = XMLHttpRequest.prototype.open;
    
    // @ts-ignore - 忽略整个函数的类型检查
    XMLHttpRequest.prototype.open = function() {
      // 获取参数
      const method = arguments[0];
      const url = arguments[1];
      
      // 调用原始方法
      originalOpen.apply(this, arguments);
      
      // 如果是admin相关请求，添加Authorization头
      const urlStr = String(url || '');
      if (urlStr.includes('/admin') || urlStr.includes('/api/admin')) {
        const token = localStorage.getItem('admin_token');
        if (token) {
          this.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      }
    };

    console.log('已安装全局请求拦截器');
    
    // 清理函数
    return () => {
      XMLHttpRequest.prototype.open = originalOpen;
    };
  }, []);

  // 这是一个工具组件，不需要渲染任何UI
  return null;
} 