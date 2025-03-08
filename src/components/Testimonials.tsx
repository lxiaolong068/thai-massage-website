'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'USA',
    text: 'The Thai massage was absolutely incredible! The therapist was professional and skilled. I felt completely rejuvenated afterward. Highly recommend!',
    image: '/images/testimonial-1.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Singapore',
    text: 'I was in Bangkok for business and booked a massage through Victoria\'s. The therapist came to my hotel room on time and provided an excellent service. Will definitely use again on my next trip!',
    image: '/images/testimonial-2.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    location: 'UK',
    text: 'After a long flight to Bangkok, this massage was exactly what I needed. The aromatherapy oils were divine and the massage techniques were perfect for relieving my travel fatigue.',
    image: '/images/testimonial-3.jpg',
    rating: 4,
  },
  {
    id: 4,
    name: 'David Kim',
    location: 'South Korea',
    text: 'The traditional Thai massage was authentic and therapeutic. The therapist was knowledgeable and addressed all my problem areas. I felt like a new person afterward!',
    image: '/images/testimonial-4.jpg',
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-dark text-white">
      <div className="container">
        <h2 className="section-title text-center text-white mb-4">What Our Clients Say</h2>
        <p className="text-gray-300 text-center mb-12">
          Read testimonials from our satisfied customers
        </p>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-8 text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                          stroke="currentColor"
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-primary' : 'text-gray-400'}`}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={i < testimonial.rating ? 0 : 1.5} 
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-300 italic mb-6">&quot;{testimonial.text}&quot;</p>
                    <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === activeIndex ? 'bg-primary' : 'bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-primary bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 transition-all"
            onClick={() => setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1))}
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-primary bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-100 transition-all"
            onClick={() => setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1))}
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 