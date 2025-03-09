'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface AboutProps {
  locale?: string;
}

const About: React.FC<AboutProps> = ({ locale = 'en' }) => {
  const t = useTranslations('about');
  
  return (
    <section className="section-container section-light" id="about">
      <div className="container">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* 左侧标题、图片和按钮 */}
          <div className="md:w-2/5 mb-8 md:mb-0 relative">
            <h2 className="title-lg text-3xl md:text-4xl leading-tight text-black whitespace-normal">{t('title')}</h2>
            
            {/* 图片放在标题下方 */}
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/victoria-massage.png"
                alt={t('imageAlt')}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            
            <Link 
              href={`/${locale}/contact`}
              className="primary-button inline-flex items-center px-6"
            >
              {t('learnMoreButton')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            {/* 装饰元素 - 使用SVG */}
            <div className="hidden md:block absolute -bottom-20 -left-20 z-0 opacity-20">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0C120 40 160 60 200 60C160 80 140 120 140 160C100 140 60 160 40 200C20 160 0 120 0 100C40 80 60 40 100 0Z" fill="#D4AF37" fillOpacity="0.3"/>
              </svg>
            </div>
          </div>
          
          {/* 右侧内容卡片 */}
          <div className="md:w-3/5 relative z-10">
            {/* 信息卡片 */}
            <div className="space-y-6">
              {/* 卡片1 */}
              <div className="bg-cream rounded-lg p-6 shadow-md relative overflow-hidden">
                <div className="flex items-start">
                  <div className="icon-circle mr-4 flex-shrink-0">
                    <Image 
                      src="/images/icon-1.png" 
                      alt={t('card1.imageAlt')} 
                      width={40} 
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">{t('card1.title')}</h3>
                    <p className="text-gray-700">
                      {t('card1.description')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 卡片2 */}
              <div className="bg-cream rounded-lg p-6 shadow-md relative overflow-hidden">
                <div className="flex items-start">
                  <div className="icon-circle mr-4 flex-shrink-0">
                    <Image 
                      src="/images/icon-2.png" 
                      alt={t('card2.imageAlt')} 
                      width={40} 
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">{t('card2.title')}</h3>
                    <p className="text-gray-700">
                      {t('card2.description')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 卡片3 */}
              <div className="bg-cream rounded-lg p-6 shadow-md relative overflow-hidden">
                <div className="flex items-start">
                  <div className="icon-circle mr-4 flex-shrink-0">
                    <Image 
                      src="/images/icon-3.png" 
                      alt={t('card3.imageAlt')} 
                      width={40} 
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">{t('card3.title')}</h3>
                    <p className="text-gray-700">
                      {t('card3.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 装饰元素 - 使用SVG */}
            <div className="hidden md:block absolute -top-10 -right-10 z-0 opacity-20">
              <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M75 0C90 30 120 45 150 45C120 60 105 90 105 120C75 105 45 120 30 150C15 120 0 90 0 75C30 60 45 30 75 0Z" fill="#D4AF37" fillOpacity="0.3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 