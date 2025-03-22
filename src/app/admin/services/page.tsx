'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

type Service = {
  id: string;
  price: number;
  duration: number;
  imageUrl: string;
  name: string;
  description: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState('zh'); // 默认显示中文
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  // 获取服务列表
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/services?locale=${locale}`);
      
      if (!response.ok) {
        throw new Error(`获取服务列表失败: ${response.status}`);
      }
      
      const data = await response.json();
      setServices(data.data || []);
    } catch (err: any) {
      setError(err.message || '获取服务列表失败');
    } finally {
      setLoading(false);
      setSelectedServices([]);
    }
  };

  // 当locale变化时，重新获取数据
  useEffect(() => {
    fetchServices();
  }, [locale]);

  // 删除单个服务
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此服务吗？此操作无法撤销。')) return;
    
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`删除服务失败: ${response.status}`);
      }
      
      toast.success('服务已成功删除');
      // 重新获取列表
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || '删除服务失败');
    }
  };

  // 批量删除服务
  const handleBatchDelete = async () => {
    if (selectedServices.length === 0) {
      toast.error('请至少选择一个服务');
      return;
    }

    if (!confirm(`确定要删除选中的 ${selectedServices.length} 个服务吗？此操作无法撤销。`)) return;
    
    try {
      setIsBatchDeleting(true);
      const response = await fetch(`/api/services`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          serviceIds: selectedServices
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `批量删除失败: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success(data.message || `成功删除 ${selectedServices.length} 个服务`);
      
      // 重新获取列表
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || '批量删除服务失败');
    } finally {
      setIsBatchDeleting(false);
    }
  };

  // 处理选择/取消选择所有服务
  const handleSelectAll = () => {
    if (selectedServices.length === filteredServices.length) {
      // 如果所有服务都已选中，则取消全选
      setSelectedServices([]);
    } else {
      // 否则全选
      setSelectedServices(filteredServices.map(service => service.id));
    }
  };

  // 处理选择/取消选择单个服务
  const handleSelectService = (id: string) => {
    if (selectedServices.includes(id)) {
      // 如果已选中，则取消选择
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
    } else {
      // 否则添加到选中列表
      setSelectedServices([...selectedServices, id]);
    }
  };

  // 处理语言切换
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
  };

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 根据搜索关键词过滤服务列表
  const filteredServices = services.filter(service => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.price.toString().includes(query) ||
      service.duration.toString().includes(query)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">服务管理</h1>
        <div className="flex items-center space-x-4">
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => handleLocaleChange('zh')}
              className={`px-3 py-1.5 text-sm transition-colors ${locale === 'zh' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              中文
            </button>
            <button
              onClick={() => handleLocaleChange('en')}
              className={`px-3 py-1.5 text-sm transition-colors ${locale === 'en' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              英文
            </button>
            <button
              onClick={() => handleLocaleChange('ko')}
              className={`px-3 py-1.5 text-sm transition-colors ${locale === 'ko' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              韩文
            </button>
          </div>
          <Link
            href="/admin/services/new"
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            添加服务
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 mb-6 rounded-md">
          <div className="text-red-500">{error}</div>
        </div>
      )}
      
      {!loading && services.length > 0 && (
        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            {selectedServices.length > 0 && (
              <button
                onClick={handleBatchDelete}
                disabled={isBatchDeleting}
                className="flex items-center bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBatchDeleting ? '处理中...' : `删除所选 (${selectedServices.length})`}
              </button>
            )}
            <button
              onClick={fetchServices}
              disabled={loading}
              className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
            >
              刷新
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="搜索服务名称、描述、价格..."
              className="border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary w-64"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">加载中...</div>
        </div>
      ) : (
        services.length === 0 ? (
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
                  <th className="w-12 px-4 py-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.length > 0 && selectedServices.length === filteredServices.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                    </div>
                  </th>
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
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                      没有找到匹配的服务
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="w-12 px-4 py-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleSelectService(service.id)}
                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                        </div>
                      </td>
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
                        <div className="text-sm text-gray-900">{service.price.toLocaleString()} 泰铢</div>
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
                  ))
                )}
              </tbody>
            </table>
            {filteredServices.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
                显示 {filteredServices.length} 个服务 {searchQuery ? `(已过滤，共 ${services.length} 个)` : ''}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}