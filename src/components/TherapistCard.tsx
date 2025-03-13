'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// 按摩师数据类型
export interface Therapist {
  id: string;
  name: string;
  bio: string;
  experience: number;
  specialties: string[];
  imageUrl?: string;
}

interface TherapistCardProps {
  therapist: Therapist;
  isSelected: boolean;
  onSelect: (therapist: Therapist) => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, isSelected, onSelect }) => {
  const t = useTranslations('booking');
  
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md cursor-pointer
        ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200 hover:border-primary-light'}`}
      onClick={() => onSelect(therapist)}
    >
      <div className="relative h-56 w-full">
        {therapist.imageUrl ? (
          <Image
            src={therapist.imageUrl}
            alt={therapist.name}
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
        <h3 className="font-bold text-lg mb-2">{therapist.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{therapist.bio}</p>
        
        <div className="mb-3">
          <p className="text-gray-500 text-sm">{t('therapistSelection.experience')}</p>
          <p className="font-semibold">{therapist.experience} {t('therapistSelection.years')}</p>
        </div>
        
        <div>
          <p className="text-gray-500 text-sm">{t('therapistSelection.specialties')}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {therapist.specialties.map((specialty, index) => (
              <span 
                key={index} 
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-1 bg-primary text-white text-sm rounded-full">
              {t('therapistSelection.selectButton')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistCard;
