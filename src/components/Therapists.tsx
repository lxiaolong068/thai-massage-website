'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import BookingForm from './BookingForm';

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

type TherapistsProps = {
  locale?: string;
};

const Therapists = ({ locale = 'en' }: TherapistsProps) => {
  // 使用 next-intl 的 useTranslations 钩子获取翻译
  const t = useTranslations('therapists');
  const commonT = useTranslations('common');
  
  // 预约模态框状态
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<{id: number, name: string} | null>(null);
  
  const therapists = [
    {
      id: 1,
      name: 'Somying',
      age: 28,
      measurements: '34/24/36',
      weight: '52 kg',
      height: '165 cm',
      experience: '8 years',
      image: '/images/therapist-1.jpg',
    },
    {
      id: 2,
      name: 'Nattaya',
      age: 32,
      measurements: '36/26/38',
      weight: '55 kg',
      height: '170 cm',
      experience: '10 years',
      image: '/images/therapist-2.jpg',
    },
    {
      id: 3,
      name: 'Pranee',
      age: 25,
      measurements: '32/23/34',
      weight: '48 kg',
      height: '160 cm',
      experience: '7 years',
      image: '/images/therapist-3.jpg',
    },
    {
      id: 4,
      name: 'Malai',
      age: 30,
      measurements: '38/28/40',
      weight: '60 kg',
      height: '175 cm',
      experience: '9 years',
      image: '/images/therapist-4.jpg',
    },
  ];

  return (
    <section className="section-container section-light" id="therapists">
      {/* 预约模态框 */}
      {isBookingModalOpen && selectedTherapist && (
        <Modal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)}
          title={t('bookingModal.title') || '预约按摩服务'}
          size="large"
        >
          <BookingForm 
            initialTherapistId={String(selectedTherapist.id)} 
            initialTherapistName={selectedTherapist.name} 
            inModal={true}
            onComplete={() => setIsBookingModalOpen(false)}
          />
        </Modal>
      )}
      
      <div className="container">
        <h2 className="section-title text-center mb-4 text-black">
          {t('title')}
        </h2>
        <p className="text-gray-800 text-center mb-12">
          {t('subtitle')}
        </p>
        
        <div className="grid-responsive">
          {therapists.map((therapist) => (
            <div key={therapist.id} className="card card-hover">
              <div className="image-container">
                <Image
                  src={therapist.image}
                  alt={`${t('therapist')} ${therapist.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-primary mb-2">{therapist.name}</h3>
                <div className="text-gray-700 mb-4">
                  <p>{t('age')}: {therapist.age}</p>
                  <p>{t('measurements')}: {therapist.measurements}</p>
                  <p>{t('weight')}: {therapist.weight}</p>
                  <p>{t('height')}: {therapist.height}</p>
                  <p>{t('experience')}: {therapist.experience}</p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedTherapist({id: therapist.id, name: therapist.name});
                    setIsBookingModalOpen(true);
                  }}
                  className="block w-full primary-button text-center py-2"
                >
                  {commonT('buttons.bookNow')}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-light p-8 rounded-lg">
          <h3 className="title-lg text-center text-black">{t('whyChoose.title')}</h3>
          <div className="grid-responsive">
            <div className="flex-col-center text-center">
              <div className="icon-circle mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-black">{t('whyChoose.certified.title')}</h4>
              <p className="text-gray-800">
                {t('whyChoose.certified.description')}
              </p>
            </div>
            
            <div className="flex-col-center text-center">
              <div className="icon-circle mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-black">{t('whyChoose.personalized.title')}</h4>
              <p className="text-gray-800">
                {t('whyChoose.personalized.description')}
              </p>
            </div>
            
            <div className="flex-col-center text-center">
              <div className="icon-circle mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-black">{t('whyChoose.punctual.title')}</h4>
              <p className="text-gray-800">
                {t('whyChoose.punctual.description')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/therapists"
            className="primary-button inline-flex items-center"
          >
            {t('viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Therapists; 