import Link from 'next/link';
import Image from 'next/image';

const CallToAction = () => {
  return (
    <section className="relative py-16 md:py-24">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-bg.jpg"
          alt="Massage background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>
      
      <div className="container relative z-10 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
            &quot;Relax with tailored massage therapy.&quot;
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Experience the ultimate relaxation with our professional massage services. Book your session today and let our expert therapists take care of your well-being.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/book" className="btn btn-primary text-center px-8 py-3">
              BOOK NOW
            </Link>
            <Link href="#contact" className="btn btn-outline text-center px-8 py-3">
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 