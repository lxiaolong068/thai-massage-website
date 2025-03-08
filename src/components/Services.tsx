import Image from 'next/image';
import Link from 'next/link';

const Services = () => {
  return (
    <section className="section-container section-light" id="services">
      <div className="container">
        <h2 className="section-title text-center mb-4 text-black">Our Massage & Price</h2>
        <p className="text-gray-800 text-center mb-12">
          &quot;Discover premium massage services at unbeatable prices.&quot;
        </p>
        
        <div className="grid-responsive">
          {/* Traditional Thai Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/traditional-thai-new.jpg"
                alt="Traditional Thai Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">Traditional Thai Massage</h3>
              <p className="text-gray-800 mb-4">
                Ancient techniques to relieve tension with authentic techniques.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Neck & Shoulder */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/neck-shoulder-new.jpg"
                alt="Neck & Shoulder Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">Neck & Shoulder</h3>
              <p className="text-gray-800 mb-4">
                A soothing neck and shoulder massage to relieve tension and restore balance, inspired by traditional Thai techniques.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Oil Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/oil-massage-new.jpg"
                alt="Oil Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">Oil Massage</h3>
              <p className="text-gray-800 mb-4">
                A relaxing oil massage that nourishes the skin and eases muscle stiffness with smooth, flowing Thai-inspired strokes.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Aromatherapy Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/aromatherapy-massage.jpg"
                alt="Aromatherapy Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">Aromatherapy Massage</h3>
              <p className="text-gray-800 mb-4">
                An aromatherapy massage blending essential oils with gentle Thai techniques to calm the mind and rejuvenate the body.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deep Tissue Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/deep-tissue-new.jpg"
                alt="Deep Tissue Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">Deep Tissue Massage</h3>
              <p className="text-gray-800 mb-4">
                A deep tissue massage using firm Thai-inspired pressure to target knots and release chronic tension in muscles.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Foot Massage */}
          <div className="card card-hover">
            <div className="image-container">
              <Image
                src="/images/foot-massage.jpg"
                alt="Foot Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="title-md text-black">Foot Massage</h3>
              <p className="text-gray-800 mb-4">
                A revitalizing foot massage rooted in Thai traditions, easing fatigue and stimulating circulation with expert pressure.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex-between text-gray-900">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex-between text-gray-900">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* View All Services 按钮 */}
        <div className="mt-12 text-center">
          <Link 
            href="/services" 
            className="primary-button inline-flex items-center"
          >
            View All Services
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services; 