'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CopilotKit, useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { BookingFormData } from './BookingForm';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface Therapist {
  id: string;
  name: string;
  specialties: string[];
  workStatus: string;
}

interface BookingAssistantProps {
  onBookingComplete?: (bookingData: BookingFormData) => void;
  locale?: string;
}

const BookingAssistant: React.FC<BookingAssistantProps> = ({ 
  onBookingComplete,
  locale = 'zh'
}) => {
  const t = useTranslations('bookingAssistant');
  
  // 状态管理
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // 获取服务列表
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  // 获取按摩师列表
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch('/api/therapists');
        const data = await response.json();
        if (data.success) {
          setTherapists(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch therapists:', error);
      }
    };

    fetchTherapists();
  }, []);

  // 让AI了解可用的服务
  useCopilotReadable({
    description: "Available massage services with names, prices, and duration information",
    value: services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: `${locale === 'en' ? '$' : ''}${service.price}${locale === 'en' ? '' : (locale === 'ko' ? '원' : '元')}`,
      duration: `${service.duration}${locale === 'en' ? ' minutes' : (locale === 'ko' ? '분' : '分钟')}`
    }))
  });

  // 让AI了解可用的按摩师
  useCopilotReadable({
    description: "Available therapists with names, specialties, and work status",
    value: therapists.map(therapist => ({
      id: therapist.id,
      name: therapist.name,
      specialties: therapist.specialties,
      status: therapist.workStatus === 'AVAILABLE' ? 
        (locale === 'en' ? 'Available' : (locale === 'ko' ? '예약 가능' : '可预约')) : 
        (locale === 'en' ? 'Unavailable' : (locale === 'ko' ? '예약 불가능' : '不可预约'))
    }))
  });

  // 让AI了解当前预约进度
  useCopilotReadable({
    description: "Current booking form progress and selected information",
    value: {
      selectedService: bookingData.serviceName || (locale === 'en' ? 'Not selected' : (locale === 'ko' ? '선택되지 않음' : '未选择')),
      selectedTherapist: bookingData.therapistName || (locale === 'en' ? 'Not selected' : (locale === 'ko' ? '선택되지 않음' : '未选择')),
      selectedDate: bookingData.date || (locale === 'en' ? 'Not selected' : (locale === 'ko' ? '선택되지 않음' : '未选择')),
      selectedTime: bookingData.time || (locale === 'en' ? 'Not selected' : (locale === 'ko' ? '선택되지 않음' : '未选择')),
      customerName: bookingData.name || (locale === 'en' ? 'Not filled' : (locale === 'ko' ? '입력되지 않음' : '未填写')),
      customerPhone: bookingData.phone || (locale === 'en' ? 'Not filled' : (locale === 'ko' ? '입력되지 않음' : '未填写')),
      customerEmail: bookingData.email || (locale === 'en' ? 'Not filled' : (locale === 'ko' ? '입력되지 않음' : '未填写')),
      notes: bookingData.notes || (locale === 'en' ? 'No notes' : (locale === 'ko' ? '메모 없음' : '无备注'))
    }
  });

  // 选择服务的动作
  useCopilotAction({
    name: "selectService",
    description: "Select massage service",
    parameters: [
      {
        name: "serviceId",
        type: "string",
        description: "Service ID",
        required: true
      },
      {
        name: "serviceName",
        type: "string",
        description: "Service name",
        required: true
      }
    ],
    handler: ({ serviceId, serviceName }) => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setBookingData(prev => ({
          ...prev,
          serviceId,
          serviceName,
          servicePrice: service.price,
          serviceDuration: service.duration
        }));
        return t('responses.serviceSelected', {
          serviceName,
          price: service.price,
          duration: service.duration
        });
      }
      return t('responses.serviceSelectFailed');
    }
  });

  // 选择按摩师的动作
  useCopilotAction({
    name: "selectTherapist",
    description: "Select therapist",
    parameters: [
      {
        name: "therapistId",
        type: "string",
        description: "Therapist ID",
        required: true
      },
      {
        name: "therapistName",
        type: "string",
        description: "Therapist name",
        required: true
      }
    ],
    handler: ({ therapistId, therapistName }) => {
      const therapist = therapists.find(t => t.id === therapistId);
      if (therapist && therapist.workStatus === 'AVAILABLE') {
        setBookingData(prev => ({
          ...prev,
          therapistId,
          therapistName
        }));
        return t('responses.therapistSelected', { therapistName });
      }
      return t('responses.therapistSelectFailed');
    }
  });

  // 设置预约时间的动作
  useCopilotAction({
    name: "setDateTime",
    description: "Set appointment date and time",
    parameters: [
      {
        name: "date",
        type: "string",
        description: "Appointment date (YYYY-MM-DD format)",
        required: true
      },
      {
        name: "time",
        type: "string",
        description: "Appointment time (HH:mm format)",
        required: true
      }
    ],
    handler: ({ date, time }) => {
      // 验证日期格式
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}$/;
      
      if (!dateRegex.test(date) || !timeRegex.test(time)) {
        return t('responses.dateTimeFormatError');
      }

      // 检查日期是否为未来日期
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return t('responses.pastDateError');
      }

      setBookingData(prev => ({
        ...prev,
        date,
        time,
        dateTime: `${date} ${time}`
      }));
      
      return t('responses.dateTimeSet', { date, time });
    }
  });

  // 填写客户信息的动作
  useCopilotAction({
    name: "setCustomerInfo",
    description: "Fill in customer contact information",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Customer name",
        required: true
      },
      {
        name: "phone",
        type: "string",
        description: "Customer phone number",
        required: true
      },
      {
        name: "email",
        type: "string",
        description: "Customer email address",
        required: false
      },
      {
        name: "notes",
        type: "string",
        description: "Additional notes",
        required: false
      }
    ],
    handler: ({ name, phone, email, notes }) => {
      // 验证电话号码格式（根据语言调整验证规则）
      let phoneRegex;
      if (locale === 'zh') {
        phoneRegex = /^1[3-9]\d{9}$/; // 中国手机号
      } else {
        phoneRegex = /^[\+]?[0-9\-\s()]{8,15}$/; // 国际通用格式
      }
      
      if (!phoneRegex.test(phone)) {
        return t('responses.phoneFormatError');
      }

      // 验证邮箱格式（如果提供）
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return t('responses.emailFormatError');
        }
      }

      setBookingData(prev => ({
        ...prev,
        name,
        phone,
        email: email || '',
        notes: notes || '',
        termsAgreed: true
      }));
      
      return t('responses.customerInfoSaved', { name, phone });
    }
  });

  // 提交预约的动作
  useCopilotAction({
    name: "submitBooking",
    description: "Submit booking request",
    parameters: [],
    handler: async () => {
      // 检查必填信息是否完整
      const required = ['serviceId', 'therapistId', 'date', 'time', 'name', 'phone'];
      const missing = required.filter(field => !bookingData[field as keyof BookingFormData]);
      
      if (missing.length > 0) {
        const missingNames = missing.map(field => t(`responses.fieldNames.${field}`)).join('、');
        return t('responses.bookingIncomplete', { missing: missingNames });
      }

      setIsLoading(true);
      
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();
        
        if (result.success) {
          if (onBookingComplete) {
            onBookingComplete(bookingData as BookingFormData);
          }
          return t('responses.bookingSuccess', { bookingId: result.data.id });
        } else {
          return t('responses.bookingFailed', { error: result.message || 'Unknown error' });
        }
      } catch (error) {
        console.error('Booking submission failed:', error);
        return t('responses.bookingError');
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="booking-assistant">
      <CopilotSidebar
        instructions={t('instructions')}
        labels={{
          title: t('title'),
          initial: t('initial'),
          placeholder: t('placeholder'),
        }}
      />
    </div>
  );
};

// 包装组件，提供CopilotKit上下文
const BookingAssistantWrapper: React.FC<BookingAssistantProps> = (props) => {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <BookingAssistant {...props} />
    </CopilotKit>
  );
};

export default BookingAssistantWrapper;
export { BookingAssistantWrapper as BookingAssistant };