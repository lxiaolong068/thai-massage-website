'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Phone, X } from 'lucide-react';
import Link from 'next/link';

interface ContactMethod {
  id: string;
  type: string;
  value: string;
  qrCode: string;
}

const MobileContactBar: React.FC = () => {
  const t = useTranslations('booking');
  const [isExpanded, setIsExpanded] = useState(false);
  const [methods, setMethods] = useState<ContactMethod[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod | null>(null);

  useEffect(() => {
    const fetchContactMethods = async () => {
      try {
        const response = await fetch('/api/v1/public/contact-methods');
        if (!response.ok) {
          throw new Error('Failed to fetch contact methods');
        }
        const data = await response.json();
        if (data.success) {
          setMethods(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchContactMethods();
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const showQRCode = (method: ContactMethod) => {
    setSelectedMethod(method);
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedMethod(null);
  };

  const getContactLink = (method: ContactMethod): string => {
    const value = (method.value || '').trim();
    switch (method.type.toLowerCase()) {
      case 'line':
        // 确保只取 ID 部分
        const lineId = value.split('/').pop() || '';
        return `https://line.me/ti/p/~${lineId.replace('~', '')}`;
      case 'telegram':
        return `https://t.me/${value}`;
      case 'whatsapp':
        return `https://wa.me/${value.replace(/\D/g, '')}`;
      case 'wechat':
        return '#'; // 微信通常是扫码，没有直接链接
      default:
        return '#';
    }
  };

  const lineMethod = methods.find(m => m.type.toLowerCase() === 'line');
  const telegramMethod = methods.find(m => m.type.toLowerCase() === 'telegram');
  const wechatMethod = methods.find(m => m.type.toLowerCase() === 'wechat');
  const whatsappMethod = methods.find(m => m.type.toLowerCase() === 'whatsapp');

  if (methods.length === 0) {
    return null; // 或者可以显示一个加载指示器
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-transparent pointer-events-none">
      {isExpanded ? (
        <div className="pointer-events-auto bg-white/75 backdrop-blur-sm rounded-t-lg shadow-lg p-3 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{t('contact.contactUs')}</h3>
            <button 
              onClick={toggleExpand}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {lineMethod && (
              <a href={getContactLink(lineMethod)} target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white rounded-lg text-center border hover:border-[#06C755] transition-colors">
                  <div className="bg-[#06C755] text-white py-1 rounded-t-md">
                    <h4 className="text-xs font-semibold">LINE</h4>
                  </div>
                  <div className="relative w-full h-16 p-1">
                    <Image src={lineMethod.qrCode} alt="LINE QR Code" fill className="object-contain" />
                  </div>
                </div>
              </a>
            )}
            {telegramMethod && (
              <a href={getContactLink(telegramMethod)} target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white rounded-lg text-center border hover:border-[#0088cc] transition-colors">
                  <div className="bg-[#0088cc] text-white py-1 rounded-t-md">
                    <h4 className="text-xs font-semibold">Telegram</h4>
                  </div>
                  <div className="relative w-full h-16 p-1">
                    <Image src={telegramMethod.qrCode} alt="Telegram QR Code" fill className="object-contain" />
                  </div>
                </div>
              </a>
            )}
            {wechatMethod && (
              <button onClick={() => showQRCode(wechatMethod)} className="block w-full">
                <div className="bg-white rounded-lg text-center border hover:border-[#07C160] transition-colors">
                  <div className="bg-[#07C160] text-white py-1 rounded-t-md">
                    <h4 className="text-xs font-semibold">WeChat</h4>
                  </div>
                  <div className="relative w-full h-16 p-1">
                    <Image src={wechatMethod.qrCode} alt="WeChat QR Code" fill className="object-contain" />
                  </div>
                </div>
              </button>
            )}
            {whatsappMethod && (
              <button onClick={() => showQRCode(whatsappMethod)} className="block w-full">
                <div className="bg-white rounded-lg text-center border hover:border-[#25D366] transition-colors">
                  <div className="bg-[#25D366] text-white py-1 rounded-t-md">
                    <h4 className="text-xs font-semibold">WhatsApp</h4>
                  </div>
                  <div className="relative w-full h-16 p-1">
                    <Image src={whatsappMethod.qrCode} alt="WhatsApp QR Code" fill className="object-contain" />
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="pointer-events-auto flex w-full divide-x divide-gray-300 border-t border-gray-300 bg-white/75 backdrop-blur-sm shadow-lg">
          {lineMethod && (
            <a 
              href={getContactLink(lineMethod)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 py-3 flex items-center justify-center gap-1 text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" fill="#06C755">
                <path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"/>
              </svg>
            </a>
          )}
          {telegramMethod && (
            <a 
              href={getContactLink(telegramMethod)}
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 py-3 flex items-center justify-center gap-1 text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 496 512" fill="#0088cc">
                <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"/>
              </svg>
            </a>
          )}
          {wechatMethod && (
            <button 
              onClick={() => showQRCode(wechatMethod)}
              className="flex-1 py-3 flex items-center justify-center gap-1 text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024" fill="#07C160">
                <path d="M690.1 377.4c5.9 0 11.8.2 17.6.5-24.4-128.7-158.3-227.1-319.9-227.1C209 150.8 64 271.4 64 420.2c0 81.1 43.6 154.2 111.9 203.6a21.5 21.5 0 0 1 9.1 17.6c0 2.4-.5 4.6-1.1 6.9-5.5 20.3-14.2 52.8-14.6 54.3-.7 2.6-1.7 5.2-1.7 7.9 0 5.9 4.8 10.8 10.8 10.8 2.3 0 4.2-.9 6.2-2l70.9-40.9c5.3-3.1 11-5 17.2-5 3.2 0 6.4.5 9.5 1.4 33.1 9.5 68.8 14.8 105.7 14.8 6 0 11.9-.1 17.8-.4-7.1-21-10.9-43.1-10.9-66 0-135.8 132.2-245.8 295.3-245.8zm-194.3-86.5c23.8 0 43.2 19.3 43.2 43.1s-19.3 43.1-43.2 43.1c-23.8 0-43.2-19.3-43.2-43.1s19.4-43.1 43.2-43.1zm-215.9 86.2c-23.8 0-43.2-19.3-43.2-43.1s19.3-43.1 43.2-43.1 43.2 19.3 43.2 43.1-19.4 43.1-43.2 43.1zm586.8 415.6c56.9-41.2 93.2-102 93.2-169.7 0-124-120.8-224.5-269.9-269.9-149 0-269.9 100.5-269.9 224.5S540.9 847.5 690 847.5c30.8 0 60.6-4.4 88.1-12.3 2.6-.8 5.2-1.2 7.9-1.2 5.2 0 9.9 1.6 14.3 4.1l59.1 34c1.7 1 3.3 1.7 5.2 1.7a9 9 0 0 0 6.4-2.6 9 9 0 0 0 2.6-6.4c0-2.2-.9-4.4-1.4-6.6-.3-1.2-7.6-28.3-12.2-45.3-.5-1.9-.9-3.8-.9-5.7.1-5.9 3.1-11.2 7.6-14.5zM600.2 587.2c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9c0 19.8-16.2 35.9-36 35.9zm179.9 0c-19.9 0-36-16.1-36-35.9 0-19.8 16.1-35.9 36-35.9s36 16.1 36 35.9a36.08 36.08 0 0 1-36 35.9z"/>
              </svg>
            </button>
          )}
          {whatsappMethod && (
            <button 
              onClick={() => showQRCode(whatsappMethod)}
              className="flex-1 py-3 flex items-center justify-center gap-1 text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" fill="#25D366">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative">
            <button 
              onClick={closeQRModal}
              className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {selectedMethod.type} QR Code
              </h3>
              
              <div className="relative w-64 h-64 mx-auto mb-4">
                <Image 
                  src={selectedMethod.qrCode} 
                  alt={`${selectedMethod.type} QR Code`} 
                  fill 
                  className="object-contain"
                />
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {selectedMethod.type.toLowerCase() === 'wechat' 
                  ? 'Scan this QR code with WeChat to add us'
                  : selectedMethod.type.toLowerCase() === 'whatsapp'
                  ? 'Scan this QR code with WhatsApp to chat with us'
                  : `Scan this QR code with ${selectedMethod.type}`
                }
              </p>
              
              {/* Alternative action button */}
              {selectedMethod.type.toLowerCase() === 'whatsapp' && (
                <a 
                  href={getContactLink(selectedMethod)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#20C65C] transition-colors"
                >
                  Open WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileContactBar;
