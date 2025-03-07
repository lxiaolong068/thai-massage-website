'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ${isScrolled ? 'bg-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="container flex items-center justify-between">
        <Logo />
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-primary p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#services" className="text-white hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="#prices" className="text-white hover:text-primary transition-colors">
            Prices
          </Link>
          <Link href="#therapists" className="text-white hover:text-primary transition-colors">
            Our Therapists
          </Link>
          <Link href="#contact" className="text-white hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="/book" className="btn btn-primary">
            Book Now
          </Link>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark bg-opacity-95 absolute top-16 left-0 right-0 p-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="text-white hover:text-primary transition-colors text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="#services" 
              className="text-white hover:text-primary transition-colors text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="#prices" 
              className="text-white hover:text-primary transition-colors text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Prices
            </Link>
            <Link 
              href="#therapists" 
              className="text-white hover:text-primary transition-colors text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Therapists
            </Link>
            <Link 
              href="#contact" 
              className="text-white hover:text-primary transition-colors text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/book" 
              className="btn btn-primary inline-block text-center mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header; 