'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useImprovedTranslator } from '@/i18n/improved-client';

type ServicesProps = {
  locale?: string;
};

const Services = ({ locale = 'en' }: ServicesProps) => {
  // 使用 useImprovedTranslator 钩子获取翻译
  const { t } = useImprovedTranslator(locale, 'services');
  const { t: commonT } = useImprovedTranslator(locale, 'common');
  
  return (
    <section className="section-container section-light" id="services">
      <div className="container">
        <h2 className="section-title text-center mb-4 text-black">
          {t('title', '我们的服务')}
        </h2>
        <p className="text-gray-800 text-center mb-12">
          {t('subtitle', '我们提供多种专业泰式按摩服务，满足您的不同需求。')}
        </p>
        
        <div className="grid-responsive">
          {/* Traditional Thai Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/traditional-thai-new.jpg"
                alt={t('traditional.title', '传统泰式按摩')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('traditional.title', '传统泰式按摩')}</h3>
              <p className="text-gray-800 mb-4">
                {t('traditional.description', '传统泰式按摩结合了特殊的按摩技巧和缓慢的运动，帮助放松身体和改善血液循环。')}
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
                alt={t('neck.title', '颈肩按摩')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('neck.title', '颈肩按摩')}</h3>
              <p className="text-gray-800 mb-4">
                {t('neck.description', '专注于颈部和肩部区域，缓解因长时间使用电脑或手机导致的疲劳和疼痛。')}
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
                alt={t('oil.title', '精油按摩')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('oil.title', '精油按摩')}</h3>
              <p className="text-gray-800 mb-4">
                {t('oil.description', '使用特制按摩油，通过滑润的手法帮助放松肉肉，改善血液循环和皮肤质量。')}
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
                alt={t('aromatherapy.title', '香薄疗法按摩')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('aromatherapy.title', '香薄疗法按摩')}</h3>
              <p className="text-gray-800 mb-4">
                {t('aromatherapy.description', '结合精油按摩和芳香精油，通过吸入芳香和皮肤吸收来帮助放松身心。')}
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
                alt={t('deep.title', '深层组织按摩')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('deep.title', '深层组织按摩')}</h3>
              <p className="text-gray-800 mb-4">
                {t('deep.description', '采用强度较大的按摩手法，针对深层肉肉和结缔组织，缓解慢性疼痛和紧张。')}
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
                alt={t('foot.title', '足部按摩')}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">{t('foot.title', '足部按摩')}</h3>
              <p className="text-gray-800 mb-4">
                {t('foot.description', '通过按摩足部的反射区，帮助放松整个身体，缓解疲劳和改善血液循环。')}
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
            {commonT('buttons.bookNow', '立即预约')}
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