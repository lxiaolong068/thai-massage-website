import Hero from '@/components/Hero';
import About from '@/components/About';
import Introduction from '@/components/Introduction';
import Services from '@/components/Services';
import Therapists from '@/components/Therapists';

// 最简单的首页组件，用于验证国际化路由是否工作
export default function HomePage() {
  // 由于这是备份文件，我们可以使用默认的locale值
  const defaultLocale = 'en';
  
  return (
    <main className="relative">
      <Hero locale={defaultLocale} />
      <div className="relative z-10">
        <About locale={defaultLocale} />
        <Introduction locale={defaultLocale} />
        <Services locale={defaultLocale} />
        <Therapists locale={defaultLocale} />
      </div>
    </main>
  );
} 