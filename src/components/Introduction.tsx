import Image from 'next/image';

const Introduction = () => {
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4">Introduction</h2>
        
        {/* 黄色下划线装饰 */}
        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        
        <p className="text-gray-600 italic text-center text-lg md:text-xl mb-12 max-w-3xl mx-auto">
          &quot;Relax and rejuvenate with personalized massage therapy.&quot;
        </p>
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* 左侧内容 */}
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="bg-cream border-l-4 border-primary pl-6 py-2 mb-6">
              <h3 className="text-xl md:text-2xl font-serif font-semibold text-primary">Victoria&apos;s Outcall Massage: Gateway to Renewal</h3>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-gray-700 leading-relaxed">
                Service was renowned for its exceptional quality and professional therapists. Each session was tailored to meet the individual needs of the client, ensuring a deeply relaxing and rejuvenating experience, the therapists brought their expertise and care right to the client&apos;s doorstep. The convenience and luxury of at-home service made it a popular choice. With a focus on holistic well-being, Victoria&apos;s outcall massage was more than just a service; it was a gateway to physical and mental renewal.
              </p>
            </div>
          </div>
          
          {/* 右侧图片 */}
          <div className="md:w-1/2 order-1 md:order-2 mb-8 md:mb-0">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/intro-new.png"
                alt="Thai massage introduction"
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