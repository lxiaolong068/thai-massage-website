'use client';

import Image from 'next/image';
import { useImprovedTranslator } from '@/i18n/improved-client';

type IntroductionProps = {
  locale?: string;
};

const Introduction = ({ locale = 'en' }: IntroductionProps) => {
  // 使用优化后的翻译Hook，自动处理服务器/客户端一致性
  const { t } = useImprovedTranslator(locale, 'home.introduction');
  
  return (
    <section className="section-container section-cream">
      <div className="container">
        <h2 className="title-lg text-3xl md:text-4xl text-center text-black">
          {t('title', "Welcome to Top Secret Thai Massage")}
        </h2>
        
        {/* 黄色下划线装饰 */}
        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        
        <p className="text-black italic text-center text-lg md:text-xl mb-12 max-w-3xl mx-auto">
          &quot;{t('description', "We bring the authentic Thai massage experience directly to you. Our skilled therapists are trained in traditional techniques that have been perfected over centuries.")}&quot;
        </p>
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* 左侧内容 */}
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="bg-cream border-l-4 border-primary pl-6 py-2 mb-6">
              <h3 className="title-md md:text-2xl text-primary">
                {t('subtitle', "Tara Outcall Massage: Gateway to Renewal")}
              </h3>
            </div>
            
            <div className="card p-8">
              <p className="text-black leading-relaxed">
                {t('content', "Service was renowned for its exceptional quality and professional therapists. Each session was tailored to meet the individual needs of the client, ensuring a deeply relaxing and rejuvenating experience. The therapists brought their expertise and care right to the client's doorstep. The convenience and luxury of at-home service made it a popular choice. With a focus on holistic well-being, Top Secret outcall massage was more than just a service; it was a gateway to physical and mental renewal.")}
              </p>
            </div>
          </div>
          
          {/* 右侧图片 */}
          <div className="md:w-1/2 order-1 md:order-2 mb-8 md:mb-0">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/intro-new.png"
                alt={t('imageAlt', "Thai massage introduction")}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
              />
              
              {/* 圆形装饰边框 */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-primary rounded-full opacity-30"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border-4 border-primary rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction; 