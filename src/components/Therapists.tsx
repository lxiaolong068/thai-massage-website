import Image from 'next/image';

const Therapists = () => {
  const therapists = [
    {
      id: 1,
      name: 'Somying',
      specialty: 'Traditional Thai Massage',
      experience: '8 years',
      image: '/images/therapist-1.jpg',
    },
    {
      id: 2,
      name: 'Nattaya',
      specialty: 'Oil Massage & Aromatherapy',
      experience: '10 years',
      image: '/images/therapist-2.jpg',
    },
    {
      id: 3,
      name: 'Pranee',
      specialty: 'Swedish & Deep Tissue Massage',
      experience: '7 years',
      image: '/images/therapist-3.jpg',
    },
    {
      id: 4,
      name: 'Malai',
      specialty: 'Reflexology & Thai Massage',
      experience: '9 years',
      image: '/images/therapist-4.jpg',
    },
  ];

  return (
    <section className="py-16 md:py-24" id="therapists">
      <div className="container">
        <h2 className="section-title text-center mb-4">Our Therapists</h2>
        <p className="text-gray-600 text-center mb-12">
          Meet our team of certified and experienced massage therapists
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {therapists.map((therapist) => (
            <div key={therapist.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
              <div className="relative h-64">
                <Image
                  src={therapist.image}
                  alt={`Therapist ${therapist.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-2">{therapist.name}</h3>
                <p className="text-primary font-medium mb-2">{therapist.specialty}</p>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Experience:</span> {therapist.experience}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-light p-8 rounded-lg">
          <h3 className="text-2xl font-serif font-semibold mb-4 text-center">Why Choose Our Therapists?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary bg-opacity-20 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Certified Professionals</h4>
              <p className="text-gray-600">
                All our therapists are certified and have years of experience in various massage techniques.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary bg-opacity-20 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Personalized Service</h4>
              <p className="text-gray-600">
                Our therapists tailor each session to your specific needs and preferences.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary bg-opacity-20 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">Punctual & Professional</h4>
              <p className="text-gray-600">
                We respect your time and ensure our therapists arrive promptly for your scheduled session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Therapists; 