'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CopilotKit, useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar, CopilotPopup, CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { BookingFormData } from './BookingForm';
import ContactQRModal from './ContactQRModal';

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

interface ContactMethod {
  id: string;
  type: string;
  value: string | null;
  qrCode: string | null;
}

interface BookingAssistantProps {
  onBookingComplete?: (bookingData: BookingFormData) => void;
  locale?: string;
}

// 检测设备类型的hook
const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDeviceType = () => {
      // 确保在浏览器环境中运行
      if (typeof window === 'undefined') return;
      
      // 检测屏幕宽度
      const screenWidth = window.innerWidth;
      // 检测触摸设备
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      // 检测用户代理
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(screenWidth < 768 || isTouchDevice || isMobileUA);
    };

    // 初始检测
    checkDeviceType();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkDeviceType);
    
    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, []);

  return isMobile;
};

const BookingAssistant: React.FC<BookingAssistantProps> = ({ 
  onBookingComplete,
  locale = 'zh'
}) => {
  const t = useTranslations('bookingAssistant');
  const isMobile = useDeviceType();
  
  // 状态管理
  const [services, setServices] = useState<Service[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactMethod | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 调试信息更新
  useEffect(() => {
    // 确保在浏览器环境中运行
    if (typeof window === 'undefined') return;
    
    const info = {
      isMobile,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      userAgent: navigator.userAgent.substring(0, 50) + '...',
      touchPoints: navigator.maxTouchPoints,
      hasTouch: 'ontouchstart' in window
    };
    setDebugInfo(JSON.stringify(info, null, 2));
  }, [isMobile]);

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

  // 获取联系方式列表
  useEffect(() => {
    const fetchContactMethods = async () => {
      try {
        const response = await fetch('/api/v1/public/contact-methods');
        const data = await response.json();
        if (data.success) {
          setContactMethods(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch contact methods:', error);
      }
    };

    fetchContactMethods();
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

  // 让AI了解可用的联系方式
  useCopilotReadable({
    description: "Available contact methods for customer support and booking assistance",
    value: contactMethods.map(method => ({
      type: method.type,
      value: method.value,
      canDirectLink: method.type.toLowerCase() === 'line' || method.type.toLowerCase() === 'telegram',
      hasQrCode: !!method.qrCode,
      description: locale === 'en' 
        ? `${method.type} - ${method.type.toLowerCase() === 'line' || method.type.toLowerCase() === 'telegram' ? 'Direct link available' : 'QR code available'}`
        : locale === 'ko' 
        ? `${method.type} - ${method.type.toLowerCase() === 'line' || method.type.toLowerCase() === 'telegram' ? '직접 링크 가능' : 'QR 코드 제공'}`
        : `${method.type} - ${method.type.toLowerCase() === 'line' || method.type.toLowerCase() === 'telegram' ? '可直接链接' : '提供二维码'}`
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

  // 推荐联系方式的动作
  useCopilotAction({
    name: "recommendContactMethods",
    description: "Recommend contact methods to the user for further assistance or booking confirmation",
    parameters: [
      {
        name: "situation",
        type: "string",
        description: "The situation context for recommending contact methods (e.g., 'after_inquiry', 'booking_complete', 'need_help')",
        required: false
      }
    ],
    handler: ({ situation }) => {
      if (contactMethods.length === 0) {
        return locale === 'en' 
          ? "Sorry, contact methods are not available at the moment."
          : locale === 'ko'
          ? "죄송합니다. 현재 연락처 정보를 사용할 수 없습니다."
          : "抱歉，目前联系方式不可用。";
      }

      const intro = locale === 'en' 
        ? "For further assistance or to confirm your booking, you can contact us through the following methods:"
        : locale === 'ko'
        ? "추가 도움이나 예약 확인을 위해 다음 방법으로 연락하실 수 있습니다:"
        : "如需进一步帮助或确认预约，您可以通过以下方式联系我们：";

      const contactInfo = contactMethods.map(method => {
        const methodName = method.type;
        if (method.type.toLowerCase() === 'line') {
          const linkUrl = method.value?.startsWith('http') ? method.value : `https://line.me/ti/p/~${method.value}`;
          return locale === 'en'
            ? `📱 ${methodName}: Click here to chat → [${linkUrl}](${linkUrl})`
            : locale === 'ko'
            ? `📱 ${methodName}: 채팅하려면 클릭 → [${linkUrl}](${linkUrl})`
            : `📱 ${methodName}：点击链接直接聊天 → [${linkUrl}](${linkUrl})`;
        } else if (method.type.toLowerCase() === 'telegram') {
          const linkUrl = `https://t.me/${method.value}`;
          return locale === 'en'
            ? `📱 ${methodName}: Click here to chat → [${linkUrl}](${linkUrl})`
            : locale === 'ko'
            ? `📱 ${methodName}: 채팅하려면 클릭 → [${linkUrl}](${linkUrl})`
            : `📱 ${methodName}：点击链接直接聊天 → [${linkUrl}](${linkUrl})`;
        } else {
          return locale === 'en'
            ? `📱 ${methodName}: Click "Show QR Code" button to view and scan`
            : locale === 'ko'
            ? `📱 ${methodName}: "QR 코드 보기" 버튼을 클릭하여 확인하고 스캔하세요`
            : `📱 ${methodName}：点击"显示二维码"按钮查看并扫描`;
        }
      }).join('\n');

      const suggestion = locale === 'en'
        ? "\n💡 Tip: When contacting us, please mention your booking details for faster assistance."
        : locale === 'ko'
        ? "\n💡 팁: 연락하실 때 예약 세부 정보를 말씀해 주시면 더 빠른 도움을 받으실 수 있습니다."
        : "\n💡 小贴士：联系时请提及您的预约详情，以便我们更快地为您提供帮助。";

      return `${intro}\n\n${contactInfo}${suggestion}`;
    }
  });

  // 显示联系方式二维码的动作
  useCopilotAction({
    name: "showContactQR",
    description: "Show QR code for a specific contact method (WeChat or WhatsApp)",
    parameters: [
      {
        name: "contactType",
        type: "string",
        description: "The type of contact method (WeChat, WhatsApp)",
        required: true
      }
    ],
    handler: ({ contactType }) => {
      const method = contactMethods.find(
        m => m.type.toLowerCase() === contactType.toLowerCase()
      );
      
      if (!method || !method.qrCode) {
        return locale === 'en'
          ? `QR code for ${contactType} is not available.`
          : locale === 'ko'
          ? `${contactType} QR 코드를 사용할 수 없습니다.`
          : `${contactType}二维码不可用。`;
      }

      // 显示二维码弹窗
      setSelectedContact(method);
      setQrModalOpen(true);

      return locale === 'en'
        ? `Displaying ${contactType} QR code. Please scan with your phone to contact us.`
        : locale === 'ko'
        ? `${contactType} QR 코드를 표시합니다. 휴대폰으로 스캔하여 연락해주세요.`
        : `正在显示${contactType}二维码，请用手机扫码联系我们。`;
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

  // 显示服务概览的动作
  useCopilotAction({
    name: "showServiceOverview",
    description: "Display an overview of all available massage services with prices and descriptions",
    parameters: [],
    handler: () => {
      if (services.length === 0) {
        return "服务信息加载中，请稍候...";
      }

      let overview = "🌟 **我们的按摩服务一览：**\n\n";
      
      services.forEach((service, index) => {
        overview += `**${index + 1}. ${service.name}**\n`;
        overview += `💰 价格：${service.price}元\n`;
        overview += `⏱️ 时长：${service.duration}分钟\n`;
        if (service.description) {
          overview += `📝 介绍：${service.description}\n`;
        }
        overview += "\n";
      });

      overview += "✨ **为什么选择我们？**\n";
      overview += "• 专业认证按摩师\n";
      overview += "• 上门服务，舒适便捷\n";
      overview += "• 使用优质按摩用品\n";
      overview += "• 灵活预约时间\n\n";
      overview += "请告诉我您感兴趣的服务，我来为您安排预约！";

      return overview;
    }
  });

  // 显示按摩师概览的动作
  useCopilotAction({
    name: "showTherapistOverview", 
    description: "Display an overview of available therapists with their specialties",
    parameters: [],
    handler: () => {
      if (therapists.length === 0) {
        return "按摩师信息加载中，请稍候...";
      }

      const availableTherapists = therapists.filter(t => t.workStatus === 'AVAILABLE');
      
      if (availableTherapists.length === 0) {
        return "抱歉，目前没有可预约的按摩师。请稍后再试或联系我们了解详情。";
      }

      let overview = "👥 **我们的专业按摩师团队：**\n\n";
      
      availableTherapists.forEach((therapist, index) => {
        overview += `**${index + 1}. ${therapist.name}**\n`;
        if (therapist.specialties && therapist.specialties.length > 0) {
          overview += `🎯 专长：${therapist.specialties.join('、')}\n`;
        }
        overview += `✅ 状态：可预约\n\n`;
      });

      overview += "💡 **提示：**\n";
      overview += "所有按摩师都经过专业培训和认证，拥有丰富的按摩经验。\n";
      overview += "您可以根据喜好选择，也可以让我为您推荐合适的按摩师。";

      return overview;
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

  // 移动端优化的样式
  const mobileStyles = {
    container: "booking-assistant",
    chatWrapper: "",
    popup: ""
  };

  const desktopStyles = {
    container: "booking-assistant",
    chatWrapper: "",
    popup: ""
  };

  const styles = isMobile ? mobileStyles : desktopStyles;

  // 渲染不同的UI组件
  const renderCopilotUI = () => {
    const commonProps = {
      instructions: t('instructions'),
      labels: {
        title: t('title'),
        initial: t('initial'),
        placeholder: t('placeholder'),
      }
    };

    // 统一使用CopilotPopup，并设置正确的定位
    return (
      <CopilotPopup
        {...commonProps}
        className="booking-assistant-popup"
        defaultOpen={false}
      />
    );
  };

  return (
    <div className={styles.container}>
      {renderCopilotUI()}
      
      {/* 联系方式二维码弹窗 */}
      {selectedContact && (
        <ContactQRModal
          isOpen={qrModalOpen}
          onClose={() => {
            setQrModalOpen(false);
            setSelectedContact(null);
          }}
          contactType={selectedContact.type}
          qrCodeUrl={selectedContact.qrCode || ''}
          contactValue={selectedContact.value || undefined}
          locale={locale}
        />
      )}
      
      {/* 预约助手弹窗样式 */}
      <style jsx global>{`
        /* 预约助手弹窗基础定位 */
        .booking-assistant-popup {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 9999 !important;
          width: auto !important;
          height: auto !important;
        }

        /* 桌面端样式 */
        @media (min-width: 769px) {
          .booking-assistant-popup {
            bottom: 30px !important;
            right: 30px !important;
            max-width: 400px !important;
            max-height: 600px !important;
          }
        }

        /* 移动端样式 */
        @media (max-width: 768px) {
          .booking-assistant-popup {
            bottom: 20px !important;
            right: 20px !important;
            left: 20px !important;
            max-width: calc(100vw - 40px) !important;
            max-height: 70vh !important;
          }
        }

        /* 小屏移动端样式 */
        @media (max-width: 480px) {
          .booking-assistant-popup {
            bottom: 15px !important;
            right: 15px !important;
            left: 15px !important;
            max-width: calc(100vw - 30px) !important;
            max-height: 75vh !important;
          }
        }

        /* 弹窗内容区域样式 */
        .booking-assistant-popup [role="dialog"] {
          border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          border: 1px solid #e5e7eb !important;
        }

        /* 输入框和按钮优化 */
        .booking-assistant-popup input,
        .booking-assistant-popup textarea,
        .booking-assistant-popup button {
          font-size: 16px !important; /* 防止iOS缩放 */
          touch-action: manipulation;
          -webkit-appearance: none;
          appearance: none;
        }

        .booking-assistant-popup button {
          min-height: 44px !important;
          min-width: 44px !important;
          padding: 12px !important;
        }

        /* 聊天消息区域 */
        .booking-assistant-popup .copilot-chat-messages {
          -webkit-overflow-scrolling: touch !important;
          overscroll-behavior: contain;
        }

        /* 确保弹窗可见性 */
        .booking-assistant-popup {
          visibility: visible !important;
          opacity: 1 !important;
        }

        /* 触发按钮样式 */
        .booking-assistant-popup button[data-state="closed"] {
          background-color: #3b82f6 !important;
          color: white !important;
          border-radius: 50% !important;
          width: 60px !important;
          height: 60px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }

                 /* 触发按钮悬浮效果 */
         .booking-assistant-popup button[data-state="closed"]:hover {
           background-color: #2563eb !important;
           transform: scale(1.05) !important;
           transition: all 0.2s ease !important;
         }
        `}</style>
    </div>
  );
};

// 不再提供包装组件，直接导出主组件
// 由页面级别统一管理CopilotKit上下文
export default BookingAssistant;
export { BookingAssistant };