'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TherapistStatus } from '@prisma/client';
import BookingModal from './BookingModal';

type TherapistProps = {
  therapist: {
    id: string;
    imageUrl: string | null;
    experienceYears: number;
    workStatus: TherapistStatus;
    name: string;
    bio: string;
  };
  locale: string;
  translations: {
    bookNow: string;
    bookingModalTitle: string;
    therapistAltText: string;
  };
};

export default function TherapistCardWrapper({ therapist, locale, translations }: TherapistProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBooking = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 w-full">
          <Image
            src={therapist.imageUrl || '/images/placeholder-therapist.jpg'}
            alt={`${translations.therapistAltText} ${therapist.name}`}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-therapist.jpg';
            }}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{therapist.name}</h3>
          <p className="text-gray-600 mb-4">{therapist.bio}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {therapist.experienceYears} {translations.therapistAltText === '按摩师' ? '年经验' : 'years experience'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              therapist.workStatus === 'AVAILABLE' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {therapist.workStatus === 'AVAILABLE' 
                ? (translations.therapistAltText === '按摩师' ? '在线' : 'Available')
                : (translations.therapistAltText === '按摩师' ? '忙碌' : 'Busy')}
            </span>
          </div>
          <button
            onClick={handleBooking}
            disabled={therapist.workStatus !== 'AVAILABLE'}
            className={`mt-4 w-full py-2 px-4 rounded-md text-white transition-colors ${
              therapist.workStatus === 'AVAILABLE'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {translations.bookNow}
          </button>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        therapist={therapist}
        locale={locale}
        title={translations.bookingModalTitle}
      />
    </>
  );
} 