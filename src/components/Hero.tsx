'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { createClientTranslator } from '@/i18n/client';

type HeroProps = {
  locale: string;
};

const Hero = ({ locale = 'en' }: HeroProps) => {
  // 使用 useMemo 创建翻译器，这样它不会在每次渲染时重新创建
  const translator = useMemo(() => {
    console.log('Creating hero translator for locale:', locale);
    // 不使用命名空间方式，而是直接访问完整的翻译树
    return createClientTranslator(locale);
  }, [locale]);
  
  // 翻译函数
  const t = (key: string, defaultValue: string) => {
    // 完整指定路径，避免命名空间嵌套问题
    return translator.t(`home.hero.${key}`, {}, defaultValue);
  };
  
  // 轮播图片数组
  const sliderImages = [
    '/images/slider-1.jpg',
    '/images/slider-2.jpg',
    '/images/slider-3.jpg',
    '/images/slider-4.jpg',
    '/images/slider-5.jpg',
  ];
  
  // 当前显示的图片索引
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 控制图片淡入淡出的状态
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      // 开始过渡动画
      setIsTransitioning(true);
      
      // 300ms后切换图片并重置过渡状态
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000); // 每5秒切换一次图片
    
    return () => clearInterval(interval);
  }, [sliderImages.length]);
  
  // 手动切换到下一张图片
  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
      setIsTransitioning(false);
    }, 300);
  };
  
  // 手动切换到上一张图片
  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + sliderImages.length) % sliderImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className="relative h-screen">
      {/* 轮播图背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentImageIndex
                ? 'opacity-100'
                : 'opacity-0'
            } ${isTransitioning ? 'transition-opacity duration-300' : ''}`}
          >
            <Image
              src={image}
              alt={`Slider image ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
              quality={90}
            />
            {/* 暗色叠加层，提高文字可读性 */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="container relative z-10 h-full flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {t('title', 'Experience Premium Thai Massage')}
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl">
          {t('subtitle', 'Relaxation and healing at your doorstep')}
        </p>
        <Link
          href="/therapists"
          className="primary-button text-lg inline-block"
        >
          {t('bookNow', 'Book Now')}
        </Link>
      </div>

      {/* 轮播控制按钮 */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-4">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentImageIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`w-3 h-3 rounded-full ${
              index === currentImageIndex ? 'bg-primary' : 'bg-white bg-opacity-50'
            } transition-colors duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* 左右箭头 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all duration-300"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
};

export default Hero; 