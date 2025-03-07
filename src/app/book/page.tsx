'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    duration: '',
    location: '',
    message: '',
  });

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 在实际应用中，这里会处理表单提交逻辑
    console.log('Booking submitted:', formData);
    setIsSubmitted(true);
  };

  return (
    <main className="relative">
      <Header />
      <div className="relative z-10 pt-24 md:pt-28">
        <section className="relative py-32 mb-12">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/booking-bg.jpg"
              alt="Booking background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
          
          <div className="container relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4 text-center">
              Book Your Massage Session
            </h1>
            <p className="text-lg text-center max-w-2xl mx-auto">
              Complete the form below to schedule your personalized massage therapy session with one of our professional therapists.
            </p>
          </div>
        </section>
        
        <section className="py-12 mb-20">
          <div className="container">
            {isSubmitted ? (
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-primary bg-opacity-20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-semibold mb-4">Booking Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for booking with Victoria&apos;s Outcall Massage. We have received your request and will contact you shortly to confirm your appointment.
                </p>
                <Link href="/" className="btn btn-primary inline-block">
                  Return to Home
                </Link>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-8">
                  {[1, 2, 3].map((item) => (
                    <div 
                      key={item} 
                      className={`relative flex flex-col items-center ${step >= item ? 'text-primary' : 'text-gray-400'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= item ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {item}
                      </div>
                      <span className="text-sm font-medium">
                        {item === 1 ? 'Personal Info' : item === 2 ? 'Service Details' : 'Confirmation'}
                      </span>
                      {item < 3 && (
                        <div className={`absolute top-5 left-full w-full h-0.5 -ml-2 ${step > item ? 'bg-primary' : 'bg-gray-200'}`} style={{ width: 'calc(100% - 2.5rem)' }}></div>
                      )}
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-serif font-semibold mb-6">Personal Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="btn btn-primary"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-serif font-semibold mb-6">Service Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Select Service</label>
                          <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            <option value="">Select a service</option>
                            <option value="traditional">Traditional Thai Massage</option>
                            <option value="oil">Oil Massage</option>
                            <option value="aroma">Aromatherapy Massage</option>
                            <option value="swedish">Swedish Massage</option>
                            <option value="reflexology">Chinese Reflexology</option>
                            <option value="back">Back & Shoulder Massage</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">Duration</label>
                          <select
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            <option value="">Select duration</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Preferred Date</label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="time" className="block text-gray-700 font-medium mb-2">Preferred Time</label>
                          <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Your Location in Bangkok</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Hotel name, address, or area"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn btn-outline"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="btn btn-primary"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-serif font-semibold mb-6">Confirm Your Booking</h2>
                      
                      <div className="bg-light p-6 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                          <div>
                            <p className="mb-2"><span className="font-medium">Name:</span> {formData.name}</p>
                            <p className="mb-2"><span className="font-medium">Email:</span> {formData.email}</p>
                            <p className="mb-2"><span className="font-medium">Phone:</span> {formData.phone}</p>
                          </div>
                          
                          <div>
                            <p className="mb-2"><span className="font-medium">Service:</span> {formData.service}</p>
                            <p className="mb-2"><span className="font-medium">Duration:</span> {formData.duration} minutes</p>
                            <p className="mb-2"><span className="font-medium">Date & Time:</span> {formData.date} at {formData.time}</p>
                            <p className="mb-2"><span className="font-medium">Location:</span> {formData.location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Additional Notes (Optional)</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Any special requests or information for the therapist"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="btn btn-outline"
                        >
                          Previous
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
} 