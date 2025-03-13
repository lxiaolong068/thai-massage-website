'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BookingFormData } from './BookingForm';

interface Therapist {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
  specialties: string[];
  experienceYears: number;
  age?: number;
  measurements?: string;
  weight?: string;
  height?: string;
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
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
  
  // 按摩师列表状态
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 从API获取按摩师数据
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 获取当前语言
        const locale = document.documentElement.lang || 'zh';
        
        console.log('从API获取按摩师数据...');
        
        // 考虑服务ID进行筛选（可选）
        const serviceFilter = formData.serviceId ? `&serviceId=${formData.serviceId}` : '';
        
        // 发送API请求获取按摩师列表
        const response = await fetch(`/api/therapists?locale=${locale}${serviceFilter}`);
        
        if (!response.ok) {
          throw new Error(`获取按摩师列表失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('按摩师数据加载完成:', data.length);
        setTherapists(data);
        
      } catch (err) {
        console.error('获取按摩师数据出错:', err);
        setError(err instanceof Error ? err.message : '加载按摩师数据失败');
        
        // 如果API请求失败，使用备用静态数据（临时解决方案）
        const locale = document.documentElement.lang || 'zh';
        const staticTherapists = [
          {
            id: '1',
            name: locale === 'zh' ? '莉莉' : locale === 'ko' ? '릴리' : 'Lily',
            imageUrl: '/images/therapist-1.jpg',
            bio: locale === 'zh' ? '专业按摩师，拥有10年经验。擅长传统泰式按摩和精油按摩。' : 
                locale === 'ko' ? '전문 마사지사, 10년의 경험을 가지고 있습니다. 전통 태국 마사지와 오일 마사지를 전문으로 합니다.' : 
                'Professional massage therapist with 10 years of experience. Specializes in traditional Thai massage and oil massage.',
            specialties: ['traditional', 'oil'],
            experienceYears: 10
          },
          {
            id: '2',
            name: locale === 'zh' ? '杰森' : locale === 'ko' ? '제이슨' : 'Jason',
            imageUrl: '/images/therapist-2.jpg',
            bio: locale === 'zh' ? '专注于深层组织按摩和运动按摩。帮助客户缓解慢性疼痛和肌肉紧张。' : 
                locale === 'ko' ? '딥 티슈 마사지와 스포츠 마사지에 전문화되어 있습니다. 만성 통증과 근육 긴장을 완화하는 데 도움을 줍니다.' : 
                'Focused on deep tissue and sports massage. Helps clients relieve chronic pain and muscle tension.',
            specialties: ['deep-tissue', 'sports'],
            experienceYears: 8
          },
          {
            id: '3',
            name: locale === 'zh' ? '小美' : locale === 'ko' ? '미미' : 'Mimi',
            imageUrl: '/images/therapist-3.jpg',
            bio: locale === 'zh' ? '芳香疗法和精油按摩专家。提供放松和舒缓的体验。' : 
                locale === 'ko' ? '아로마테라피와 오일 마사지 전문가. 편안하고 진정되는 경험을 제공합니다.' : 
                'Aromatherapy and oil massage specialist. Provides relaxing and soothing experiences.',
            specialties: ['aromatherapy', 'oil'],
            experienceYears: 6
          },
          {
            id: '4',
            name: locale === 'zh' ? '托尼' : locale === 'ko' ? '토니' : 'Tony',
            imageUrl: '/images/therapist-4.jpg',
            bio: locale === 'zh' ? '全方位按摩师，擅长多种按摩技术。致力于提供个性化的按摩体验。' : 
                locale === 'ko' ? '다양한 마사지 기술에 능숙한 전문 마사지사입니다. 맞춤형 마사지 경험을 제공하는 데 전념하고 있습니다.' : 
                'Versatile therapist skilled in various massage techniques. Dedicated to providing personalized massage experiences.',
            specialties: ['traditional', 'oil', 'foot'],
            experienceYears: 7
          }
        ];
        console.log('使用备用静态按摩师数据');
        setTherapists(staticTherapists);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTherapists();
  }, [formData.serviceId]);
  
  // 选择按摩师
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
  if (error && therapists.length === 0) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-red-700 font-medium mb-2">加载按摩师数据出错</h3>
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
  
  // 渲染按摩师为空的状态
  if (therapists.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">{t('therapistSelection.title')}</h2>
        <p className="text-gray-600 mb-6">{t('therapistSelection.subtitle')}</p>
        
        <div className="bg-gray-50 p-6 rounded-md text-center mb-8">
          <p className="text-gray-600 mb-4">{t('therapistSelection.noTherapistsAvailable') || '当前没有可用的按摩师'}</p>
          <button
            onClick={goToPreviousStep}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            {t('back')}
          </button>
        </div>
      </div>
    );
  }
  
  // 渲染简化的按摩师列表
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
        {therapists.map((therapist) => (
          <div 
            key={therapist.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md
              ${formData.therapistId === therapist.id ? 'border-primary ring-2 ring-primary ring-opacity-50 bg-primary bg-opacity-5' : 'border-gray-200'}`}
            onClick={() => handleSelectTherapist(therapist)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
              <div className="mb-3 sm:mb-0 flex-1">
                <h3 className="font-semibold text-lg mb-1">{therapist.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{therapist.bio}</p>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {therapist.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-right sm:ml-4 sm:min-w-[120px]">
                <div className="mb-2">
                  <p className="text-gray-500 text-xs">{t('therapistSelection.experience')}</p>
                  <p className="font-medium">{therapist.experienceYears} {t('therapistSelection.years')}</p>
                </div>
                
                {formData.therapistId === therapist.id && (
                  <span className="inline-block px-3 py-1 bg-primary text-white text-sm rounded-full mt-2">
                    {t('therapistSelection.selectButton')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          {t('back')}
        </button>
        <button
          onClick={handleContinue}
          disabled={!formData.therapistId}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t('therapistSelection.selectButton')}
        </button>
      </div>
    </div>
  );
};

export default TherapistSelectionStep; 