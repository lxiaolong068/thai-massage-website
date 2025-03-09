'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type ServicesProps = {
  locale?: string;
};

const Services = ({ locale = 'en' }: ServicesProps) => {
  // 使用 next-intl 的 useTranslations 钩子获取翻译
  const t = useTranslations('services');
  const commonT = useTranslations('common');
  
  return (
    <section className="section-container section-light" id="services">
      <div className="container">
        <h2 className="section-title text-center mb-4 text-black">
          {t('title')}
        </h2>
        <p className="text-gray-800 text-center mb-12">
          {t('subtitle')}
        </p>
        
        <div className="grid-responsive">
          {/* Traditional Thai Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/traditional-thai-new.jpg"
                alt={t('traditional.title')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('traditional.title')}</h3>
              <p className="text-gray-800 mb-4">
                {t('traditional.description')}
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Neck & Shoulder */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/neck-shoulder-new.jpg"
                alt={t('neck.title')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('neck.title')}</h3>
              <p className="text-gray-800 mb-4">
                {t('neck.description')}
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Oil Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/oil-massage-new.jpg"
                alt={t('oil.title')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('oil.title')}</h3>
              <p className="text-gray-800 mb-4">
                {t('oil.description')}
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Aromatherapy Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/aromatherapy-massage.jpg"
                alt={t('aromatherapy.title')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('aromatherapy.title')}</h3>
              <p className="text-gray-800 mb-4">
                {t('aromatherapy.description')}
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deep Tissue Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/deep-tissue-new.jpg"
                alt={t('deep.title')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('deep.title')}</h3>
              <p className="text-gray-800 mb-4">
                {t('deep.description')}
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Foot Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/foot-massage.jpg"
                alt={t('foot.title')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('foot.title')}</h3>
              <p className="text-gray-800 mb-4">
                {t('foot.description')}
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Book Now 按钮 */}
        <div className="mt-12 text-center">
          <Link 
            href={`/${locale}/therapists`} 
            className="primary-button inline-flex items-center"
          >
            {commonT('buttons.bookNow')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services; 