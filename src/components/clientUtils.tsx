'use client';

import React, { useEffect } from 'react';
import { handleAuthFailure } from '@/lib/fetch';
import { getAdminToken } from '@/lib/client/authUtils';

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
    const originalSend = XMLHttpRequest.prototype.send;
    
    // @ts-ignore - 忽略整个函数的类型检查
    XMLHttpRequest.prototype.open = function() {
      // 获取参数
      const method = arguments[0];
      const url = arguments[1];
      
      // 调用原始方法
      // @ts-ignore - 忽略类型检查，我们知道参数是正确的
      originalOpen.apply(this, arguments);
      
      // 如果是admin相关请求，添加Authorization头
      const urlStr = String(url || '');
      if (urlStr.includes('/admin') || urlStr.includes('/api/admin')) {
        const token = getAdminToken();
        if (token) {
          this.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      }
    };
    
    // @ts-ignore - 忽略整个函数的类型检查
    XMLHttpRequest.prototype.send = function() {
      // 保存原始的onreadystatechange回调
      const originalOnReadyStateChange = this.onreadystatechange;
      
      // 设置新的onreadystatechange回调
      this.onreadystatechange = function() {
        // 处理状态变化
        if (this.readyState === 4) {
          // 请求完成
          if (this.status === 401 && !this.responseURL.includes('/api/admin/login')) {
            console.log('XHR请求收到401未授权状态，准备重新登录');
            handleAuthFailure();
            return;
          }
        }
        
        // 调用原始回调
        if (originalOnReadyStateChange) {
          // @ts-ignore - 忽略类型检查，我们知道参数是正确的
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
      
      // 调用原始send方法
      // @ts-ignore - 忽略类型检查，我们知道参数是正确的
      originalSend.apply(this, arguments);
    };

    console.log('已安装全局请求拦截器');
    
    // 添加全局错误处理
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('未处理的Promise拒绝:', event.reason);
      
      // 如果是认证错误，处理重定向
      if (event.reason?.message?.includes('Authentication required') || 
          event.reason?.message?.includes('Unauthorized') ||
          event.reason?.message?.includes('Invalid token')) {
        console.log('捕获到未处理的认证错误，准备重定向');
        handleAuthFailure();
      }
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // 清理函数
    return () => {
      XMLHttpRequest.prototype.open = originalOpen;
      XMLHttpRequest.prototype.send = originalSend;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // 这是一个工具组件，不需要渲染任何UI
  return null;
} 