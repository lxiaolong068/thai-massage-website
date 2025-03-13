'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BookingFormData } from './BookingForm';

interface CustomerDetailsStepProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const CustomerDetailsStep: React.FC<CustomerDetailsStepProps> = ({
  formData,
  setFormData,
  goToNextStep,
  goToPreviousStep
}) => {
  const t = useTranslations('booking');
  
  // 表单验证状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 更新表单数据
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // 处理复选框变化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: checked
    });
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = t('customerDetails.errors.nameRequired');
    }
    
    // 验证电话
    if (!formData.phone.trim()) {
      newErrors.phone = t('customerDetails.errors.phoneRequired');
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[+\s-]/g, ''))) {
      newErrors.phone = t('customerDetails.errors.phoneInvalid');
    }
    
    // 验证邮箱
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('customerDetails.errors.emailInvalid');
    }
    
    // 验证条款同意
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = t('customerDetails.errors.termsRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      goToNextStep();
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('customerDetails.title')}</h2>
      <p className="text-gray-600 mb-6">{t('customerDetails.subtitle')}</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 姓名 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('customerDetails.name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
              ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('customerDetails.namePlaceholder')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        
        {/* 电话 */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            {t('customerDetails.phone')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
              ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('customerDetails.phonePlaceholder')}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
        
        {/* 邮箱 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('customerDetails.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
              ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={t('customerDetails.emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        {/* 备注 */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            {t('customerDetails.notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={t('customerDetails.notesPlaceholder')}
          />
        </div>
        
        {/* 条款同意 */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="termsAgreed"
                name="termsAgreed"
                type="checkbox"
                checked={formData.termsAgreed}
                onChange={handleCheckboxChange}
                className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded
                  ${errors.termsAgreed ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="termsAgreed" className="font-medium text-gray-700">
                {t('customerDetails.termsAgreement')} <span className="text-red-500">*</span>
              </label>
              <p className="text-gray-500">{t('customerDetails.termsDescription')}</p>
              {errors.termsAgreed && (
                <p className="mt-1 text-sm text-red-500">{errors.termsAgreed}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* 导航按钮 */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {t('back')}
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {t('continue')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerDetailsStep;
