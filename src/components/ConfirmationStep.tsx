'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BookingFormData } from './BookingForm';
import { format } from 'date-fns';
import { zhCN, enUS, ko } from 'date-fns/locale';

interface ConfirmationStepProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  handleSubmit: () => Promise<void>;
  goToPreviousStep: () => void;
  isLoading: boolean;
  error: string | null;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formData,
  setFormData,
  handleSubmit,
  goToPreviousStep,
  isLoading,
  error
}) => {
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
  
  // 渲染预约详情
  const renderBookingDetails = () => {
    return (
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-semibold text-lg mb-4">{t('confirmation.bookingDetails')}</h3>
        
        <div className="space-y-4">
          {/* 服务信息 */}
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirmation.service')}:</span>
            <span className="font-medium">{formData.serviceName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirmation.price')}:</span>
            <span className="font-medium">¥{formData.servicePrice}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirmation.duration')}:</span>
            <span className="font-medium">{formData.serviceDuration} {t('confirmation.minutes')}</span>
          </div>
          
          {/* 治疗师信息 */}
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirmation.therapist')}:</span>
            <span className="font-medium">{formData.therapistName}</span>
          </div>
          
          {/* 日期和时间 */}
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirmation.dateTime')}:</span>
            <span className="font-medium">{formatDateTime()}</span>
          </div>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          {/* 客户信息 */}
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirmation.name')}:</span>
            <span className="font-medium">{formData.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">{t('confirmation.phone')}:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>
          
          {formData.email && (
            <div className="flex justify-between">
              <span className="text-gray-600">{t('confirmation.email')}:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
          )}
          
          {formData.notes && (
            <div className="flex flex-col">
              <span className="text-gray-600 mb-1">{t('confirmation.notes')}:</span>
              <p className="bg-white p-3 rounded border border-gray-200 text-sm">{formData.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('confirmation.title')}</h2>
      <p className="text-gray-600 mb-6">{t('confirmation.subtitle')}</p>
      
      {/* 预约详情 */}
      {renderBookingDetails()}
      
      {/* 支付提示 */}
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="font-medium text-blue-700 mb-2">{t('confirmation.paymentInfo')}</h3>
        <p className="text-blue-600 text-sm">{t('confirmation.paymentDescription')}</p>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <h3 className="font-medium text-red-700 mb-1">{t('confirmation.errorTitle')}</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* 导航按钮 */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('back')}
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {t('confirmation.processing')}
            </>
          ) : (
            t('confirmation.confirmButton')
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
