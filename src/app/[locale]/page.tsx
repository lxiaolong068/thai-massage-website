import Hero from '@/components/Hero';
import About from '@/components/About';
import Introduction from '@/components/Introduction';
import Services from '@/components/Services';
import { BookingAssistant } from '@/components/BookingAssistant';
import { CopilotKit } from '@copilotkit/react-core';

// 首页组件
export default function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <main className="relative">
        {/* Hero组件接收locale参数用于国际化 */}
        <Hero locale={locale} />
        
        <div className="relative z-10">
          {/* 静态组件不需要locale参数 */}
          <About />
          
          {/* 其他组件 */}
          <Introduction locale={locale} />
          <Services locale={locale} />
        </div>
        
        {/* AI预约助手 */}
        <BookingAssistant />
      </main>
    </CopilotKit>
  );
}