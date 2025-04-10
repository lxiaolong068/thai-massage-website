'use client';

import Link from 'next/link';
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
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        {/* 页脚导航链接 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 联系信息 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">{t('contactUs', '联系我们')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-primary transition duration-300">
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
                <Link href={`/${locale}`} className="hover:text-primary transition duration-300">
                  {t('home', '首页')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="hover:text-primary transition duration-300">
                  {t('services', '服务')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/therapists`} className="hover:text-primary transition duration-300">
                  {t('therapists', '按摩师')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/booking`} className="hover:text-primary transition duration-300">
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
                <Link href={`/${locale}/privacy-policy`} className="hover:text-primary transition duration-300">
                  {t('privacyPolicy', '隐私政策')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms-conditions`} className="hover:text-primary transition duration-300">
                  {t('termsConditions', '条款与条件')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/refund-policy`} className="hover:text-primary transition duration-300">
                  {t('refundPolicy', '退款政策')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="hover:text-primary transition duration-300">
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
        
        {/* 版权信息 */}
        <div className="border-t border-gray-700 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Top Secret Massage. {t('allRightsReserved', '版权所有')}</p>
          <div className="mt-2">
            <span>{t('developedBy', '开发')}: <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">TopSecret Dev Team</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
} 