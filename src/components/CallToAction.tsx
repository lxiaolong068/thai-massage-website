import Image from 'next/image';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-dark text-center">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-8 text-primary">
          The victoria's outcall massage
        </h2>
        
        <p className="text-primary text-lg mb-8">
          Sukhumvit Soi 13, Klongtoey Nua, Watthana, Bangkok, 10110
        </p>
        
        <p className="text-primary text-lg mb-12">
          Tel: +66845035702
        </p>
        
        {/* 添加一个简单的行动召唤按钮 */}
        <div className="flex justify-center">
          <a 
            href="/contact" 
            className="bg-primary text-dark font-medium px-8 py-3 rounded-full hover:bg-opacity-90 transition-all inline-block"
          >
            Contact Us Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 