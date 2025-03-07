import Image from 'next/image';
import Link from 'next/link';

const Therapists = () => {
  const therapists = [
    {
      id: 1,
      name: 'Somying',
      age: 28,
      measurements: '34/24/36',
      weight: '52 kg',
      height: '165 cm',
      experience: '8 years',
      image: '/images/therapist-1.jpg',
    },
    {
      id: 2,
      name: 'Nattaya',
      age: 32,
      measurements: '36/26/38',
      weight: '55 kg',
      height: '170 cm',
      experience: '10 years',
      image: '/images/therapist-2.jpg',
    },
    {
      id: 3,
      name: 'Pranee',
      age: 25,
      measurements: '32/23/34',
      weight: '48 kg',
      height: '160 cm',
      experience: '7 years',
      image: '/images/therapist-3.jpg',
    },
    {
      id: 4,
      name: 'Malai',
      age: 30,
      measurements: '38/28/40',
      weight: '60 kg',
      height: '175 cm',
      experience: '9 years',
      image: '/images/therapist-4.jpg',
    },
  ];

  return (
    <section className="py-16 md:py-24" id="therapists">
      <div className="container">
        <h2 className="section-title text-center mb-4 text-black">Our Therapists</h2>
        <p className="text-white text-center mb-12 text-xl md:text-2xl font-medium">
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
                <h3 className="text-2xl font-semibold text-primary mb-2">{therapist.name}</h3>
                <div className="text-gray-700">
                  <p>Age: {therapist.age}</p>
                  <p>Measurements: {therapist.measurements}</p>
                  <p>Weight: {therapist.weight}</p>
                  <p>Height: {therapist.height}</p>
                  <p>Experience: {therapist.experience}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-light p-8 rounded-lg">
          <h3 className="text-2xl font-serif font-semibold mb-4 text-center text-black">Why Choose Our Therapists?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary bg-opacity-20 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-black">Certified Professionals</h4>
              <p className="text-gray-800">
                All our therapists are certified and have years of experience in various massage techniques.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary bg-opacity-20 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-black">Personalized Service</h4>
              <p className="text-gray-800">
                Our therapists tailor each session to your specific needs and preferences.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary bg-opacity-20 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-black">Punctual & Professional</h4>
              <p className="text-gray-800">
                We respect your time and ensure our therapists arrive promptly for your scheduled session.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            href="/therapists" 
            className="inline-flex items-center bg-primary text-dark font-medium px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
          >
            View All Therapists & Book Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Therapists; 