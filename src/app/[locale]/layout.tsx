import { NextIntlClientProvider } from 'next-intl';
// 动态导入 i18n/messages/<locale>.json，以加载所有翻译命名空间
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';
import BookingAssistant from '@/components/BookingAssistant';
import { CopilotKit } from '@copilotkit/react-core';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

// 加载字体
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } 
}) {
  // 获取基础元数据...
  return {
    title: 'Thai Massage',
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 动态加载对应语言的所有翻译文件
  const messages = (await import(`../../i18n/messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.className} scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 语言前缀列表
              const LOCALE_PREFIXES = ['/en/', '/zh/', '/th/', '/ko/'];
              
              // 修复图片URL，移除语言前缀
              function fixImageUrl(url) {
                if (!url) return '/images/placeholder-therapist.jpg';
                
                // 移除语言前缀
                for (const prefix of LOCALE_PREFIXES) {
                  if (url.startsWith(prefix)) {
                    return '/' + url.slice(prefix.length);
                  }
                }
                
                return url;
              }
              
              // 全局图片错误处理
              window.addEventListener('error', function(event) {
                if (event.target instanceof HTMLImageElement) {
                  const img = event.target;
                  const src = img.src || '';
                  
                  // 静态资源路径修正
                  if (src.includes('/${locale}/images/') || src.includes('/${locale}/uploads/')) {
                    const fixedSrc = fixImageUrl(new URL(src).pathname);
                    console.warn('修正带语言前缀的图片路径:', src, '->', fixedSrc);
                    img.src = fixedSrc;
                    img.onerror = null;
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                  }
                  
                  // 处理其他错误图片
                  if (src.includes('/_next/image') && 
                      (src.includes('/http') || 
                       src.includes('/uploads/therapists') || 
                       src.includes('example.com'))) {
                    console.warn('图片加载失败，使用占位图:', src);
                    img.src = '/images/placeholder-therapist.jpg';
                    img.onerror = null;
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }, true);
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CopilotKit runtimeUrl="/api/copilotkit">
          <Header locale={locale} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <MobileContactBar />
          <Toaster position="top-center" />
            
            {/* 全局预约助手 - 在所有页面显示 */}
            <BookingAssistant locale={locale} />
          </CopilotKit>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 