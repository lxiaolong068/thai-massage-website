import Image from 'next/image';

const Services = () => {
  return (
    <section className="py-16 md:py-24 bg-light" id="services">
      <div className="container">
        <h2 className="section-title text-center mb-4">Our Massage & Price</h2>
        <p className="text-gray-600 text-center mb-12">
          &quot;Discover premium massage services at unbeatable prices.&quot;
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Traditional Thai Massage */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
            <div className="relative h-48">
              <Image
                src="/images/traditional-thai-new.jpg"
                alt="Traditional Thai Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3">Traditional Thai Massage</h3>
              <p className="text-gray-600 mb-4">
                Ancient techniques to relieve tension with authentic techniques.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Neck & Shoulder */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
            <div className="relative h-48">
              <Image
                src="/images/neck-shoulder-new.jpg"
                alt="Neck & Shoulder Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3">Neck & Shoulder</h3>
              <p className="text-gray-600 mb-4">
                A soothing neck and shoulder massage to relieve tension and restore balance, inspired by traditional Thai techniques.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Oil Massage */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
            <div className="relative h-48">
              <Image
                src="/images/oil-massage-new.jpg"
                alt="Oil Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3">Oil Massage</h3>
              <p className="text-gray-600 mb-4">
                A relaxing oil massage that nourishes the skin and eases muscle stiffness with smooth, flowing Thai-inspired strokes.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Aromatherapy Massage */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
            <div className="relative h-48">
              <Image
                src="/images/aromatherapy-massage.jpg"
                alt="Aromatherapy Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3">Aromatherapy Massage</h3>
              <p className="text-gray-600 mb-4">
                An aromatherapy massage blending essential oils with gentle Thai techniques to calm the mind and rejuvenate the body.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Deep Tissue Massage */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
            <div className="relative h-48">
              <Image
                src="/images/deep-tissue-new.jpg"
                alt="Deep Tissue Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3">Deep Tissue Massage</h3>
              <p className="text-gray-600 mb-4">
                A deep tissue massage using firm Thai-inspired pressure to target knots and release chronic tension in muscles.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Foot Massage */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
            <div className="relative h-48">
              <Image
                src="/images/foot-massage.jpg"
                alt="Foot Massage"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-3">Foot Massage</h3>
              <p className="text-gray-600 mb-4">
                A revitalizing foot massage rooted in Thai traditions, easing fatigue and stimulating circulation with expert pressure.
              </p>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>60 min..........</span>
                  <span className="font-semibold">800 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>90 min..........</span>
                  <span className="font-semibold">1200 baht</span>
                </div>
                <div className="flex justify-between">
                  <span>120 min........</span>
                  <span className="font-semibold">1500 baht</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services; 