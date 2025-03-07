import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="relative">
      <Header />
      
      {/* 页面标题区域 - 使用aromatherapy-massage.jpg作为背景图片 */}
      <section className="relative pt-32 pb-16 text-white text-center">
        {/* 背景图片 */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/aromatherapy-massage.jpg"
            alt="About Us Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">About Us</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Learn more about The Victoria&apos;s Outcall Massage and our commitment to excellence
          </p>
        </div>
      </section>
      
      {/* 介绍区域 - 基于Introduction组件 */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-black">Our Story</h2>
          
          {/* 黄色下划线装饰 */}
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          
          <p className="text-black italic text-center text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            &quot;Relax and rejuvenate with personalized massage therapy.&quot;
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* 左侧内容 */}
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="bg-cream border-l-4 border-primary pl-6 py-2 mb-6">
                <h3 className="text-xl md:text-2xl font-serif font-semibold text-primary">Victoria&apos;s Outcall Massage: Gateway to Renewal</h3>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <p className="text-black leading-relaxed mb-4">
                  Service was renowned for its exceptional quality and professional therapists. Each session was tailored to meet the individual needs of the client, ensuring a deeply relaxing and rejuvenating experience, the therapists brought their expertise and care right to the client&apos;s doorstep. The convenience and luxury of at-home service made it a popular choice. With a focus on holistic well-being, Victoria&apos;s outcall massage was more than just a service; it was a gateway to physical and mental renewal.
                </p>
                <p className="text-black leading-relaxed">
                  Founded with a vision to bring authentic Thai massage techniques to Bangkok, we have grown to become one of the most trusted names in the industry. Our team consists of certified professionals who are passionate about the art of massage therapy and dedicated to providing the highest level of service.
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
      
      {/* 我们的使命和价值观 */}
      <section className="py-16 md:py-24 bg-light">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-black">Our Mission & Values</h2>
          
          {/* 黄色下划线装饰 */}
          <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 使命 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-dark">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4 text-center text-black">Our Mission</h3>
              <p className="text-black text-center">
                To provide exceptional massage therapy services that promote wellness, relaxation, and healing. We strive to enhance the quality of life for our clients through professional and personalized care.
              </p>
            </div>
            
            {/* 愿景 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-dark">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4 text-center text-black">Our Vision</h3>
              <p className="text-black text-center">
                To be recognized as the premier outcall massage service in Bangkok, known for our commitment to excellence, integrity, and customer satisfaction. We aim to set the standard for quality and professionalism in the industry.
              </p>
            </div>
            
            {/* 价值观 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-dark">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4 text-center text-black">Our Values</h3>
              <p className="text-black text-center">
                We are guided by the principles of professionalism, integrity, respect, and continuous improvement. We believe in treating each client with dignity and providing a safe, comfortable environment for their massage experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 我们的团队 */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-black">Our Team</h2>
          
          {/* 黄色下划线装饰 */}
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          
          <p className="text-black italic text-center text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            &quot;Meet our professional therapists who are dedicated to your wellness.&quot;
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-black leading-relaxed mb-6">
              At The Victoria&apos;s Outcall Massage, we take pride in our team of highly skilled and certified massage therapists. Each member of our team has undergone rigorous training and possesses extensive experience in various massage techniques, including traditional Thai massage, oil massage, aromatherapy, and more.
            </p>
            
            <p className="text-black leading-relaxed mb-6">
              Our therapists are not only experts in their craft but also passionate about helping clients achieve optimal wellness. They stay updated with the latest developments in massage therapy and continuously refine their skills to provide the best possible service.
            </p>
            
            <p className="text-black leading-relaxed">
              We carefully select our therapists based on their qualifications, experience, and commitment to customer satisfaction. When you book a session with us, you can be confident that you will receive professional, high-quality service from a therapist who genuinely cares about your well-being.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/therapists" 
              className="inline-flex items-center bg-primary text-dark font-medium px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
            >
              Book a Session Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 