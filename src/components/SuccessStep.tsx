'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BookingFormData } from './BookingForm';
import { format } from 'date-fns';
import { zhCN, enUS, ko } from 'date-fns/locale';

interface SuccessStepProps {
  bookingId: string | null;
  formData: BookingFormData;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ bookingId, formData }) => {
  const t = useTranslations('booking');
  
  // 获取当前语言对应的日期格式化区域设置
  const getLocale = () => {
    const htmlLang = document.documentElement.lang || 'zh';
    switch (htmlLang) {
      case 'zh': return zhCN;
      case 'ko': return ko;
      default: return enUS;
    }
  };
  
  // 格式化日期和时间
  const formatDateTime = () => {
    if (!formData.date) return '';
    
    try {
      const dateObj = new Date(formData.date);
      const formattedDate = format(dateObj, 'yyyy年MM月dd日 EEEE', { locale: getLocale() });
      return `${formattedDate} ${formData.time}`;
    } catch (err) {
      console.error('日期格式化错误:', err);
      return `${formData.date} ${formData.time}`;
    }
  };
  
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">{t('success.title')}</h2>
      <p className="text-gray-600 mb-6">{t('success.subtitle')}</p>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto text-left">
        <div className="mb-4">
          <p className="text-gray-600 text-sm">{t('success.bookingId')}</p>
          <p className="font-bold text-lg">{bookingId || 'BK-12345'}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm">{t('success.service')}</p>
          <p className="font-medium">{formData.serviceName}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm">{t('success.therapist')}</p>
          <p className="font-medium">{formData.therapistName}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm">{t('success.dateTime')}</p>
          <p className="font-medium">{formatDateTime()}</p>
        </div>
        
        <div>
          <p className="text-gray-600 text-sm">{t('success.price')}</p>
          <p className="font-medium">¥{formData.servicePrice}</p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md mb-8 max-w-md mx-auto">
        <h3 className="font-medium text-blue-700 mb-2">{t('success.nextSteps')}</h3>
        <p className="text-blue-600 text-sm">{t('success.nextStepsDescription')}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/" 
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          {t('success.backToHome')}
        </a>
        
        <button 
          onClick={() => window.print()} 
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          {t('success.printConfirmation')}
        </button>
      </div>
    </div>
  );
};

export default SuccessStep;
