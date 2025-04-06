'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { FaUsers, FaCalendarCheck, FaServicestack, FaEnvelope } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type DashboardStats = {
  services: number;
  therapists: number;
  bookings: number;
  pendingBookings: number;
  messages: number;
  unreadMessages: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Dashboard: 开始获取统计数据');
      
      let token: string | null = null;
      try {
        token = localStorage.getItem('admin_token');
        console.log('Dashboard: localStorage中的token存在:', !!token);
        if (token) {
          console.log('Dashboard: token长度:', token.length);
        }
      } catch (e) {
        console.error('Dashboard: 获取token错误:', e);
      }

      if (!token) {
        console.error('Dashboard: token不存在，重定向到登录页');
        router.push('/admin/login');
        return;
      }

      console.log('Dashboard: 调用API获取数据');
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      console.log('Dashboard: API响应状态:', response.status);
      
      if (response.status === 401) {
        console.error('Dashboard: 未授权，需要重新登录');
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      console.log('Dashboard: API响应数据:', data);

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch dashboard data');
      }

      setStats(data.data);
    } catch (err: any) {
      console.error('Dashboard: 获取数据失败:', err);
      setError(err.message || 'An error occurred while fetching dashboard data');
      toast.error('Failed to load dashboard data: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center my-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        <p className="font-medium">Error loading dashboard data</p>
        <p className="text-sm">{error}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={() => fetchStats()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {!loading && !error && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/services" className="block transition-transform hover:scale-105">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <FaServicestack className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.services}</div>
                <p className="text-xs text-muted-foreground">Total services available</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/therapists" className="block transition-transform hover:scale-105">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Therapists</CardTitle>
                <FaUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.therapists}</div>
                <p className="text-xs text-muted-foreground">Active therapists</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/bookings" className="block transition-transform hover:scale-105">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                <FaCalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bookings}</div>
                <p className="text-xs text-muted-foreground">
                  Total bookings
                  {stats.pendingBookings > 0 && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full text-xs">
                      {stats.pendingBookings} pending
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/messages" className="block transition-transform hover:scale-105">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <FaEnvelope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.messages}</div>
                <p className="text-xs text-muted-foreground">
                  Total messages
                  {stats.unreadMessages > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs">
                      {stats.unreadMessages} unread
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
} 