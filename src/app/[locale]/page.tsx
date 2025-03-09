import Hero from '@/components/Hero';
import About from '@/components/About';
import Introduction from '@/components/Introduction';
import Services from '@/components/Services';

// 首页组件，添加多个组件进行测试
export default function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <main className="relative">
      {/* Hero组件接收locale参数用于国际化 */}
      <Hero locale={locale} />
      
      <div className="relative z-10">
        {/* 静态组件不需要locale参数 */}
        <About />
        
        {/* 根据需要逐步添加其他组件，确保每个组件都能正常工作 */}
        <Introduction locale={locale} />
        <Services locale={locale} />
        
        {/* 未添加的组件保持注释状态，后续测试 */}
        {/* <Therapists /> */}
        {/* <Testimonials /> */}
        {/* <Contact /> */}
      </div>
    </main>
  );
} 