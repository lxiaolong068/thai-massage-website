import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 定义支持的语言
const locales = ['en', 'zh', 'th', 'ko'];

// 验证并获取元数据
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  // 验证语言是否支持
  if (!locales.includes(locale)) {
    notFound();
  }

  // 加载翻译消息
  const messages = await getMessages(locale);

  try {
    // 从翻译中获取元数据
    return {
      title: messages.metadata?.title || 'The Victoria\'s Outcall Massage | Professional Thai Massage in Bangkok',
      description: messages.metadata?.description || 'Experience premium Thai massage services in Bangkok.',
      keywords: messages.metadata?.keywords || 'Thai massage, Bangkok, relaxation, rejuvenation, professional massage',
      openGraph: {
        title: messages.metadata?.ogTitle || 'The Victoria\'s Outcall Massage',
        description: messages.metadata?.ogDescription || 'Premium Thai massage services in Bangkok',
        url: 'https://victorias-bangkok.com',
        siteName: "The Victoria's Outcall Massage",
        locale: locale,
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // 返回默认元数据
    return {
      title: 'The Victoria\'s Outcall Massage | Professional Thai Massage in Bangkok',
      description: 'Experience premium Thai massage services in Bangkok.',
      keywords: 'Thai massage, Bangkok massage, relaxation',
    };
  }
}

// 加载翻译消息的函数
async function getMessages(locale: string) {
  try {
    // 从正确的目录导入特定语言的翻译文件
    return (await import(`../../i18n/messages/${locale}.json`)).default;
  } catch (error) {
    // 如果出错，返回空对象
    console.error(`Error loading messages for locale '${locale}'`, error);
    return {};
  }
}

// 布局组件
export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 验证语言是否支持
  if (!locales.includes(locale)) {
    notFound();
  }

  // 设置请求语言，这是Next.js 14中推荐的方式
  unstable_setRequestLocale(locale);

  // 加载翻译消息
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main>
            {children}
          </main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 