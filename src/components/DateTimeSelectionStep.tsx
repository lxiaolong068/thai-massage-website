'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BookingFormData } from './BookingForm';
import { format, addDays, isAfter, isBefore, isToday, setHours, setMinutes } from 'date-fns';
import { zhCN, enUS, ko } from 'date-fns/locale';

interface DateTimeSelectionStepProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

// 可用的时间段
const TIME_SLOTS = [
  { id: '1', time: '10:00', label: '10:00 AM' },
  { id: '2', time: '11:00', label: '11:00 AM' },
  { id: '3', time: '12:00', label: '12:00 PM' },
  { id: '4', time: '13:00', label: '1:00 PM' },
  { id: '5', time: '14:00', label: '2:00 PM' },
  { id: '6', time: '15:00', label: '3:00 PM' },
  { id: '7', time: '16:00', label: '4:00 PM' },
  { id: '8', time: '17:00', label: '5:00 PM' },
  { id: '9', time: '18:00', label: '6:00 PM' },
  { id: '10', time: '19:00', label: '7:00 PM' },
];

const DateTimeSelectionStep: React.FC<DateTimeSelectionStepProps> = ({
  formData,
  setFormData,
  goToNextStep,
  goToPreviousStep
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
  
  // 生成未来14天的日期选项
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      options.push({
        date,
        formattedDate: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'EEEE, MMMM d', { locale: getLocale() })
      });
    }
    
    return options;
  };
  
  const dateOptions = generateDateOptions();
  
  // 状态管理
  const [selectedDate, setSelectedDate] = useState<string>(formData.date || dateOptions[0].formattedDate);
  const [selectedTime, setSelectedTime] = useState<string>(formData.time || '');
  
  // 获取当前日期的可用时间段
  const getAvailableTimeSlots = (dateStr: string) => {
    const selectedDateObj = new Date(dateStr);
    const now = new Date();
    
    // 如果是今天，只显示当前时间之后的时间段
    if (isToday(selectedDateObj)) {
      return TIME_SLOTS.filter(slot => {
        const [hours, minutes] = slot.time.split(':').map(Number);
        const slotTime = setMinutes(setHours(now, hours), minutes);
        return isAfter(slotTime, now);
      });
    }
    
    // 否则返回所有时间段
    return TIME_SLOTS;
  };
  
  const availableTimeSlots = getAvailableTimeSlots(selectedDate);
  
  // 处理日期选择
  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime(''); // 重置时间选择
  };
  
  // 处理时间选择
  const handleTimeSelect = (timeStr: string) => {
    setSelectedTime(timeStr);
  };
  
  // 继续下一步
  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setFormData({
        ...formData,
        date: selectedDate,
        time: selectedTime,
        dateTime: `${selectedDate}T${selectedTime}`
      });
      goToNextStep();
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{t('dateTimeSelection.title')}</h2>
      <p className="text-gray-600 mb-6">{t('dateTimeSelection.subtitle')}</p>
      
      {/* 日期选择 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">{t('dateTimeSelection.selectDate')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {dateOptions.map((option) => (
            <button
              key={option.formattedDate}
              type="button"
              className={`p-3 border rounded-md text-left transition-colors
                ${selectedDate === option.formattedDate 
                  ? 'border-primary bg-primary bg-opacity-5 ring-2 ring-primary ring-opacity-50' 
                  : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => handleDateSelect(option.formattedDate)}
            >
              <div className="font-medium">{option.displayDate}</div>
              {isToday(option.date) && (
                <span className="text-sm text-primary">{t('dateTimeSelection.today')}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* 时间选择 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">{t('dateTimeSelection.selectTime')}</h3>
        {availableTimeSlots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {availableTimeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                className={`p-3 border rounded-md text-center transition-colors
                  ${selectedTime === slot.time 
                    ? 'border-primary bg-primary bg-opacity-5 ring-2 ring-primary ring-opacity-50' 
                    : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => handleTimeSelect(slot.time)}
              >
                {slot.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">{t('dateTimeSelection.noTimeSlotsAvailable')}</p>
            <p className="text-yellow-600 text-sm mt-1">{t('dateTimeSelection.selectAnotherDate')}</p>
          </div>
        )}
      </div>
      
      {/* 导航按钮 */}
      <div className="flex justify-between">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {t('back')}
        </button>
        
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelectionStep;
