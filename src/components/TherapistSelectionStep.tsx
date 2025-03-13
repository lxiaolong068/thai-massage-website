'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BookingFormData } from './BookingForm';

interface Therapist {
  id: string;
  name: string;
  bio: string;
  specialties: string[];
  experience: number;
  imageUrl?: string;
  serviceIds: string[];
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

interface TherapistSelectionStepProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const TherapistSelectionStep: React.FC<TherapistSelectionStepProps> = ({
  formData,
  setFormData,
  goToNextStep,
  goToPreviousStep
}) => {
  const t = useTranslations('booking');
  
  // 治疗师列表状态
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 从API获取治疗师列表
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 获取当前语言
        const locale = document.documentElement.lang || 'zh';
        
        console.log('从API获取治疗师数据...');
        
        // 构建API请求URL，如果有选择服务，则按服务ID过滤
        let url = `/api/public/therapists?locale=${locale}`;
        if (formData.serviceId) {
          url += `&serviceId=${formData.serviceId}`;
        }
        
        // 发送API请求获取治疗师列表
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`获取治疗师列表失败: ${response.status}`);
        }
        
        const result: ApiResponse<Therapist[]> = await response.json();
        console.log('API响应:', result);
        
        if (!result.success || !result.data) {
          throw new Error(result.error?.message || '获取治疗师列表失败');
        }
        
        console.log('治疗师数据加载完成:', result.data.length);
        setTherapists(result.data);
        setFilteredTherapists(result.data);
        
      } catch (err) {
        console.error('获取治疗师数据出错:', err);
        setError(err instanceof Error ? err.message : '加载治疗师数据失败');
        
        // 如果API请求失败，使用备用静态数据（临时解决方案）
        const locale = document.documentElement.lang || 'zh';
        const staticTherapists = [
          {
            id: '1',
            name: locale === 'zh' ? '李娜' : locale === 'ko' ? '리나' : 'Li Na',
            bio: locale === 'zh' ? '李娜拥有10年泰式按摩经验，专注于传统技术。' : 
                 locale === 'ko' ? '리나는 10년의 태국 마사지 경험을 가지고 있으며 전통 기술에 중점을 둡니다.' : 
                 'Li Na has 10 years of Thai massage experience, focusing on traditional techniques.',
            specialties: locale === 'zh' ? ['传统泰式按摩', '足部按摩'] : 
                         locale === 'ko' ? ['전통 태국 마사지', '발 마사지'] : 
                         ['Traditional Thai Massage', 'Foot Massage'],
            experience: 10,
            imageUrl: '/images/therapist1.jpg',
            serviceIds: ['1', '4']
          },
          {
            id: '2',
            name: locale === 'zh' ? '王明' : locale === 'ko' ? '왕밍' : 'Wang Ming',
            bio: locale === 'zh' ? '王明专注于精油按摩和芳香疗法，带给您深度放松体验。' : 
                 locale === 'ko' ? '왕밍은 오일 마사지와 아로마테라피에 중점을 두어 깊은 휴식 경험을 제공합니다.' : 
                 'Wang Ming specializes in oil massage and aromatherapy, providing a deeply relaxing experience.',
            specialties: locale === 'zh' ? ['精油按摩', '芳香疗法按摩'] : 
                         locale === 'ko' ? ['오일 마사지', '아로마테라피 마사지'] : 
                         ['Oil Massage', 'Aromatherapy Massage'],
            experience: 8,
            imageUrl: '/images/therapist2.jpg',
            serviceIds: ['2', '3']
          },
          {
            id: '3',
            name: locale === 'zh' ? '张伟' : locale === 'ko' ? '장웨이' : 'Zhang Wei',
            bio: locale === 'zh' ? '张伟擅长结合多种按摩技术，为您定制最适合的疗程。' : 
                 locale === 'ko' ? '장웨이는 다양한 마사지 기술을 결합하여 가장 적합한 치료 과정을 맞춤 설계합니다.' : 
                 'Zhang Wei excels at combining various massage techniques to customize the most suitable treatment for you.',
            specialties: locale === 'zh' ? ['传统泰式按摩', '精油按摩', '芳香疗法按摩'] : 
                         locale === 'ko' ? ['전통 태국 마사지', '오일 마사지', '아로마테라피 마사지'] : 
                         ['Traditional Thai Massage', 'Oil Massage', 'Aromatherapy Massage'],
            experience: 12,
            imageUrl: '/images/therapist3.jpg',
            serviceIds: ['1', '2', '3']
          },
          {
            id: '4',
            name: locale === 'zh' ? '陈静' : locale === 'ko' ? '천징' : 'Chen Jing',
            bio: locale === 'zh' ? '陈静是足部按摩专家，精通反射区疗法，帮助改善整体健康。' : 
                 locale === 'ko' ? '천징은 발 마사지 전문가로 반사구 요법에 능숙하여 전반적인 건강 개선을 돕습니다.' : 
                 'Chen Jing is a foot massage expert, proficient in reflexology to help improve overall health.',
            specialties: locale === 'zh' ? ['足部按摩', '反射区疗法'] : 
                         locale === 'ko' ? ['발 마사지', '반사구 요법'] : 
                         ['Foot Massage', 'Reflexology'],
            experience: 7,
            imageUrl: '/images/therapist4.jpg',
            serviceIds: ['4']
          }
        ];
        
        console.log('使用备用静态治疗师数据');
        
        // 如果有选择服务，则按服务ID过滤
        let filteredStaticTherapists = staticTherapists;
        if (formData.serviceId) {
          filteredStaticTherapists = staticTherapists.filter(
            therapist => therapist.serviceIds.includes(formData.serviceId || '')
          );
        }
        
        setTherapists(staticTherapists);
        setFilteredTherapists(filteredStaticTherapists);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTherapists();
  }, [formData.serviceId]);
  
  // 选择治疗师
  const handleSelectTherapist = (therapist: Therapist) => {
    setFormData({
      ...formData,
      therapistId: therapist.id,
      therapistName: therapist.name
    });
  };
  
  // 继续下一步
  const handleContinue = () => {
    if (formData.therapistId) {
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
  if (error && filteredTherapists.length === 0) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-red-700 font-medium mb-2">加载治疗师数据出错</h3>
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
  
  // 渲染空状态
  if (filteredTherapists.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-md text-center">
        <h3 className="font-bold mb-2">{t('therapistSelection.noTherapistsAvailable')}</h3>
        <p className="text-gray-600 mb-4">{t('therapistSelection.tryDifferentService')}</p>
        <button 
          onClick={goToPreviousStep} 
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          {t('back')}
        </button>
      </div>
    );
  }
  
  // 渲染治疗师列表
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('therapistSelection.title')}</h2>
      <p className="text-gray-600 mb-6">{t('therapistSelection.subtitle')}</p>
      
      {error && (
        <div className="bg-yellow-50 p-3 rounded-md mb-4">
          <p className="text-yellow-700 text-sm">{error}</p>
          <p className="text-yellow-700 text-sm">显示备用数据</p>
        </div>
      )}
      
      <div className="flex flex-col gap-4 mb-8">
        {filteredTherapists.map((therapist) => (
          <div 
            key={therapist.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
              ${formData.therapistId === therapist.id ? 'border-primary ring-2 ring-primary ring-opacity-50 bg-primary bg-opacity-5' : 'border-gray-200'}`}
            onClick={() => handleSelectTherapist(therapist)}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {therapist.imageUrl && (
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                  <img 
                    src={therapist.imageUrl} 
                    alt={therapist.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{therapist.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{therapist.bio}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {therapist.specialties.map((specialty, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {t('therapistSelection.yearsExperience', { years: therapist.experience })}
                  </span>
                </div>
              </div>
              
              {formData.therapistId === therapist.id && (
                <div className="flex items-center">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-sm rounded-full">
                    {t('therapistSelection.selectButton')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {t('back')}
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!formData.therapistId}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  );
};

export default TherapistSelectionStep;
