'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useImprovedTranslator } from '@/i18n/improved-client';

export default function Footer() {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  
  // 使用翻译钩子
  const { t } = useImprovedTranslator(locale, 'footer');
  
  // 定义友情链接
  const friendlyLinks = [
    { name: 'Bangkok Tourism', url: 'https://www.bangkoktourism.com' },
    { name: 'Thailand Travel', url: 'https://www.tourismthailand.org' },
    { name: 'Thai Massage Association', url: 'https://www.thaimassage.or.th' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:pb-12 pb-20">
      <div className="container mx-auto px-4">
        {/* 二维码联系方式区域 */}
        <div className="max-w-4xl mx-auto mb-10">
          <h4 className="text-center text-white text-lg font-semibold mb-6">{t('qrTitle', '扫码联系我们')}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* LINE */}
            <div className="bg-white/90 p-4 rounded-lg shadow text-center flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <Image src="/images/line-qr-1.png" alt="LINE二维码" fill className="object-contain rounded" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('line', 'LINE')}</span>
            </div>
            {/* WeChat */}
            <div className="bg-white/90 p-4 rounded-lg shadow text-center flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <Image src="/images/wechat-qr.jpg" alt="WeChat二维码" fill className="object-contain rounded" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('wechat', 'WeChat')}</span>
            </div>
            {/* Telegram */}
            <div className="bg-white/90 p-4 rounded-lg shadow text-center flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <Image src="/images/tg-qr.jpg" alt="Telegram二维码" fill className="object-contain rounded" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('telegram', 'Telegram')}</span>
            </div>
            {/* WhatsApp */}
            <div className="bg-white/90 p-4 rounded-lg shadow text-center flex flex-col items-center">
              <div className="relative w-24 h-24 mb-2">
                <Image src="/images/whatsapp-qr.png" alt="WhatsApp二维码" fill className="object-contain rounded" />
              </div>
              <span className="text-sm font-medium text-gray-800">{t('whatsapp', 'WhatsApp')}</span>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-4">{t('qrDescription', '长按二维码或截图识别，快速与我们取得联系')}</p>
        </div>
        {/* 页脚导航链接 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 联系信息 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t('contactUs', '联系我们')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-primary transition duration-300">
                  {t('contact', '联系页面')}
                </Link>
              </li>
              {/* <li>{t('location', '地址')}: {t('locationValue', '泰国曼谷')}</li> */}
              {/* <li>{t('phone', '电话')}: +66 84 503 5702</li> */}
              {/* <li>{t('email', '邮箱')}: info@topsecret-bangkok.com</li> */}
            </ul>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t('quickLinks', '快速链接')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary transition duration-300">
                  {t('home', '首页')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary transition duration-300">
                  {t('services', '服务')}
                </Link>
              </li>
              <li>
                <Link href="/therapists" className="hover:text-primary transition duration-300">
                  {t('therapists', '按摩师')}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-primary transition duration-300">
                  {t('booking', '预约')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 政策链接 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t('policies', '政策')}:</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition duration-300">
                  {t('privacyPolicy', '隐私政策')}
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-primary transition duration-300">
                  {t('termsConditions', '条款与条件')}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary transition duration-300">
                  {t('refundPolicy', '退款政策')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary transition duration-300">
                  {t('faq', '常见问题')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 友情链接 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t('friendlyLinks', '友情链接')}</h4>
            <ul className="space-y-2">
              {friendlyLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary transition duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Tara Massage Massage. {t('allRightsReserved', '版权所有')}</p>
        </div>
      </div>
    </footer>
  );
} 