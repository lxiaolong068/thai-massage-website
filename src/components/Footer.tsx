'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useImprovedTranslator } from '@/i18n/improved-client';

type FooterProps = {
  locale: string;
};

const Footer = ({ locale }: FooterProps) => {
  // 使用 useImprovedTranslator 钩子获取翻译
  const { t } = useImprovedTranslator(locale, 'footer');
  const { t: commonT } = useImprovedTranslator(locale, 'common');

  return (
    <footer className="bg-dark text-white pt-12 pb-6">
      <div className="container">
        {/* 顶部信息区域 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl title-serif mb-4 text-primary">
            {t('title', '泰式按摩')}
          </h2>
          
          <p className="text-primary text-lg mb-4">
            {t('address', '泰国曼谷素坎维区')}
          </p>
          
          <p className="text-primary text-lg mb-8">
            {t('tel', '电话')}: +66845035702
          </p>
          
          {/* Contact Us Now 按钮 */}
          <div className="flex-center mb-12">
            <Link 
              href="/contact"
              className="primary-button"
            >
              {t('contactButton', '立即联系我们')}
            </Link>
          </div>
        </div>
        
        {/* 二维码区域 */}
        <div className="mb-12">
          <h3 className="title-md text-center mb-6">{t('connectWithUs', '关注我们')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <Image 
                  src="/images/line-qr-1.png"
                  alt={t('qrCodes.line', 'Line二维码')}
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
              <span className="text-sm">Line</span>
            </div>
            
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <Image 
                  src="/images/wechat-qr.jpg"
                  alt={t('qrCodes.wechat', '微信二维码')}
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
              <span className="text-sm">WeChat</span>
            </div>
            
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <Image 
                  src="/images/whatsapp-qr.png"
                  alt={t('qrCodes.whatsapp', 'WhatsApp二维码')}
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
              <span className="text-sm">WhatsApp</span>
            </div>
            
            <div className="flex-col-center">
              <div className="bg-white p-2 rounded-lg mb-3">
                <Image 
                  src="/images/tg-qr.jpg"
                  alt={t('qrCodes.telegram', 'Telegram二维码')}
                  width={120}
                  height={120}
                  className="w-24 h-24 sm:w-28 sm:h-28"
                />
              </div>
              <span className="text-sm">Telegram</span>
            </div>
          </div>
        </div>
        
        {/* 导航链接 */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
          <Link href="/" className="text-white/80 hover:text-primary transition">
            {commonT('navigation.home', '首页')}
          </Link>
          <Link href="/about" className="text-white/80 hover:text-primary transition">
            {commonT('navigation.about', '关于我们')}
          </Link>
          <Link href="/services" className="text-white/80 hover:text-primary transition">
            {commonT('navigation.services', '服务')}
          </Link>
          <Link href="/therapists" className="text-white/80 hover:text-primary transition">
            {commonT('navigation.therapists', '按摩师')}
          </Link>
          <Link href="/contact" className="text-white/80 hover:text-primary transition">
            {commonT('navigation.contact', '联系我们')}
          </Link>
        </div>
        
        {/* 版权信息 */}
        <div className="text-center text-white/60 text-sm">
          <p>{t('copyright', '版权所有 © {year} 泰式按摩。保留所有权利。', { year: new Date().getFullYear() })}</p>
          <p className="mt-1">
            <Link href="/privacy-policy" className="hover:text-primary transition">
              {t('privacyPolicy', '隐私政策')}
            </Link>
            {' | '}
            <Link href="/terms-of-service" className="hover:text-primary transition">
              {t('termsOfService', '服务条款')}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 