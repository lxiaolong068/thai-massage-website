'use client';

import React, { useEffect, useState } from 'react';

type DashboardStats = {
  servicesCount: number;
  therapistsCount: number;
  bookingsCount: number;
  pendingBookingsCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          throw new Error('获取数据失败');
        }
        
        const data = await response.json();
        setStats(data.data);
      } catch (err: any) {
        setError(err.message || '获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">仪表盘</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 服务统计 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">服务项目</h2>
                <p className="text-2xl font-semibold">{stats.servicesCount}</p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/admin/services" className="text-blue-500 text-sm hover:underline">
                管理服务 &rarr;
              </a>
            </div>
          </div>
          
          {/* 按摩师统计 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">按摩师</h2>
                <p className="text-2xl font-semibold">{stats.therapistsCount}</p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/admin/therapists" className="text-green-500 text-sm hover:underline">
                管理按摩师 &rarr;
              </a>
            </div>
          </div>
          
          {/* 预约统计 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">预约</h2>
                <p className="text-2xl font-semibold">{stats.bookingsCount}</p>
                <p className="text-sm text-yellow-500">
                  {stats.pendingBookingsCount} 个待确认
                </p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/admin/bookings" className="text-purple-500 text-sm hover:underline">
                管理预约 &rarr;
              </a>
            </div>
          </div>
          
          {/* 留言统计 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-gray-600 text-sm">留言</h2>
                <p className="text-2xl font-semibold">{stats.messagesCount}</p>
                <p className="text-sm text-red-500">
                  {stats.unreadMessagesCount} 个未读
                </p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/admin/messages" className="text-yellow-500 text-sm hover:underline">
                管理留言 &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* 快速操作 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/services/new"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span>添加服务</span>
          </a>
          
          <a
            href="/admin/therapists/new"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-2 rounded-full bg-green-100 text-green-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span>添加按摩师</span>
          </a>
          
          <a
            href="/admin/bookings/new"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-2 rounded-full bg-purple-100 text-purple-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span>创建预约</span>
          </a>
          
          <a
            href="/admin/settings"
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
          >
            <div className="p-2 rounded-full bg-gray-100 text-gray-500 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span>网站设置</span>
          </a>
        </div>
      </div>
    </div>
  );
} 