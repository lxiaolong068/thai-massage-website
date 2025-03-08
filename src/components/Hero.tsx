'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Hero = () => {
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
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? sliderImages.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className="relative h-[400px] md:h-[500px] flex items-center pt-12">
      {/* 轮播背景图片 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {sliderImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
              index === currentImageIndex 
                ? 'opacity-100 z-10' 
                : 'opacity-0 z-0'
            } ${isTransitioning ? 'opacity-50' : ''}`}
          >
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Slider image ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover md:object-contain lg:object-cover"
                style={{
                  objectPosition: 'center center',
                  maxHeight: '500px',
                }}
                quality={95}
                priority={index === 0}
              />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>
      </div>
      
      {/* 轮播控制按钮 - 只在PC端显示 */}
      <div className="hidden md:flex absolute inset-x-0 top-1/2 transform -translate-y-1/2 justify-between px-4 z-30">
        <button 
          onClick={prevSlide}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all focus:outline-none"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextSlide}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all focus:outline-none"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* 轮播指示器 */}
      <div className="absolute bottom-4 inset-x-0 flex-center gap-2 z-30">
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
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImageIndex 
                ? 'bg-primary w-4' 
                : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="container relative z-30 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl title-serif mb-2 sm:mb-6 leading-tight whitespace-nowrap sm:whitespace-normal">
            The victoria&apos;s outcall massage
          </h1>
          <p className="text-sm sm:text-base md:text-xl mb-1 sm:mb-3 text-gray-200">
            Relax with The Victoria&apos;s Bangkok
          </p>
          <p className="text-sm sm:text-base md:text-xl mb-4 sm:mb-10 text-gray-200 max-w-2xl mx-auto">
            &quot;Revitalize your body and mind with the best massage therapy.&quot;
          </p>
          <div className="flex-center gap-3 sm:gap-8">
            <Link href="/therapists" className="btn btn-primary text-center text-sm sm:text-base md:text-lg py-1.5 sm:py-3 px-3 sm:px-10 rounded-full w-auto min-w-[120px] sm:min-w-[160px] font-medium">
              BOOK NOW
            </Link>
            <Link href="/contact" className="btn btn-outline text-center text-sm sm:text-base md:text-lg py-1.5 sm:py-3 px-3 sm:px-10 rounded-full w-auto min-w-[120px] sm:min-w-[160px] font-medium">
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 