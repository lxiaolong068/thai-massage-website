'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  // 服务数据
  const services = [
    {
      id: 1,
      name: 'Traditional Thai Massage',
      description: 'Ancient techniques to relieve tension with authentic techniques. This traditional massage uses no oils, instead focusing on pressure points and stretching to relieve tension and improve flexibility. The therapist uses their hands, knees, legs, and feet to move you into a series of yoga-like stretches.',
      benefits: [
        'Improves flexibility and range of motion',
        'Reduces muscle tension and spasms',
        'Balances the body\'s energy systems',
        'Promotes relaxation and well-being'
      ],
      image: '/images/traditional-thai-new.jpg',
      prices: [
        { duration: '60 min', price: '800 baht' },
        { duration: '90 min', price: '1200 baht' },
        { duration: '120 min', price: '1500 baht' }
      ]
    },
    {
      id: 2,
      name: 'Neck & Shoulder Massage',
      description: 'A soothing neck and shoulder massage to relieve tension and restore balance, inspired by traditional Thai techniques. This focused massage targets the areas that commonly hold stress and tension from daily activities like working at a desk, driving, or looking at mobile devices.',
      benefits: [
        'Relieves neck and shoulder pain',
        'Reduces headaches and migraines',
        'Improves posture and alignment',
        'Increases blood circulation to the brain'
      ],
      image: '/images/neck-shoulder-new.jpg',
      prices: [
        { duration: '60 min', price: '800 baht' },
        { duration: '90 min', price: '1200 baht' },
        { duration: '120 min', price: '1500 baht' }
      ]
    },
    {
      id: 3,
      name: 'Oil Massage',
      description: 'A relaxing oil massage that nourishes the skin and eases muscle stiffness with smooth, flowing Thai-inspired strokes. Using premium oils, this massage combines gentle pressure with long, flowing strokes to promote deep relaxation and improve circulation.',
      benefits: [
        'Moisturizes and nourishes the skin',
        'Reduces muscle tension and soreness',
        'Improves blood circulation',
        'Promotes deep relaxation and stress relief'
      ],
      image: '/images/oil-massage-new.jpg',
      prices: [
        { duration: '60 min', price: '800 baht' },
        { duration: '90 min', price: '1200 baht' },
        { duration: '120 min', price: '1500 baht' }
      ]
    },
    {
      id: 4,
      name: 'Aromatherapy Massage',
      description: 'An aromatherapy massage blending essential oils with gentle Thai techniques to calm the mind and rejuvenate the body. This sensory experience combines the therapeutic benefits of massage with the healing properties of essential oils, carefully selected based on your needs.',
      benefits: [
        'Reduces stress and anxiety',
        'Improves sleep quality',
        'Boosts immune system function',
        'Enhances mood and emotional well-being'
      ],
      image: '/images/aromatherapy-massage.jpg',
      prices: [
        { duration: '60 min', price: '800 baht' },
        { duration: '90 min', price: '1200 baht' },
        { duration: '120 min', price: '1500 baht' }
      ]
    },
    {
      id: 5,
      name: 'Deep Tissue Massage',
      description: 'A deep tissue massage using firm Thai-inspired pressure to target knots and release chronic tension in muscles. This therapeutic massage works deeply into the muscles and connective tissue to release chronic patterns of tension through slow strokes and deep finger pressure.',
      benefits: [
        'Breaks down scar tissue and adhesions',
        'Relieves chronic muscle pain',
        'Improves posture and alignment',
        'Increases range of motion in joints'
      ],
      image: '/images/deep-tissue-new.jpg',
      prices: [
        { duration: '60 min', price: '800 baht' },
        { duration: '90 min', price: '1200 baht' },
        { duration: '120 min', price: '1500 baht' }
      ]
    },
    {
      id: 6,
      name: 'Foot Massage',
      description: 'A revitalizing foot massage rooted in Thai traditions, easing fatigue and stimulating circulation with expert pressure. Based on the principles of reflexology, this massage focuses on pressure points in the feet that correspond to different body organs and systems.',
      benefits: [
        'Reduces foot pain and fatigue',
        'Improves circulation in the feet and legs',
        'Promotes relaxation throughout the body',
        'Balances energy flow through reflexology points'
      ],
      image: '/images/foot-massage.jpg',
      prices: [
        { duration: '60 min', price: '800 baht' },
        { duration: '90 min', price: '1200 baht' },
        { duration: '120 min', price: '1500 baht' }
      ]
    }
  ];

  return (
    <main className="relative">
      <Header />
      <div className="relative z-10">
        {/* 顶部横幅 - 彻底修复黑边问题 */}
        <section className="relative h-[500px] mb-0">
          {/* 背景图片和遮罩 */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/hero-bg.jpg"
              alt="Our Services"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          {/* 标题内容 */}
          <div className="container relative z-10 h-full flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4 text-center">
              Our Massage & Price
            </h1>
            <p className="text-lg text-center max-w-2xl mx-auto">
              Discover premium massage services at unbeatable prices, delivered by our professional therapists
            </p>
          </div>
        </section>
        
        {/* 服务介绍部分 */}
        <section className="py-16 bg-light">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-black">Our Services</h2>
              <p className="text-gray-800 max-w-3xl mx-auto">
                At Victoria&apos;s Bangkok, we offer a range of premium massage services designed to relax, rejuvenate, and restore your body and mind. Each service is performed by our skilled therapists who are trained in authentic Thai massage techniques.
              </p>
            </div>
            
            {/* 服务列表 */}
            <div className="space-y-16">
              {services.map((service, index) => (
                <div key={service.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
                  {/* 服务图片 */}
                  <div className="w-full md:w-1/2">
                    <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* 服务详情 */}
                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-serif font-semibold mb-4 text-black">{service.name}</h3>
                    <p className="text-gray-800 mb-4">{service.description}</p>
                    
                    <h4 className="text-lg font-semibold mb-2 text-black">Benefits:</h4>
                    <ul className="list-disc pl-5 mb-6 text-gray-800">
                      {service.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                    
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold mb-3 text-black">Pricing:</h4>
                      <div className="space-y-2">
                        {service.prices.map((price, i) => (
                          <div key={i} className="flex justify-between text-gray-900">
                            <span>{price.duration}..........</span>
                            <span className="font-semibold">{price.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link 
                        href={`/therapists?service=${encodeURIComponent(service.name)}`}
                        className="inline-block bg-primary text-dark font-medium px-6 py-2 rounded-full hover:bg-opacity-90 transition-all"
                      >
                        Book This Service
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 常见问题部分 */}
        <section className="py-16 bg-cream">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-center text-black">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-black">What should I wear during the massage?</h3>
                <p className="text-gray-800">For oil-based massages, you may undress to your comfort level. You will be properly draped with towels throughout the session. For Thai massage, we recommend wearing loose, comfortable clothing.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-black">How early should I arrive for my appointment?</h3>
                <p className="text-gray-800">Since we provide outcall services, our therapist will arrive at your location at the scheduled time. Please ensure your space is ready and comfortable for the massage session.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-black">Is tipping expected?</h3>
                <p className="text-gray-800">Tipping is not mandatory but is appreciated if you enjoyed your service. A standard tip is typically 10-20% of the service price.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-black">How do I choose the right massage for me?</h3>
                <p className="text-gray-800">Consider your goals: relaxation, pain relief, or stress reduction. Our therapists can also provide recommendations based on your specific needs during consultation.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2 text-black">Are there any conditions where massage is not recommended?</h3>
                <p className="text-gray-800">Massage may not be suitable for certain conditions like fever, infectious diseases, severe osteoporosis, or recent surgery. Please inform your therapist about any health conditions before your session.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* 预约行动召唤 */}
        <section className="py-16 bg-light text-center">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-black">Ready to Experience Our Services?</h2>
            <p className="text-gray-800 mb-8 max-w-2xl mx-auto">
              Book your massage session today and let our professional therapists help you relax and rejuvenate.
            </p>
            <Link 
              href="/therapists" 
              className="inline-block bg-primary text-dark font-medium px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
            >
              Book Now
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
} 