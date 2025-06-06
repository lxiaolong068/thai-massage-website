'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CopilotKit, useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar, CopilotPopup, CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { BookingFormData } from './BookingForm';
// ContactQRModal removed - now using URL display

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
  // QR modal states removed - now using URL display instead
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
          // 使用与欢迎消息相同的Line URL生成逻辑
          let linkUrl = '';
          if (method.value?.startsWith('http')) {
            linkUrl = method.value;
          } else if (method.value?.startsWith('@')) {
            linkUrl = `https://line.me/ti/p/${method.value}`;
          } else {
            linkUrl = `https://line.me/ti/p/@${method.value}`;
          }
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

  // 显示联系方式二维码的动作 - 返回URL
  useCopilotAction({
    name: "showContactQR",
    description: "Show QR code URL for a specific contact method (WeChat or WhatsApp)",
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
          ? `❌ QR code for ${contactType} is not available.`
          : locale === 'ko'
          ? `❌ ${contactType} QR 코드를 사용할 수 없습니다.`
          : `❌ ${contactType}二维码不可用。`;
      }

      // 返回简短的可点击链接
      return locale === 'en'
        ? `📱 **${contactType} QR Code:** [Click to View QR Code](${method.qrCode})\n\n📱 **Quick Access:**\n• Click the link above to view QR code\n• Scan with your phone to add us\n• Start chatting instantly!`
        : locale === 'ko'
        ? `📱 **${contactType} QR 코드:** [QR 코드 보기](${method.qrCode})\n\n📱 **빠른 액세스:**\n• 위 링크를 클릭하여 QR 코드 확인\n• 휴대폰으로 스캔하여 추가\n• 즉시 채팅 시작!`
        : `📱 **${contactType}二维码：** [点击查看二维码](${method.qrCode})\n\n📱 **快速使用：**\n• 点击上方链接查看二维码\n• 用手机扫描添加我们\n• 立即开始聊天！`;
    }
  });

  // 快捷显示二维码的动作 - 返回二维码URL
  useCopilotAction({
    name: "showQRCode",
    description: "Show QR code URL for WeChat or WhatsApp when user requests",
    parameters: [
      {
        name: "platform",
        type: "string",
        description: "Platform name: 'wechat', 'whatsapp', '微信', 'WeChat', 'WhatsApp'",
        required: true
      }
    ],
    handler: ({ platform }) => {
      const platformLower = platform.toLowerCase();
      
      if (platformLower.includes('wechat') || platformLower.includes('微信')) {
        const wechatMethod = contactMethods.find(m => m.type.toLowerCase() === 'wechat');
        if (wechatMethod && wechatMethod.qrCode) {
          return locale === 'en'
            ? `📱 **WeChat QR Code:** [Click to View QR Code](${wechatMethod.qrCode})\n\n📋 **How to use:**\n1. Click the link above\n2. View QR code in your browser\n3. Scan with your phone to add us\n4. Start chatting in Chinese!`
            : locale === 'ko'
            ? `📱 **WeChat QR 코드:** [QR 코드 보기](${wechatMethod.qrCode})\n\n📋 **사용 방법:**\n1. 위 링크를 클릭하세요\n2. 브라우저에서 QR 코드 확인\n3. 휴대폰으로 스캔하여 추가하세요\n4. 중국어로 채팅을 시작하세요!`
            : `📱 **微信二维码：** [点击查看二维码](${wechatMethod.qrCode})\n\n📋 **使用方法：**\n1. 点击上方链接\n2. 在浏览器中查看二维码\n3. 用手机扫码添加\n4. 开始中文聊天！`;
        } else {
          return locale === 'en'
            ? "❌ WeChat QR code is not available at the moment."
            : locale === 'ko'
            ? "❌ WeChat QR 코드를 현재 사용할 수 없습니다."
            : "❌ 微信二维码暂不可用。";
        }
      } else if (platformLower.includes('whatsapp')) {
        const whatsappMethod = contactMethods.find(m => m.type.toLowerCase() === 'whatsapp');
        if (whatsappMethod && whatsappMethod.qrCode) {
          return locale === 'en'
            ? `📱 **WhatsApp QR Code:** [Click to View QR Code](${whatsappMethod.qrCode})\n\n📋 **How to use:**\n1. Click the link above\n2. View QR code in your browser\n3. Scan with your phone to add us\n4. Start chatting in your preferred language!`
            : locale === 'ko'
            ? `📱 **WhatsApp QR 코드:** [QR 코드 보기](${whatsappMethod.qrCode})\n\n📋 **사용 방법:**\n1. 위 링크를 클릭하세요\n2. 브라우저에서 QR 코드 확인\n3. 휴대폰으로 스캔하여 추가하세요\n4. 원하는 언어로 채팅을 시작하세요!`
            : `📱 **WhatsApp二维码：** [点击查看二维码](${whatsappMethod.qrCode})\n\n📋 **使用方法：**\n1. 点击上方链接\n2. 在浏览器中查看二维码\n3. 用手机扫码添加\n4. 开始多语言聊天！`;
        } else {
          return locale === 'en'
            ? "❌ WhatsApp QR code is not available at the moment."
            : locale === 'ko'
            ? "❌ WhatsApp QR 코드를 현재 사용할 수 없습니다."
            : "❌ WhatsApp二维码暂不可用。";
        }
      } else {
        return locale === 'en'
          ? "❓ Please specify 'WeChat' or 'WhatsApp' to view QR code."
          : locale === 'ko'
          ? "❓ QR 코드를 보려면 'WeChat' 또는 'WhatsApp'을 지정해주세요."
          : "❓ 请指定「微信」或「WhatsApp」来查看二维码。";
      }
    }
  });

  // 处理用户的二维码请求 - 改进版，支持更多的表达方式，返回URL
  useCopilotAction({
    name: "handleQRRequest",
    description: "Handle user requests for QR codes - supports various expressions and returns QR code URLs",
    parameters: [
      {
        name: "userMessage",
        type: "string", 
        description: "User's original message requesting QR code",
        required: true
      }
    ],
    handler: ({ userMessage }) => {
      const message = userMessage.toLowerCase();
      
      // 微信相关的各种表达方式
      if (message.includes('微信') || message.includes('wechat') || 
          (message.includes('二维码') && (message.includes('微') || message.includes('wx'))) ||
          message.includes('查看二维码')) {
        const wechatMethod = contactMethods.find(m => m.type.toLowerCase() === 'wechat');
        if (wechatMethod && wechatMethod.qrCode) {
          return locale === 'en'
            ? `📱 **WeChat QR Code (Chinese Service):** [Click to View QR Code](${wechatMethod.qrCode})\n\n📋 **Step-by-step guide:**\n1. Click the link above\n2. View QR code in your browser\n3. Scan the QR code with your phone\n4. Add us on WeChat and chat in Chinese!\n\n💡 Contact ID: ${wechatMethod.value || 'Available via QR code'}`
            : locale === 'ko'
            ? `📱 **WeChat QR 코드 (중국어 서비스):** [QR 코드 보기](${wechatMethod.qrCode})\n\n📋 **단계별 가이드:**\n1. 위 링크를 클릭하세요\n2. 브라우저에서 QR 코드 확인\n3. 휴대폰으로 QR 코드를 스캔하세요\n4. WeChat에서 저희를 추가하고 중국어로 채팅하세요!\n\n💡 연락처 ID: ${wechatMethod.value || 'QR 코드로 확인 가능'}`
            : `📱 **微信二维码 (中文服务)：** [点击查看二维码](${wechatMethod.qrCode})\n\n📋 **详细步骤：**\n1. 点击上方链接\n2. 在浏览器中查看二维码\n3. 用手机扫描二维码\n4. 添加我们的微信开始中文对话！\n\n💡 联系ID：${wechatMethod.value || '通过二维码获取'}`;
        } else {
          return locale === 'en'
            ? "❌ WeChat QR code is not available at the moment. Please try other contact methods."
            : locale === 'ko'
            ? "❌ WeChat QR 코드를 현재 사용할 수 없습니다. 다른 연락 방법을 시도해보세요."
            : "❌ 微信二维码暂不可用，请尝试其他联系方式。";
        }
      }
      
      // WhatsApp相关的各种表达方式
      if (message.includes('whatsapp') || message.includes('whatapp') || 
          message.includes('wa') && message.includes('qr')) {
        const whatsappMethod = contactMethods.find(m => m.type.toLowerCase() === 'whatsapp');
        if (whatsappMethod && whatsappMethod.qrCode) {
          return locale === 'en'
            ? `📱 **WhatsApp QR Code (Multi-language Support):** [Click to View QR Code](${whatsappMethod.qrCode})\n\n📋 **Step-by-step guide:**\n1. Click the link above\n2. View QR code in your browser\n3. Scan the QR code with your phone\n4. Add us on WhatsApp and chat in your preferred language!\n\n💡 We support: English, Chinese, Thai, Korean`
            : locale === 'ko'
            ? `📱 **WhatsApp QR 코드 (다국어 지원):** [QR 코드 보기](${whatsappMethod.qrCode})\n\n📋 **단계별 가이드:**\n1. 위 링크를 클릭하세요\n2. 브라우저에서 QR 코드 확인\n3. 휴대폰으로 QR 코드를 스캔하세요\n4. WhatsApp에서 저희를 추가하고 원하는 언어로 채팅하세요!\n\n💡 지원 언어: 영어, 중국어, 태국어, 한국어`
            : `📱 **WhatsApp二维码 (多语言支持)：** [点击查看二维码](${whatsappMethod.qrCode})\n\n📋 **详细步骤：**\n1. 点击上方链接\n2. 在浏览器中查看二维码\n3. 用手机扫描二维码\n4. 添加我们的WhatsApp用您喜欢的语言聊天！\n\n💡 支持语言：英文、中文、泰文、韩文`;
        } else {
          return locale === 'en'
            ? "❌ WhatsApp QR code is not available at the moment. Please try other contact methods."
            : locale === 'ko'
            ? "❌ WhatsApp QR 코드를 현재 사용할 수 없습니다. 다른 연락 방법을 시도해보세요."
            : "❌ WhatsApp二维码暂不可用，请尝试其他联系方式。";
        }
      }
      
      return locale === 'en'
        ? "ℹ️ I can help you get QR codes! Try saying:\n• \"WeChat QR\" or \"微信二维码\"\n• \"WhatsApp QR\"\n• \"Show me QR codes\"\n\nOr scroll up to see all contact methods in the welcome message."
        : locale === 'ko'
        ? "ℹ️ QR 코드를 도와드릴 수 있습니다! 다음과 같이 말해보세요:\n• \"WeChat QR\" 또는 \"미시늄 QR\"\n• \"WhatsApp QR\"\n• \"QR 코드 보여줘\"\n\n또는 위로 스크롤하여 환영 메시지에서 모든 연락 방법을 확인하세요."
        : "ℹ️ 我可以帮您获取二维码！您可以说：\n• \"微信二维码\" 或 \"WeChat QR\"\n• \"WhatsApp二维码\"\n• \"显示二维码\"\n\n或者向上滚动查看欢迎消息中的所有联系方式。";
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

  // 生成动态欢迎消息
  const generateWelcomeMessage = () => {
    let baseMessage = "";
    if (locale === 'en') {
      baseMessage = "👋 **Welcome to Thai Massage Center!**\n\n🌟 **Professional Thai Massage Services**\n• Traditional Thai Massage - Muscle tension relief\n• Oil Massage - Deep relaxation experience\n• Foot Massage - Fatigue relief\n• Expert therapists with rich experience\n\n";
    } else if (locale === 'ko') {
      baseMessage = "👋 **태국 마사지 센터에 오신 것을 환영합니다!**\n\n🌟 **전문 태국 마사지 서비스**\n• 전통 태국 마사지 - 근육 긴장 완화\n• 오일 마사지 - 깊은 휴식 경험\n• 발 마사지 - 피로 해소\n• 풍부한 경험을 가진 전문 테라피스트\n\n";
    } else {
      baseMessage = "👋 **欢迎来到泰式按摩中心！**\n\n🌟 **专业泰式按摩服务**\n• 传统泰式按摩 - 缓解肌肉紧张\n• 精油按摩 - 深度放松体验\n• 足部按摩 - 缓解疲劳\n• 经验丰富的专业技师\n\n";
    }

    let contactSection = "";
    
    // 动态生成联系方式部分
    if (contactMethods.length > 0) {
      if (locale === 'en') {
        contactSection = "📞 **Direct Contact**\n";
      } else if (locale === 'ko') {
        contactSection = "📞 **직접 연락**\n";
      } else {
        contactSection = "📞 **直接联系方式**\n";
      }

      contactMethods.forEach(method => {
        const methodType = method.type;
        
        if (method.type.toLowerCase() === 'line' && method.value) {
          // 使用与欢迎消息相同的Line URL生成逻辑
          let linkUrl = '';
          if (method.value?.startsWith('http')) {
            linkUrl = method.value;
          } else if (method.value?.startsWith('@')) {
            linkUrl = `https://line.me/ti/p/${method.value}`;
          } else {
            linkUrl = `https://line.me/ti/p/@${method.value}`;
          }
          
          if (locale === 'en') {
            contactSection += `🟢 **Line**: [Click to Contact](${linkUrl}) - Instant booking confirmation\n`;
          } else if (locale === 'ko') {
            contactSection += `🟢 **Line**: [클릭하여 연락](${linkUrl}) - 즉시 예약 확인\n`;
          } else {
            contactSection += `🟢 **Line**: [点击联系](${linkUrl}) - 即时预约确认\n`;
          }
        } else if (method.type.toLowerCase() === 'telegram' && method.value) {
          const telegramUrl = `https://t.me/${method.value}`;
          if (locale === 'en') {
            contactSection += `✈️ **Telegram**: [Click to Contact](${telegramUrl}) - Secure & convenient\n`;
          } else if (locale === 'ko') {
            contactSection += `✈️ **Telegram**: [클릭하여 연락](${telegramUrl}) - 안전하고 편리\n`;
          } else {
            contactSection += `✈️ **Telegram**: [点击联系](${telegramUrl}) - 安全便捷\n`;
          }
        } else if (method.type.toLowerCase() === 'wechat' && method.qrCode) {
          // 为微信显示简短的可点击链接
          if (locale === 'en') {
            contactSection += `💬 **WeChat** (Chinese service): [Click to View QR Code](${method.qrCode}) - Scan to add us\n`;
          } else if (locale === 'ko') {
            contactSection += `💬 **WeChat** (중국어 서비스): [QR 코드 보기](${method.qrCode}) - 스캔하여 추가\n`;
          } else {
            contactSection += `💬 **微信** (中文服务): [点击查看二维码](${method.qrCode}) - 扫码添加\n`;
          }
        } else if (method.type.toLowerCase() === 'whatsapp' && method.qrCode) {
          // 为WhatsApp显示简短的可点击链接
          if (locale === 'en') {
            contactSection += `📱 **WhatsApp** (Multi-language support): [Click to View QR Code](${method.qrCode}) - Scan to add us\n`;
          } else if (locale === 'ko') {
            contactSection += `📱 **WhatsApp** (다국어 지원): [QR 코드 보기](${method.qrCode}) - 스캔하여 추가\n`;
          } else {
            contactSection += `📱 **WhatsApp** (多语言支持): [点击查看二维码](${method.qrCode}) - 扫码添加\n`;
          }
        }
      });
      contactSection += "\n";
    }

    // AI助手说明和结尾
    let aiSection = "";
    if (locale === 'en') {
      aiSection = `🤖 **AI Booking Assistant**
I can help you: View services, Check therapist info, Booking consultation

💡 **How to use contact methods:**
• Line/Telegram: Click links to chat directly
• WeChat/WhatsApp: Click QR links to view and scan
• Ask me for specific contact assistance

🔧 **What I can help with:**
• Service information and pricing
• Therapist availability and specialties  
• Booking appointments and time slots
• Contact method assistance

Just tell me what you need!`;
    } else if (locale === 'ko') {
      aiSection = `🤖 **AI 예약 어시스턴트**
도움 가능한 것: 서비스 보기, 테라피스트 정보, 예약 상담

💡 **연락 방법 사용법:**
• Line/Telegram: 링크를 클릭하여 바로 채팅
• WeChat/WhatsApp: QR 링크를 클릭하여 보기 및 스캔
• 특정 연락 지원이 필요하면 요청하세요

🔧 **도움 가능한 것들:**
• 서비스 정보 및 가격
• 테라피스트 가용성 및 전문 분야
• 예약 및 시간대
• 연락 방법 지원

필요한 것을 말씀해 주세요!`;
    } else {
      aiSection = `🤖 **AI预约助手**
我可以帮您：查看服务详情、了解技师信息、预约时间咨询

💡 **联系方式使用方法：**
• Line/Telegram：点击链接直接聊天
• 微信/WhatsApp：点击二维码链接查看扫码
• 需要特定联系帮助请直接问我

🔧 **我能协助的内容：**
• 服务项目信息和价格
• 技师档期和专业特长
• 预约时间安排
• 联系方式帮助

直接告诉我您的需求！`;
    }

    return baseMessage + contactSection + aiSection;
  };

  // 渲染不同的UI组件
  const renderCopilotUI = () => {
    const commonProps = {
      instructions: t('instructions'),
      labels: {
        title: t('title'),
        initial: generateWelcomeMessage(),
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
      
      {/* QR modal removed - now using URL display in chat */}
      
      {/* 预约助手弹窗样式 */}
      <style jsx global>{`
        /* 预约助手弹窗基础定位 - 右侧醒目位置 */
        .booking-assistant-popup {
          position: fixed !important;
          bottom: 80px !important;
          right: 30px !important;
          z-index: 999999 !important;
          width: auto !important;
          height: auto !important;
        }

        /* 桌面端样式 - 更大更醒目 */
        @media (min-width: 769px) {
          .booking-assistant-popup {
            bottom: 100px !important;
            right: 40px !important;
            max-width: 420px !important;
            max-height: 650px !important;
          }
          
          /* 桌面端触发按钮更大 */
          .booking-assistant-popup button[data-state="closed"] {
            width: 70px !important;
            height: 70px !important;
          }
        }

        /* 平板端样式 */
        @media (min-width: 481px) and (max-width: 768px) {
          .booking-assistant-popup {
            bottom: 60px !important;
            right: 25px !important;
            max-width: 380px !important;
            max-height: 60vh !important;
          }
        }

        /* 移动端样式 - 右侧定位但不占满宽，留出底部联系栏空间 */
        @media (max-width: 480px) {
          .booking-assistant-popup {
            bottom: 70px !important; /* 在联系栏上方 */
            right: 20px !important;
            max-width: 320px !important;
            max-height: 60vh !important; /* 减少高度为联系栏留空间 */
            /* 移除left定位，保持右侧对齐 */
          }
          
          /* 移动端触发按钮适中大小 */
          .booking-assistant-popup button[data-state="closed"] {
            width: 65px !important;
            height: 65px !important;
          }
        }

        /* 超小屏移动端 */
        @media (max-width: 375px) {
          .booking-assistant-popup {
            bottom: 65px !important; /* 在联系栏上方 */
            right: 15px !important;
            max-width: 280px !important;
            max-height: 55vh !important; /* 进一步减少高度 */
          }
          
          .booking-assistant-popup button[data-state="closed"] {
            width: 60px !important;
            height: 60px !important;
          }
        }

        /* 弹窗内容区域样式 - 增强视觉效果 */
        .booking-assistant-popup [role="dialog"] {
          border-radius: 16px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
          border: 2px solid #e5e7eb !important;
          backdrop-filter: blur(8px) !important;
          background: rgba(255, 255, 255, 0.95) !important;
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

        /* 触发按钮样式 - 更醒目的设计 */
        .booking-assistant-popup button[data-state="closed"] {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
          color: white !important;
          border-radius: 50% !important;
          width: 60px !important;
          height: 60px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4), 0 10px 15px rgba(0, 0, 0, 0.1) !important;
          border: 3px solid rgba(255, 255, 255, 0.2) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          animation: pulse-ring 2s infinite;
        }

        /* 触发按钮悬浮效果 - 更丰富的交互 */
        .booking-assistant-popup button[data-state="closed"]:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
          transform: scale(1.1) translateY(-2px) !important;
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.5), 0 15px 25px rgba(0, 0, 0, 0.15) !important;
        }

        /* 添加脉动动画效果 */
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4), 0 10px 15px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4), 0 10px 15px rgba(0, 0, 0, 0.1), 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4), 0 10px 15px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        /* 触发按钮图标样式 */
        .booking-assistant-popup button[data-state="closed"] svg {
          width: 24px !important;
          height: 24px !important;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        `}</style>
    </div>
  );
};

// 不再提供包装组件，直接导出主组件
// 由页面级别统一管理CopilotKit上下文
export default BookingAssistant;
export { BookingAssistant };