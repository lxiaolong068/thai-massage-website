'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TherapistStatus } from '@prisma/client';

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
  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
        <div className="relative h-64 w-full">
          <Image
            src={therapist.imageUrl || '/images/placeholder-therapist.jpg'}
            alt={`${translations.therapistAltText} ${therapist.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-therapist.jpg';
            }}
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-2">{therapist.name}</h3>
          <p className="text-gray-600 mb-4 flex-grow line-clamp-4">{therapist.bio}</p>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
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
          <Link 
            href={`/${locale}/contact`} 
            className={`mt-4 w-full py-2 px-4 rounded-md text-white text-center transition-colors ${
              therapist.workStatus === 'AVAILABLE'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 pointer-events-none opacity-50'
            }`}
            aria-disabled={therapist.workStatus !== 'AVAILABLE'}
            tabIndex={therapist.workStatus !== 'AVAILABLE' ? -1 : undefined}
          >
            {translations.bookNow}
          </Link>
        </div>
      </div>
    </>
  );
} 