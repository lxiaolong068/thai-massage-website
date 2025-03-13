'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

// 导入各个步骤组件
import ServiceSelectionStep from './ServiceSelectionStep';
import TherapistSelectionStep from './TherapistSelectionStep';
import DateTimeSelectionStep from './DateTimeSelectionStep';
import CustomerDetailsStep from './CustomerDetailsStep';
import ConfirmationStep from './ConfirmationStep';
import SuccessStep from './SuccessStep';

// 预约步骤枚举
enum BookingStep {
  SERVICE_SELECTION = 0,
  THERAPIST_SELECTION = 1,
  DATETIME_SELECTION = 2,
  CUSTOMER_DETAILS = 3,
  CONFIRMATION = 4,
  SUCCESS = 5,
}

// 预约表单数据类型
export interface BookingFormData {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  dateTime?: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  termsAgreed: boolean;
}

interface BookingFormProps {
  initialTherapistId?: string;
  initialTherapistName?: string;
  inModal?: boolean;
  onComplete?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  initialTherapistId, 
  initialTherapistName,
  inModal = false,
  onComplete
}) => {
  const t = useTranslations('booking');
  const router = useRouter();
  
  // 当前步骤状态 - 如果已选择按摩师，仍然从服务选择开始
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.SERVICE_SELECTION);
  
  // 表单数据状态
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: '',
    serviceName: '',
    servicePrice: 0,
    serviceDuration: 0,
    therapistId: initialTherapistId || '',
    therapistName: initialTherapistName || '',
    date: '',
    time: '',
    dateTime: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
    termsAgreed: false,
  });
  
  // 加载状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // 错误状态
  const [error, setError] = useState<string | null>(null);
  
  // 预约ID（成功后）
  const [bookingId, setBookingId] = useState<string | null>(null);

  // 处理步骤导航
  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 创建预约请求数据
      const bookingData = {
        serviceId: formData.serviceId,
        therapistId: formData.therapistId,
        date: formData.date,
        time: formData.time,
        dateTime: formData.dateTime,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
      };
      
      // 发送预约请求
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || t('errors.generalError'));
      }
      
      // 设置预约ID并进入成功步骤
      setBookingId(result.data.orderNumber || result.data.id);
      goToNextStep();
      
      // 如果在模态框中并且有完成回调，则3秒后调用
      if (inModal && onComplete) {
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => {
    const steps = [
      { key: 'service', label: t('steps.service') },
      { key: 'therapist', label: t('steps.therapist') },
      { key: 'datetime', label: t('steps.datetime') },
      { key: 'details', label: t('steps.details') },
      { key: 'confirm', label: t('steps.confirm') },
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div 
              key={step.key} 
              className={`flex flex-col items-center ${index <= currentStep ? 'text-primary' : 'text-gray-400'}`}
            >
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                  ${index < currentStep ? 'bg-primary text-white' : 
                    index === currentStep ? 'border-2 border-primary text-primary' : 'border-2 border-gray-300 text-gray-400'}`}
              >
                {index + 1}
              </div>
              <span className="text-sm">{step.label}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-primary transition-all" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // 根据当前步骤渲染不同内容
  const renderCurrentStep = () => {
    switch (currentStep) {
      case BookingStep.SERVICE_SELECTION:
        return <ServiceSelectionStep formData={formData} setFormData={setFormData} goToNextStep={goToNextStep} />;
      case BookingStep.THERAPIST_SELECTION:
        return <TherapistSelectionStep formData={formData} setFormData={setFormData} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />;
      case BookingStep.DATETIME_SELECTION:
        return <DateTimeSelectionStep formData={formData} setFormData={setFormData} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />;
      case BookingStep.CUSTOMER_DETAILS:
        return <CustomerDetailsStep formData={formData} setFormData={setFormData} goToNextStep={goToNextStep} goToPreviousStep={goToPreviousStep} />;
      case BookingStep.CONFIRMATION:
        return <ConfirmationStep formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} goToPreviousStep={goToPreviousStep} isLoading={isLoading} error={error} />;
      case BookingStep.SUCCESS:
        return <SuccessStep bookingId={bookingId} formData={formData} />;
      default:
        return null;
    }
  };

  // 如果是成功步骤，不显示步骤指示器
  return (
    <div className={`${inModal ? '' : 'max-w-4xl mx-auto'} bg-white ${inModal ? 'p-2' : 'p-6 rounded-lg shadow-md'}`}>
      {!inModal && (
        <>
          <h1 className="text-3xl font-bold text-center mb-2">{t('title')}</h1>
          <p className="text-gray-600 text-center mb-8">{t('subtitle')}</p>
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-6 text-center text-sm">
            {t('simplifiedFormNotice') || '简化版预约表单：无需浏览图片，直接选择服务和按摩师，快速完成预约。'}
          </div>
        </>
      )}
      
      {currentStep !== BookingStep.SUCCESS && renderStepIndicator()}
      
      {renderCurrentStep()}
    </div>
  );
};

export default BookingForm;
