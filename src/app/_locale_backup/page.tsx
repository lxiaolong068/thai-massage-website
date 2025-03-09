import Hero from '@/components/Hero';
import About from '@/components/About';
import Introduction from '@/components/Introduction';
import Services from '@/components/Services';
import Therapists from '@/components/Therapists';

// 最简单的首页组件，用于验证国际化路由是否工作
export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <div className="relative z-10">
        <About />
        <Introduction />
        <Services />
        <Therapists />
      </div>
    </main>
  );
} 