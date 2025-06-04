'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface ContactQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactType: string;
  qrCodeUrl: string;
  contactValue?: string;
  locale?: string;
}

const ContactQRModal: React.FC<ContactQRModalProps> = ({
  isOpen,
  onClose,
  contactType,
  qrCodeUrl,
  contactValue,
  locale = 'zh'
}) => {
  const t = useTranslations('booking');
  
  const getContactTitle = () => {
    switch (locale) {
      case 'en':
        return `Contact us via ${contactType}`;
      case 'ko':
        return `${contactType}으로 연락하기`;
      default:
        return `通过${contactType}联系我们`;
    }
  };

  const getScanInstruction = () => {
    switch (locale) {
      case 'en':
        return `Please scan the QR code below to contact us via ${contactType}`;
      case 'ko':
        return `아래 QR 코드를 스캔하여 ${contactType}으로 연락해주세요`;
      default:
        return `请扫描下方二维码通过${contactType}联系我们`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {getContactTitle()}
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-600 text-center">
            {getScanInstruction()}
          </p>
          
          <div className="relative w-64 h-64 bg-white rounded-lg shadow-md p-4">
            {qrCodeUrl ? (
              <Image
                src={qrCodeUrl}
                alt={`${contactType} QR Code`}
                fill
                className="object-contain"
                unoptimized={qrCodeUrl.startsWith('data:') || qrCodeUrl.includes('/uploads/')}
                onError={(e) => {
                  console.error('QR Code image failed to load:', qrCodeUrl);
                  // 如果图片加载失败，显示占位符
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded">
                <p className="text-gray-500 text-sm">
                  {locale === 'en' ? 'QR code not available' : 
                   locale === 'ko' ? 'QR 코드 없음' : '二维码不可用'}
                </p>
              </div>
            )}
            
            {/* 备用显示：如果图片加载失败 */}
            {qrCodeUrl && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded" 
                style={{ display: 'none' }}
                id={`qr-fallback-${contactType}`}
              >
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">
                    {locale === 'en' ? 'Image loading failed' : 
                     locale === 'ko' ? '이미지 로딩 실패' : '图片加载失败'}
                  </p>
                  <p className="text-xs text-gray-500 break-all px-2">
                    {qrCodeUrl}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {contactValue && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">
                {locale === 'en' ? 'Contact ID:' : locale === 'ko' ? '연락처 ID:' : '联系ID：'}
              </p>
              <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {contactValue}
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-500 text-center">
            {locale === 'en' 
              ? 'Take a screenshot or scan directly with your phone camera'
              : locale === 'ko'
              ? '휴대폰 카메라로 직접 스캔하거나 스크린샷을 찍어주세요'
              : '可以直接用手机摄像头扫描或截图保存'
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactQRModal; 