'use client';

import { useState, useEffect, useMemo } from 'react';
import { Link, useSafePathname } from '@/i18n/navigation';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useImprovedTranslator } from '@/i18n/improved-client';

type HeaderProps = {
  locale: string;
};

const Header = ({ locale }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // 使用安全的路径名检查函数，避免静态资源路径被当作locale处理
  const pathname = useSafePathname();
  
  // 判断是否为首页（可能是根路径或带语言前缀的根路径）
  const isHomePage = useMemo(() => {
    // 检查是否为根路径或者仅包含语言前缀
    return pathname === '/' || /^\/(zh|en)\/?$/.test(pathname);
  }, [pathname]);
  
  // 在首页以外的页面，初始状态就设置为已滚动，以显示黑色背景
  const [isScrolled, setIsScrolled] = useState(!isHomePage);
  
  // 使用优化后的翻译Hook，自动处理服务器/客户端一致性
  const { t } = useImprovedTranslator(locale, 'common.navigation');
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    // 监听滚动事件，用于处理导航栏背景
    const handleScroll = () => {
      const offset = window.scrollY;
      
      // 只有在首页才根据滚动位置动态改变背景
      if (isHomePage) {
        if (offset > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        // 非首页始终保持黑色背景
        setIsScrolled(true);
      }
    };
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    // 初始调用一次，确保状态正确
    handleScroll();
    
    // 移除滚动事件监听
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]); // 依赖项添加 isHomePage

  // 检查当前路径是否匹配
  const isActive = (path: string) => {
    if (!pathname) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  // 使用绝对定位设置一个底部边框元素，完全消除白边
  return (
    <>
      {/* 三层防护：宽黑色背景层 + 阴影层 + 边框层 */}
      {isScrolled && (
        <>
          {/* 额外黑色背景层，比导航栏稍大一点，确保不有空隙 */}
          <div className="fixed top-0 left-0 right-0 w-full h-[72px] bg-black z-40"></div>
          {/* 下方阴影层，深色遮挡白边 */}
          <div className="fixed top-[70px] left-0 right-0 w-full h-[10px] bg-gradient-to-b from-black to-transparent z-40"></div>
          {/* 宽度边框层，确保有液高分割线 */}
          <div className="fixed top-[69px] left-0 right-0 w-full h-[3px] bg-black z-40"></div>
        </>
      )}
      
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black py-3' 
          : 'bg-transparent py-4'
      }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* 网站标志 */}
        <Logo />
        
        {/* 移动端菜单按钮 */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        
        {/* 桌面端导航菜单 */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="/"
            className={`text-white hover:text-primary transition duration-300 ${
              isActive('/') ? 'font-bold' : ''
            }`}
          >
            {t('home', 'Home')}
          </Link>
          <Link
            href="/about"
            className={`text-white hover:text-primary transition duration-300 ${
              isActive('/about') ? 'font-bold' : ''
            }`}
          >
            {t('about', 'About')}
          </Link>
          <Link
            href="/services"
            className={`text-white hover:text-primary transition duration-300 ${
              isActive('/services') ? 'font-bold' : ''
            }`}
          >
            {t('services', 'Services')}
          </Link>
          <Link
            href="/therapists"
            className={`text-white hover:text-primary transition duration-300 ${
              isActive('/therapists') ? 'font-bold' : ''
            }`}
          >
            {t('therapists', 'Therapists & Booking')}
          </Link>
          <Link
            href="/contact"
            className={`text-white hover:text-primary transition duration-300 ${
              isActive('/contact') ? 'font-bold' : ''
            }`}
          >
            {t('contact', 'Contact')}
          </Link>
          
          {/* 语言切换器 */}
          <LanguageSwitcher currentLocale={locale} />
        </nav>
        
        {/* 移动端菜单 */}
        <div
          className={`fixed inset-0 bg-dark bg-opacity-95 z-50 lg:hidden transition-all duration-300 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {/* 移动端菜单关闭按钮 */}
          <button
            className="absolute top-4 right-4 text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          {/* 移动端菜单内容 */}
          <div className="flex flex-col items-center justify-center h-full">
            <nav className="flex flex-col items-center space-y-6 text-xl">
              <Link
                href="/"
                className={`text-white hover:text-primary transition duration-300 ${
                  isActive('/') ? 'font-bold' : ''
                }`}
                onClick={toggleMenu}
              >
                {t('home', 'Home')}
              </Link>
              <Link
                href="/about"
                className={`text-white hover:text-primary transition duration-300 ${
                  isActive('/about') ? 'font-bold' : ''
                }`}
                onClick={toggleMenu}
              >
                {t('about', 'About')}
              </Link>
              <Link
                href="/services"
                className={`text-white hover:text-primary transition duration-300 ${
                  isActive('/services') ? 'font-bold' : ''
                }`}
                onClick={toggleMenu}
              >
                {t('services', 'Services')}
              </Link>
              <Link
                href="/therapists"
                className={`text-white hover:text-primary transition duration-300 ${
                  isActive('/therapists') ? 'font-bold' : ''
                }`}
                onClick={toggleMenu}
              >
                {t('therapists', 'Therapists & Booking')}
              </Link>
              <Link
                href="/contact"
                className={`text-white hover:text-primary transition duration-300 ${
                  isActive('/contact') ? 'font-bold' : ''
                }`}
                onClick={toggleMenu}
              >
                {t('contact', 'Contact')}
              </Link>
              
              {/* 移动端语言切换器 */}
              <div className="mt-6">
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header; 