'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Service = {
  id: string;
  price: number;
  duration: number;
  imageUrl: string;
  name: string;
  description: string;
  slug: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState('zh'); // 默认显示中文

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/services?locale=${locale}`);
        
        if (!response.ok) {
          throw new Error('获取服务数据失败');
        }
        
        const data = await response.json();
        setServices(data.data);
      } catch (err: any) {
        setError(err.message || '获取服务数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个服务吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除服务失败');
      }

      // 从列表中移除已删除的服务
      setServices(services.filter(service => service.id !== id));
    } catch (err: any) {
      alert(err.message || '删除服务失败，请稍后再试');
    }
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">服务管理</h1>
        <div className="flex items-center space-x-4">
          <select
            value={locale}
            onChange={handleLocaleChange}
            className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="zh">中文</option>
            <option value="en">英文</option>
            <option value="th">泰文</option>
            <option value="ko">韩文</option>
          </select>
          <Link
            href="/admin/services/new"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            添加服务
          </Link>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <p className="text-yellow-700">暂无服务数据</p>
          <Link
            href="/admin/services/new"
            className="mt-4 inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            添加第一个服务
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  服务
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  价格
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时长
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <Image
                          src={service.imageUrl}
                          alt={service.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.price} 泰铢</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.duration} 分钟</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 