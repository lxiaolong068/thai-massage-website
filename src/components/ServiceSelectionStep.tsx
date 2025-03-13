'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BookingFormData } from './BookingForm';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API响应类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

interface ServiceSelectionStepProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  goToNextStep: () => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({ 
  formData, 
  setFormData, 
  goToNextStep 
}) => {
  const t = useTranslations('booking');
  
  // 服务列表状态
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 从API获取服务列表
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 获取当前语言
        const locale = document.documentElement.lang || 'zh';
        
        console.log('从API获取服务数据...');
        
        // 发送API请求获取服务列表
        const response = await fetch(`/api/public/services?locale=${locale}`);
        
        if (!response.ok) {
          throw new Error(`获取服务列表失败: ${response.status}`);
        }
        
        const result: ApiResponse<Service[]> = await response.json();
        console.log('API响应:', result);
        
        if (!result.success || !result.data) {
          throw new Error(result.error?.message || '获取服务列表失败');
        }
        
        console.log('服务数据加载完成:', result.data.length);
        setServices(result.data);
        
      } catch (err) {
        console.error('获取服务数据出错:', err);
        setError(err instanceof Error ? err.message : '加载服务数据失败');
        
        // 如果API请求失败，使用备用静态数据（临时解决方案）
        const locale = document.documentElement.lang || 'zh';
        const staticServices = [
          {
            id: '1',
            price: 1200,
            duration: 60,
            imageUrl: '/images/traditional-thai-new.jpg',
            name: locale === 'zh' ? '传统泰式按摩' : locale === 'ko' ? '전통 태국 마사지' : 'Traditional Thai Massage',
            description: locale === 'zh' ? '使用正宗技术的古老按摩方法，缓解身体紧张。' : 
                      locale === 'ko' ? '정통 기법을 사용한 고대 마사지 방법으로 신체 긴장을 풀어줍니다.' : 
                      'Ancient massage method using authentic techniques to relieve body tension.',
            slug: 'traditional-thai-massage',
          },
          {
            id: '2',
            price: 1500,
            duration: 90,
            imageUrl: '/images/oil-massage-new.jpg',
            name: locale === 'zh' ? '精油按摩' : locale === 'ko' ? '오일 마사지' : 'Oil Massage',
            description: locale === 'zh' ? '使用芳香精油的放松按摩，舒缓您的身心。' : 
                      locale === 'ko' ? '향기로운 오일을 사용하는 편안한 마사지로 신체와 마음을 위로합니다.' : 
                      'Relaxing massage using aromatic oils to soothe your body and mind.',
            slug: 'oil-massage',
          },
          {
            id: '3',
            price: 1800,
            duration: 120,
            imageUrl: '/images/aromatherapy-massage.jpg',
            name: locale === 'zh' ? '芳香疗法按摩' : locale === 'ko' ? '아로마테라피 마사지' : 'Aromatherapy Massage',
            description: locale === 'zh' ? '使用精油的治疗按摩，带来深度放松。' : 
                      locale === 'ko' ? '딥 릴랙스에 위한 에센셜 오일을 사용한 치료 마사지입니다.' : 
                      'Therapeutic massage using essential oils for deep relaxation.',
            slug: 'aromatherapy-massage',
          },
          {
            id: '4',
            price: 1000,
            duration: 45,
            imageUrl: '/images/foot-massage.jpg',
            name: locale === 'zh' ? '足部按摩' : locale === 'ko' ? '발 마사지' : 'Foot Massage',
            description: locale === 'zh' ? '反射区按摩技术，为您的双脚和身体注入活力。' : 
                      locale === 'ko' ? '발과 신체를 활기차게 하는 반사구학 기법입니다.' : 
                      'Reflexology techniques to energize your feet and body.',
            slug: 'foot-massage',
          },
        ];
        console.log('使用备用静态服务数据');
        setServices(staticServices);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // 选择服务
  const handleSelectService = (service: Service) => {
    setFormData({
      ...formData,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration
    });
  };
  
  // 继续下一步
  const handleContinue = () => {
    if (formData.serviceId) {
      goToNextStep();
    }
  };
  
  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  // 渲染错误状态
  if (error && services.length === 0) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-red-700 font-medium mb-2">加载服务数据出错</h3>
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          重试
        </button>
      </div>
    );
  }
  
  // 渲染简化的服务列表
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('serviceSelection.title')}</h2>
      <p className="text-gray-600 mb-6">{t('serviceSelection.subtitle')}</p>
      
      {error && (
        <div className="bg-yellow-50 p-3 rounded-md mb-4">
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-700 text-sm">显示备用数据</p>
        </div>
      )}
      
      <div className="flex flex-col gap-4 mb-8">
        {services.map((service) => (
          <div 
            key={service.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
              ${formData.serviceId === service.id ? 'border-primary ring-2 ring-primary ring-opacity-50 bg-primary bg-opacity-5' : 'border-gray-200'}`}
            onClick={() => handleSelectService(service)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-3 sm:mb-0">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{service.description}</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-gray-500 text-xs">{t('serviceSelection.duration')}</p>
                  <p className="font-medium">{service.duration} {t('serviceSelection.minutes')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">{t('serviceSelection.price')}</p>
                  <p className="font-medium text-primary">¥{service.price}</p>
                </div>
              </div>
            </div>
            
            {formData.serviceId === service.id && (
              <div className="mt-3 flex justify-end">
                <span className="inline-block px-3 py-1 bg-primary text-white text-sm rounded-full">
                  {t('serviceSelection.selectButton')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!formData.serviceId}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t('serviceSelection.selectButton')}
        </button>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;
