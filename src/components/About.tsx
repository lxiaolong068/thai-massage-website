'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface AboutProps {
  locale?: string;
}

const About: React.FC<AboutProps> = ({ locale = 'en' }) => {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  // 使用一个安全的方式获取翻译函数
  let t: any = null;
  try {
    t = useTranslations('about');
  } catch (err) {
    console.error('Error loading translations:', err);
    // 不在这里设置状态，而是在useEffect中处理
  }
  
  // 使用useEffect处理状态更新，避免无限循环
  useEffect(() => {
    if (t) {
      setLoaded(true);
    } else {
      setError('Translation function is undefined or failed to load');
    }
  }, [t]);
  
  // 安全获取翻译的辅助函数
  const safeT = (key: string, defaultValue: string = '') => {
    if (!t) return defaultValue;
    try {
      return t(key);
    } catch (err) {
      console.error(`Error translating key "${key}":`, err);
      return defaultValue;
    }
  };
  
  // 如果有错误，显示错误信息
  if (error) {
    return (
      <section className="section-container section-light" id="about">
        <div className="container">
          <div className="p-4 bg-red-100 text-red-700 rounded">
            <h2 className="text-xl font-bold mb-2">Translation Error</h2>
            <p>{error}</p>
            <p className="mt-2">Displaying default content instead.</p>
          </div>
          {/* 显示默认内容 */}
          <DefaultAboutContent locale={locale} />
        </div>
      </section>
    );
  }
  
  // 如果尚未加载，显示加载中
  if (!loaded) {
    return (
      <section className="section-container section-light" id="about">
        <div className="container">
          <div className="p-4">
            <p>Loading...</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="section-container section-light" id="about">
      <div className="container">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* 左侧标题、图片和按钮 */}
          <div className="md:w-2/5 mb-8 md:mb-0 relative">
            <h2 className="title-lg text-3xl md:text-4xl leading-tight text-black whitespace-normal">{safeT('title', 'About Us')}</h2>
            
            {/* 图片放在标题下方 */}
            <div className="relative mb-8 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/topsecret-massage.png"
                alt={safeT('imageAlt', 'About Us Image')}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            
            <Link 
              href={`/${locale}/contact`}
              className="primary-button inline-flex items-center px-6"
            >
              {safeT('learnMoreButton', 'Learn More About Us')}
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
                      alt={safeT('card1.imageAlt', 'Icon 1')} 
                      width={40} 
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">{safeT('card1.title', 'Our Service')}</h3>
                    <p className="text-gray-700">
                      {safeT('card1.description', 'Professional massage service in Bangkok.')}
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
                      alt={safeT('card2.imageAlt', 'Icon 2')} 
                      width={40} 
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">{safeT('card2.title', 'Professional Service')}</h3>
                    <p className="text-gray-700">
                      {safeT('card2.description', 'Skilled therapists trained in various techniques.')}
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
                      alt={safeT('card3.imageAlt', 'Icon 3')} 
                      width={40} 
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">{safeT('card3.title', 'Vision and Mission')}</h3>
                    <p className="text-gray-700">
                      {safeT('card3.description', 'Experience ultimate relaxation with our professional massage therapists.')}
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

// 默认内容组件，当翻译加载失败时显示
const DefaultAboutContent: React.FC<{locale?: string}> = ({ locale = 'en' }) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-12 mt-4">
      <div className="md:w-2/5 mb-8 md:mb-0">
        <h2 className="title-lg text-3xl md:text-4xl leading-tight text-black">Top Secret Outcall Massage</h2>
        <div className="relative mb-8 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/images/topsecret-massage.png"
            alt="Top Secret Outcall Massage"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
        <Link 
          href={`/${locale}/contact`}
          className="primary-button inline-flex items-center px-6"
        >
          LEARN MORE ABOUT US
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
      <div className="md:w-3/5">
        <div className="space-y-6">
          <div className="bg-cream rounded-lg p-6 shadow-md">
            <div className="flex items-start">
              <div className="icon-circle mr-4 flex-shrink-0">
                <Image src="/images/icon-1.png" alt="Icon 1" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">Top Secret Bangkok</h3>
                <p className="text-gray-700">
                  Top Secret Bangkok is a Professional outcall massage service in Bangkok. All of our therapists are totally qualified and possess a diploma.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-cream rounded-lg p-6 shadow-md">
            <div className="flex items-start">
              <div className="icon-circle mr-4 flex-shrink-0">
                <Image src="/images/icon-2.png" alt="Icon 2" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">Professional Outcall Massage Service</h3>
                <p className="text-gray-700">
                  Skilled therapists, trained in a variety of techniques, stand ready to tailor each session to the unique needs of their clients.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-cream rounded-lg p-6 shadow-md">
            <div className="flex items-start">
              <div className="icon-circle mr-4 flex-shrink-0">
                <Image src="/images/icon-3.png" alt="Icon 3" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-black">Vision and Mission</h3>
                <p className="text-gray-700">
                  Experience ultimate relaxation with our professional massage therapists. We bring the spa to your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 