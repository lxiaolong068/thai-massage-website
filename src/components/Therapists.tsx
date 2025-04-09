'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useImprovedTranslator } from '@/i18n/improved-client';
import BookingForm from './BookingForm';
import { getTranslations } from 'next-intl/server'; // Corrected import
import prisma from '@/lib/prisma';
import { Therapist, TherapistStatus, TherapistTranslation } from '@prisma/client'; // Import necessary types
import TherapistCardWrapper from './TherapistCardWrapper'; // NOTE: This component needs to be created

// 内置的Modal组件
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 关闭模态框的键盘事件处理
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // 恢复滚动
    };
  }, [isOpen, onClose]);
  
  // 点击外部关闭模态框
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  // 根据尺寸设置宽度类
  const sizeClass = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
  }[size];
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className={`${sizeClass} w-full bg-white rounded-lg shadow-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Define a type for the processed therapist data
type ProcessedTherapist = {
  id: string;
  imageUrl: string | null;
  experienceYears: number;
  workStatus: TherapistStatus;
  // Add other non-translated fields from Therapist model if needed
  name: string; // Translated name
  bio: string;  // Translated bio
  // specialties removed for now due to schema uncertainty
};

// Define type for Therapist with specific translations included
type TherapistWithTranslations = Therapist & {
  translations: Pick<TherapistTranslation, 'locale' | 'name' | 'bio'>[]; // Select only needed fields
};

type TherapistsProps = {
  locale: string;
};

const Therapists = async ({ locale }: TherapistsProps) => {
  // Correct usage: Provide namespace, locale is inferred or explicitly passed
  const t = await getTranslations('therapists');
  const commonT = await getTranslations('common');

  let therapists: ProcessedTherapist[] = [];
  try {
    // Use `include` to fetch the full Therapist object and related translations
    const fetchedTherapists: TherapistWithTranslations[] = await prisma.therapist.findMany({
      where: {
        // Use WORKING based on previous error message
        workStatus: TherapistStatus.WORKING,
      },
      include: { // Use include instead of select here
        translations: {
          where: {
            locale: locale,
          },
          select: { // Select only needed fields from the translation
            locale: true,
            name: true,
            bio: true,
            // specialties removed for now
          },
        },
      },
      // No top-level select needed when using include for the full object
      // Removed orderBy as 'order' field seems incorrect
    });

    // Map fetched data to the ProcessedTherapist type
    therapists = fetchedTherapists.map((therapist): ProcessedTherapist => {
      // Find the correct translation for the current locale
      const translation = therapist.translations.find((tr: { locale: string }) => tr.locale === locale);
      return {
        // Base fields
        id: therapist.id,
        imageUrl: therapist.imageUrl,
        experienceYears: therapist.experienceYears,
        workStatus: therapist.workStatus,
        // Translated fields with fallbacks
        name: translation?.name ?? 'Name unavailable',
        bio: translation?.bio ?? 'Bio unavailable',
        // specialties removed
      };
    });

  } catch (error) {
    console.error("Failed to fetch therapists:", error);
    therapists = [];
  }

  const clientTranslations = {
    bookNow: commonT('buttons.bookNow'), // Assuming fallback is in common.json
    bookingModalTitle: t('bookingModal.title'), // Assuming fallback is in therapists.json
    therapistAltText: t('therapist'), // Assuming fallback is in therapists.json
  };

  return (
    <section className="section-container section-light py-16 md:py-24" id="therapists">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-4 text-gray-900">
          {t('title')}
        </h2>
        <p className="text-gray-700 text-center mb-12 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        {therapists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {therapists.map((therapist) => (
              <TherapistCardWrapper
                key={therapist.id}
                therapist={therapist} // Pass the processed data
                locale={locale}
                translations={clientTranslations}
              />
            ))}
          </div>
        ) : (
           <p className="text-center text-gray-600">{t('noTherapists')}</p>
        )}

        {/* Static "Why Choose Us" section */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
           <h3 className="text-2xl font-semibold text-center text-gray-900 mb-8">{t('whyChoose.title')}</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="text-center">
               <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gold-100 text-gold-600">
                 {/* Placeholder for Icon */}
               </div>
               <h4 className="text-lg font-semibold mb-2 text-gray-900">{t('whyChoose.certified.title')}</h4>
               <p className="text-gray-600">
                 {t('whyChoose.certified.description')}
               </p>
             </div>
             <div className="text-center">
               <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gold-100 text-gold-600">
                  {/* Placeholder for Icon */}
               </div>
               <h4 className="text-lg font-semibold mb-2 text-gray-900">{t('whyChoose.personalized.title')}</h4>
               <p className="text-gray-600">
                 {t('whyChoose.personalized.description')}
               </p>
             </div>
             <div className="text-center">
               <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gold-100 text-gold-600">
                 {/* Placeholder for Icon */}
               </div>
               <h4 className="text-lg font-semibold mb-2 text-gray-900">{t('whyChoose.punctual.title')}</h4>
               <p className="text-gray-600">
                 {t('whyChoose.punctual.description')}
               </p>
             </div>
           </div>
         </div>
      </div>
    </section>
  );
};

export default Therapists; 