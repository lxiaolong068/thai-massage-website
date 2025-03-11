import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import '../globals.css';

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

  // 返回元数据
  return {
    title: 'The Top Secret Outcall Massage | Professional Thai Massage in Bangkok',
    description: 'Experience premium Thai massage services in Bangkok. Our professional therapists bring relaxation and rejuvenation to your doorstep with personalized massage therapy.',
    keywords: 'Thai massage, Bangkok, relaxation, rejuvenation, professional massage',
    openGraph: {
      title: 'The Top Secret Outcall Massage | Professional Thai Massage in Bangkok',
      description: 'Experience premium Thai massage services in Bangkok. Our professional therapists bring relaxation and rejuvenation to your doorstep with personalized massage therapy.',
      url: 'https://topsecret-bangkok.com',
      siteName: 'The Top Secret Outcall Massage',
      locale: locale,
      type: 'website',
    },
  };
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

  // 加载翻译消息
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 