import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-12 pb-6">
      <div className="container">
        {/* 顶部信息区域 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl title-serif mb-4 text-primary">
            The victoria&apos;s outcall massage
          </h2>
          
          <p className="text-primary text-lg mb-4">
            Sukhumvit Soi 13, Klongtoey Nua, Watthana, Bangkok, 10110
          </p>
          
          <p className="text-primary text-lg mb-8">
            Tel: +66845035702
          </p>
          
          {/* Contact Us Now 按钮 */}
          <div className="flex-center mb-12">
            <a 
              href="/contact" 
              className="primary-button"
            >
              Contact Us Now
            </a>
          </div>
        </div>
        
        {/* 二维码区域 */}
        <div className="mb-12">
          <h3 className="title-md text-center mb-6">Connect With Us</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <Image 
                  src="/images/line-qr-1.png" 
                  alt="Line QR Code" 
                  width={150} 
                  height={150} 
                />
              </div>
              <p className="text-gray-300">Line QR Code</p>
            </div>
            
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <Image 
                  src="/images/tg-qr.jpg" 
                  alt="Telegram QR Code" 
                  width={150} 
                  height={150} 
                />
              </div>
              <p className="text-gray-300">Telegram QR Code</p>
            </div>
            
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <div className="w-[150px] h-[150px] relative">
                  <Image 
                    src="/images/wechat-qr.jpg" 
                    alt="Wechat QR Code" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-gray-300">Wechat QR Code</p>
            </div>
            
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <Image 
                  src="/images/whatsapp-qr.png" 
                  alt="Whatsapp QR Code" 
                  width={150} 
                  height={150} 
                />
              </div>
              <p className="text-gray-300">Whatsapp QR Code</p>
            </div>
          </div>
        </div>
        
        {/* 底部信息区域 */}
        <div className="grid-responsive mb-8">
          <div>
            <h3 className="title-md mb-4">The Victoria&apos;s Bangkok</h3>
            <p className="text-gray-300 mb-4">
              Experience the best Thai massage therapy in Bangkok with our professional outcall massage service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </a>
              <a href="mailto:info@victorias-bangkok.com" className="text-white hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="tel:+66845035702" className="text-white hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="title-md mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-gray-300 hover:text-primary transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/therapists" className="text-gray-300 hover:text-primary transition-colors">
                  Therapists & Booking
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="title-md mb-4">Contact Information</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 mt-0.5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Bangkok, Thailand</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 mt-0.5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+66 XX XXX XXXX</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 mt-0.5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@victorias-bangkok.com</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2 mt-0.5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Available 24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} The Victoria&apos;s Bangkok. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 