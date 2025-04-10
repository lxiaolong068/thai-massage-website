'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useImprovedTranslator } from '@/i18n/improved-client';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
};

type ServicesProps = {
  locale?: string;
};

const Services = ({ locale = 'en' }: ServicesProps) => {
  const { t } = useImprovedTranslator(locale, 'services');
  const { t: commonT } = useImprovedTranslator(locale, 'common');
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`[Client] [services] 开始获取服务数据，语言: ${locale}`);
        const response = await fetch(`/api/services?locale=${locale}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.error?.message || `状态码: ${response.status}`;
          console.error(`[Client] [services] API响应错误:`, { 
            status: response.status, 
            statusText: response.statusText,
            error: errorData 
          });
          throw new Error(`获取服务失败: ${errorMessage}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
          console.error(`[Client] [services] API返回格式错误:`, result);
          throw new Error(result.error?.message || '获取服务数据失败');
        }
        
        console.log(`[Client] [services] 成功获取${result.data.length}个服务`);
        setServices(result.data);
      } catch (err) {
        console.error('[Client] [services] 获取服务数据错误:', err);
        setError(err instanceof Error ? err.message : '加载服务失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [locale]);

  if (loading) {
    return (
      <section className="section-container section-light" id="services">
        <div className="container">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-container section-light" id="services">
        <div className="container">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              {t('retry', '重试')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container section-light" id="services">
      <div className="container">
        <h2 className="section-title text-center mb-4 text-black">
          {t('title', '我们的服务')}
        </h2>
        <p className="text-gray-800 text-center mb-12">
          {t('subtitle', '我们提供多种专业泰式按摩服务，满足您的不同需求。')}
        </p>
        
        <div className="grid-responsive">
          {services.map((service) => (
            <div key={service.id} className="card card-hover">
              <div className="image-container">
                <Image
                  src={service.imageUrl || '/images/placeholder-service.jpg'}
                  alt={service.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error('Image load error for:', e.currentTarget.src);
                    e.currentTarget.src = '/images/placeholder-service.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="title-md text-black">{service.name}</h3>
                <p className="text-gray-800 mb-4">{service.description}</p>
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex-between text-gray-900">
                    <span>{service.duration} min..........</span>
                    <span className="font-semibold">{service.price} baht</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href={`/${locale}/therapists`} 
            className="primary-button inline-flex items-center"
          >
            {commonT('buttons.bookNow', '立即预约')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services; 