'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// 服务数据类型
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
}

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => {
  const t = useTranslations('booking');
  
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer
        ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200 hover:border-primary-light'}`}
      onClick={() => onSelect(service)}
    >
      <div className="relative h-48 w-full">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">无图片</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">{t('serviceSelection.duration')}</p>
            <p className="font-semibold">{service.duration} {t('serviceSelection.minutes')}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">{t('serviceSelection.price')}</p>
            <p className="font-semibold text-primary">¥{service.price}</p>
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-1 bg-primary text-white text-sm rounded-full">
              {t('serviceSelection.selectButton')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
