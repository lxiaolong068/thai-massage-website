'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  translations: {
    id: string;
    language: string;
    name: string;
    description: string;
  }[];
};

export default function TestServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取服务列表数据
  const fetchServices = async () => {
    setLoading(true);
    try {
      // 使用模拟数据进行测试
      const mockServices: Service[] = [
        {
          id: '1',
          name: '泰式传统按摩',
          price: 599,
          duration: 60,
          createdAt: '2025-03-13T00:00:00Z',
          updatedAt: '2025-03-13T00:00:00Z',
          translations: [
            {
              id: '101',
              language: 'zh',
              name: '泰式传统按摩',
              description: '这是泰式传统按摩的描述'
            },
            {
              id: '102',
              language: 'en',
              name: 'Traditional Thai Massage',
              description: 'This is a description for traditional Thai massage'
            }
          ]
        },
        {
          id: '2',
          name: '精油按摩',
          price: 699,
          duration: 90,
          createdAt: '2025-03-12T00:00:00Z',
          updatedAt: '2025-03-12T00:00:00Z',
          translations: [
            {
              id: '201',
              language: 'zh',
              name: '精油按摩',
              description: '这是精油按摩的描述'
            },
            {
              id: '202',
              language: 'en',
              name: 'Oil Massage',
              description: 'This is a description for oil massage'
            }
          ]
        },
        {
          id: '3',
          name: '足部按摩',
          price: 399,
          duration: 45,
          createdAt: '2025-03-11T00:00:00Z',
          updatedAt: '2025-03-11T00:00:00Z',
          translations: [
            {
              id: '301',
              language: 'zh',
              name: '足部按摩',
              description: '这是足部按摩的描述'
            },
            {
              id: '302',
              language: 'en',
              name: 'Foot Massage',
              description: 'This is a description for foot massage'
            }
          ]
        }
      ];
      
      setServices(mockServices);
      toast.success('服务列表加载成功');
    } catch (err: any) {
      setError(err.message || '获取服务列表失败');
      toast.error('获取服务列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除服务
  const deleteService = async (id: string) => {
    try {
      // 模拟删除操作
      setServices(services.filter(service => service.id !== id));
      toast.success(`服务 ID:${id} 已成功删除`);
    } catch (err: any) {
      toast.error('删除服务失败');
    }
  };

  // 批量删除服务
  const batchDeleteServices = async () => {
    if (selectedServices.length === 0) {
      toast.error('请先选择要删除的服务');
      return;
    }

    try {
      // 模拟批量删除操作
      setServices(services.filter(service => !selectedServices.includes(service.id)));
      setSelectedServices([]);
      toast.success(`已成功删除 ${selectedServices.length} 个服务`);
    } catch (err: any) {
      toast.error('批量删除服务失败');
    }
  };

  // 选择/取消选择服务
  const toggleServiceSelection = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(serviceId => serviceId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map(service => service.id));
    }
  };

  // 搜索过滤
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.translations.some(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // 格式化价格
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(price);
  };

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 初始加载数据
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <h1 className="text-3xl font-bold mb-6">服务管理（测试页面）</h1>
      
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={fetchServices}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            刷新数据
          </button>
          
          {selectedServices.length > 0 && (
            <button
              onClick={batchDeleteServices}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              批量删除 ({selectedServices.length})
            </button>
          )}
        </div>
        
        <div className="flex-1 max-w-md ml-auto">
          <input
            type="text"
            placeholder="搜索服务..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">加载中...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchServices}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.length === filteredServices.length && filteredServices.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    名称
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    价格
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时长 (分钟)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      没有找到符合条件的服务
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => toggleServiceSelection(service.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">
                          {service.translations.map(t => (
                            <span key={t.id} className="inline-block mr-2">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {t.language}: {t.name}
                              </span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPrice(service.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(service.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => {
                            toast.success(`准备编辑服务: ${service.name}`);
                          }}
                        >
                          编辑
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => deleteService(service.id)}
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
