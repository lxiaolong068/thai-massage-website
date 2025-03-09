'use client';

import { useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames } from '@/i18n/utils';

type LanguageSwitcherProps = {
  currentLocale: string;
};

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  // 处理语言切换
  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    if (newLocale === currentLocale) return;

    setIsPending(true);
    
    // 使用next-intl的router导航到新语言下的相同路径
    try {
      router.replace(pathname, { locale: newLocale });
    } catch (error) {
      console.error('语言切换错误:', error);
      // 出错时回退到首页
      router.replace('/', { locale: newLocale });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={handleLocaleChange}
        className="appearance-none bg-transparent border border-white/30 rounded px-2 py-1 text-sm text-white/90 focus:outline-none focus:ring-1 focus:ring-primary"
        disabled={isPending}
      >
        {locales.map(locale => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isPending && (
        <span className="ml-2 text-xs text-white/70">切换中...</span>
      )}
    </div>
  );
} 