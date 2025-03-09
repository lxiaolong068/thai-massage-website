'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  // 使用翻译钩子
  const t = useTranslations('notFound');

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">{t('title')}</h1>
        <p className="mb-6 text-lg">{t('message')}</p>
        <Link
          href="/"
          className="bg-primary text-white px-4 py-2 rounded-lg inline-block"
        >
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
} 