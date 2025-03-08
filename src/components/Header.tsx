'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import { usePathname } from 'next/navigation';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // 初始检查
    handleScroll();
    
    // 清理事件监听
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header 
      className={`${
        isScrolled 
          ? 'fixed top-0 left-0 w-full bg-dark shadow-lg transition-all duration-300 ease-in-out' 
          : 'absolute top-0 left-0 w-full'
      } z-50 text-white`}
    >
      <div className="container py-4 relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-12">
              <li>
                <Link href="/" className={`hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : ''}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className={`hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary' : ''}`}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className={`hover:text-primary transition-colors ${pathname === '/services' ? 'text-primary' : ''}`}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/therapists" className={`hover:text-primary transition-colors ${pathname === '/therapists' ? 'text-primary' : ''}`}>
                  Therapists & Booking
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`hover:text-primary transition-colors ${pathname === '/contact' ? 'text-primary' : ''}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-primary focus:outline-none focus:text-primary"
            >
              {isOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-dark bg-opacity-95 py-4">
            <ul className="flex flex-col items-center space-y-4">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/therapists" className="hover:text-primary transition-colors">
                  Therapists & Booking
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 