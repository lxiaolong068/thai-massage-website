'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ContactQRCodesProps {
  bookingId: string | null;
}

const ContactQRCodes: React.FC<ContactQRCodesProps> = ({ bookingId }) => {
  const t = useTranslations('booking');
  const [copiedId, setCopiedId] = useState(false);

  // 复制订单号到剪贴板
  const copyBookingId = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{t('contact.title')}</h3>
      <p className="text-gray-600 mb-6">{t('contact.description')}</p>

      {bookingId && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 mb-2">{t('contact.bookingIdLabel')}</p>
          <div className="flex items-center">
            <code className="bg-white px-4 py-2 rounded border flex-1 font-mono">{bookingId}</code>
            <button
              onClick={copyBookingId}
              className="ml-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {copiedId ? t('contact.copied') : t('contact.copy')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* LINE */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="bg-[#06C755] text-white py-2 rounded-t-md mb-4">
            <h4 className="font-semibold">LINE</h4>
          </div>
          <div className="relative w-full h-64 mb-3">
            <Image 
              src="/images/line-qr-1.png" 
              alt="LINE QR Code" 
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600">{t('contact.scanToChat')}</p>
        </div>

        {/* WeChat */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="bg-[#07C160] text-white py-2 rounded-t-md mb-4">
            <h4 className="font-semibold">WeChat</h4>
          </div>
          <div className="relative w-full h-64 mb-3">
            <Image 
              src="/images/wechat-qr.jpg" 
              alt="WeChat QR Code" 
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600">{t('contact.scanToChat')}</p>
        </div>

        {/* Telegram */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="bg-[#0088cc] text-white py-2 rounded-t-md mb-4">
            <h4 className="font-semibold">Telegram</h4>
          </div>
          <div className="relative w-full h-64 mb-3">
            <Image 
              src="/images/tg-qr.jpg" 
              alt="Telegram QR Code" 
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600">{t('contact.scanToChat')}</p>
        </div>

        {/* WhatsApp */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="bg-[#25D366] text-white py-2 rounded-t-md mb-4">
            <h4 className="font-semibold">WhatsApp</h4>
          </div>
          <div className="relative w-full h-64 mb-3">
            <Image 
              src="/images/whatsapp-qr.png" 
              alt="WhatsApp QR Code" 
              fill
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600">{t('contact.scanToChat')}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactQRCodes; 