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
  const t = useTranslations('booking');
  
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
        console.error('获取服务列表失败:', error);
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
        console.error('获取按摩师列表失败:', error);
      }
    };

    fetchTherapists();
  }, []);

  // 让AI了解可用的服务
  useCopilotReadable({
    description: "可预约的按摩服务列表，包含服务名称、价格、时长等信息",
    value: services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: `${service.price}元`,
      duration: `${service.duration}分钟`
    }))
  });

  // 让AI了解可用的按摩师
  useCopilotReadable({
    description: "可预约的按摩师列表，包含姓名、专长、工作状态等信息",
    value: therapists.map(therapist => ({
      id: therapist.id,
      name: therapist.name,
      specialties: therapist.specialties,
      status: therapist.workStatus === 'AVAILABLE' ? '可预约' : '不可预约'
    }))
  });

  // 让AI了解当前预约进度
  useCopilotReadable({
    description: "当前预约表单的填写进度和已选择的信息",
    value: {
      selectedService: bookingData.serviceName || '未选择',
      selectedTherapist: bookingData.therapistName || '未选择',
      selectedDate: bookingData.date || '未选择',
      selectedTime: bookingData.time || '未选择',
      customerName: bookingData.name || '未填写',
      customerPhone: bookingData.phone || '未填写',
      customerEmail: bookingData.email || '未填写',
      notes: bookingData.notes || '无备注'
    }
  });

  // 选择服务的动作
  useCopilotAction({
    name: "selectService",
    description: "选择按摩服务",
    parameters: [
      {
        name: "serviceId",
        type: "string",
        description: "服务ID",
        required: true
      },
      {
        name: "serviceName",
        type: "string",
        description: "服务名称",
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
        return `已选择服务：${serviceName}，价格：${service.price}元，时长：${service.duration}分钟`;
      }
      return "服务选择失败，请重新选择";
    }
  });

  // 选择按摩师的动作
  useCopilotAction({
    name: "selectTherapist",
    description: "选择按摩师",
    parameters: [
      {
        name: "therapistId",
        type: "string",
        description: "按摩师ID",
        required: true
      },
      {
        name: "therapistName",
        type: "string",
        description: "按摩师姓名",
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
        return `已选择按摩师：${therapistName}`;
      }
      return "按摩师选择失败或该按摩师不可预约，请重新选择";
    }
  });

  // 设置预约时间的动作
  useCopilotAction({
    name: "setDateTime",
    description: "设置预约日期和时间",
    parameters: [
      {
        name: "date",
        type: "string",
        description: "预约日期 (YYYY-MM-DD格式)",
        required: true
      },
      {
        name: "time",
        type: "string",
        description: "预约时间 (HH:mm格式)",
        required: true
      }
    ],
    handler: ({ date, time }) => {
      // 验证日期格式
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}$/;
      
      if (!dateRegex.test(date) || !timeRegex.test(time)) {
        return "日期或时间格式不正确，请使用YYYY-MM-DD和HH:mm格式";
      }

      // 检查日期是否为未来日期
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return "不能预约过去的日期，请选择今天或未来的日期";
      }

      setBookingData(prev => ({
        ...prev,
        date,
        time,
        dateTime: `${date} ${time}`
      }));
      
      return `已设置预约时间：${date} ${time}`;
    }
  });

  // 填写客户信息的动作
  useCopilotAction({
    name: "setCustomerInfo",
    description: "填写客户联系信息",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "客户姓名",
        required: true
      },
      {
        name: "phone",
        type: "string",
        description: "客户电话号码",
        required: true
      },
      {
        name: "email",
        type: "string",
        description: "客户邮箱地址",
        required: false
      },
      {
        name: "notes",
        type: "string",
        description: "备注信息",
        required: false
      }
    ],
    handler: ({ name, phone, email, notes }) => {
      // 验证电话号码格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return "电话号码格式不正确，请输入11位手机号码";
      }

      // 验证邮箱格式（如果提供）
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return "邮箱格式不正确，请重新输入";
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
      
      return `已保存客户信息：${name}，电话：${phone}`;
    }
  });

  // 提交预约的动作
  useCopilotAction({
    name: "submitBooking",
    description: "提交预约申请",
    parameters: [],
    handler: async () => {
      // 检查必填信息是否完整
      const required = ['serviceId', 'therapistId', 'date', 'time', 'name', 'phone'];
      const missing = required.filter(field => !bookingData[field as keyof BookingFormData]);
      
      if (missing.length > 0) {
        return `预约信息不完整，还需要填写：${missing.map(field => {
          switch(field) {
            case 'serviceId': return '服务类型';
            case 'therapistId': return '按摩师';
            case 'date': return '预约日期';
            case 'time': return '预约时间';
            case 'name': return '姓名';
            case 'phone': return '电话';
            default: return field;
          }
        }).join('、')}`;
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
          return `预约成功！预约编号：${result.data.id}。我们会尽快联系您确认预约详情。`;
        } else {
          return `预约失败：${result.message || '未知错误'}`;
        }
      } catch (error) {
        console.error('预约提交失败:', error);
        return "预约提交失败，请稍后重试或联系客服";
      } finally {
        setIsLoading(false);
      }
    }
  });

  const instructions = `
你是一个专业的泰式按摩预约助手。你的任务是帮助客户轻松完成按摩服务预约。

请按照以下步骤引导客户：

1. **了解需求**：询问客户想要什么类型的按摩服务
2. **推荐服务**：根据可用服务列表为客户推荐合适的服务
3. **选择按摩师**：帮助客户选择合适的按摩师
4. **安排时间**：协助客户选择合适的预约日期和时间
5. **收集信息**：获取客户的联系信息（姓名、电话、邮箱）
6. **确认预约**：核实所有信息后提交预约

注意事项：
- 始终保持友好和专业的态度
- 详细介绍每个服务的特点和价格
- 确保客户了解预约的所有细节
- 如果客户有特殊需求，记录在备注中
- 预约时间必须是未来的日期和时间
- 电话号码必须是有效的11位手机号

当前语言：${locale === 'zh' ? '中文' : 'English'}
请用相应语言与客户交流。
  `;

  return (
    <div className="booking-assistant">
      <CopilotSidebar
        instructions={instructions}
        labels={{
          title: "预约助手",
          initial: "您好！我是您的专属按摩预约助手。我可以帮您快速完成预约，无需填写复杂的表单。请告诉我您想要什么类型的按摩服务？",
          placeholder: "请描述您的需求...",
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