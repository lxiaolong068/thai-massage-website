import { unstable_setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/config';

type PageProps = {
  params: {
    locale: string;
  };
};

export default async function TestPageServer({ params: { locale } }: PageProps) {
  // 设置请求语言
  unstable_setRequestLocale(locale);
  
  // 获取翻译函数
  const t = await getTranslations('notFound');

  // 确保locale类型安全
  const safeLocale = locales.includes(locale as any) ? locale as any : 'en';

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>服务器端国际化测试页面</h1>
      <p>这是一个支持国际化的服务器组件测试页面。</p>
      <p>当前语言: <strong>{locale}</strong></p>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-2">翻译示例：</h2>
        <p><strong>标题:</strong> {t('title')}</p>
        <p><strong>消息:</strong> {t('message')}</p>
        <p><strong>返回主页:</strong> {t('backHome')}</p>
      </div>
      
      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
        {' | '}
        <Link href="/test" locale={safeLocale} className="text-blue-500 hover:underline">
          客户端测试页面
        </Link>
      </div>
    </div>
  );
} 