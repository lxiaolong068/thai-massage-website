'use client';

import Image from 'next/image';
import { useImprovedTranslator } from '@/i18n/improved-client';

type IntroductionProps = {
  locale?: string;
};

const Introduction = ({ locale = 'en' }: IntroductionProps) => {
  // 使用优化后的翻译Hook，自动处理服务器/客户端一致性
  const { t } = useImprovedTranslator(locale, 'home.introduction');
  
  const introSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tara Massage Thai Massage",
    "description": t('schemaDescription', "Tara Massage offers professional outcall Thai massage services in Bangkok, delivering authentic relaxation and therapeutic treatments to your location."),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bangkok",
      "addressCountry": "TH"
    },
    "telephone": "+66-XXX-XXX-XXXX", // Replace with actual phone number if available
    "image": "/images/placeholder-service.jpg", // Replace with a relevant image URL
    "url": "https://yourwebsite.com", // Replace with your actual website URL
    "priceRange": "$$", // Example price range
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "10:00",
        "closes": "22:00"
      }
    ],
    "sameAs": [
      // Add social media links if available
      // "https://www.facebook.com/yourpage",
      // "https://www.instagram.com/yourprofile"
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://yourwebsite.com/book", // Replace with your booking page URL
        "inLanguage": "en",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/IOSPlatform",
          "http://schema.org/AndroidPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Book a Massage"
      }
    },
    // Add founder information if relevant and desired for SEO
    // "founder": {
    //   "@type": "Person",
    //   "name": "Founder Name"
    // },
    "areaServed": {
      "@type": "City",
      "name": "Bangkok"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Massage Services",
      "itemListElement": [
        // Add specific services if desired for SEO
        // {
        //   "@type": "Offer",
        //   "itemOffered": {
        //     "@type": "Service",
        //     "name": "Traditional Thai Massage"
        //   }
        // },
        // {
        //   "@type": "Offer",
        //   "itemOffered": {
        //     "@type": "Service",
        //     "name": "Foot Massage"
        //   }
        // }
      ]
    }
  };

  // Detailed historical description - kept for reference but maybe shortened or moved
  const historicalDescription = t('historicalDesc', "Originating from a vision to make traditional Thai wellness accessible, the service began by offering outcall massages. With a focus on holistic well-being, Tara Massage outcall massage was more than just a service; it was a gateway to physical and mental renewal.");

  return (
    <section className="section-container section-cream">
      <div className="container">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('title', "Welcome to Tara Massage Thai Massage")}
        </h1>
        
        {/* 黄色下划线装饰 */}
        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {t('description', "Experience authentic Thai massage in the comfort of your own space. Our professional therapists bring relaxation and rejuvenation right to your doorstep.")}
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