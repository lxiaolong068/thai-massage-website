'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';

export default function TherapistsPage() {
  // 获取URL参数
  const searchParams = useSearchParams();
  const therapistNameFromUrl = searchParams.get('name');

  // 按摩师数据
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
      specialties: ['Traditional Thai Massage', 'Oil Massage', 'Aromatherapy'],
      description: 'Somying is a highly skilled therapist with expertise in traditional Thai massage techniques. Her gentle yet effective approach helps clients achieve deep relaxation and relief from muscle tension.'
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
      specialties: ['Deep Tissue Massage', 'Swedish Massage', 'Reflexology'],
      description: 'With over a decade of experience, Nattaya specializes in deep tissue massage and Swedish techniques. Her strong hands and intuitive understanding of the body make her treatments particularly effective for chronic pain relief.'
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
      specialties: ['Aromatherapy', 'Oil Massage', 'Neck & Shoulder Relief'],
      description: 'Pranee is known for her soothing aromatherapy massages and specialized neck and shoulder treatments. Her gentle touch and attention to detail create a truly relaxing experience for her clients.'
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
      specialties: ['Traditional Thai Massage', 'Foot Massage', 'Full Body Oil Massage'],
      description: 'Malai combines traditional Thai massage with modern techniques to provide a comprehensive treatment. Her strength and precision make her massages both therapeutic and deeply relaxing.'
    },
  ];

  // 预约表单状态
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
    therapist: '',
  });

  // 表单错误状态
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    duration: '',
    location: '',
  });

  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);

  // 添加展开状态的状态管理
  const [expandedTherapists, setExpandedTherapists] = useState<number[]>([]);

  // 切换展开状态的函数
  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发selectTherapist
    setExpandedTherapists(prev => 
      prev.includes(id) 
        ? prev.filter(therapistId => therapistId !== id) 
        : [...prev, id]
    );
  };

  // 处理URL中的therapist参数
  useEffect(() => {
    if (therapistNameFromUrl) {
      const therapist = therapists.find(t => t.name === therapistNameFromUrl);
      if (therapist) {
        selectTherapist(therapist.id);
      }
    }
  }, [therapistNameFromUrl]);

  // 验证表单字段
  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)) 
          error = 'Please enter a valid phone number';
        break;
      case 'date':
        if (!value) error = 'Date is required';
        else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) error = 'Date cannot be in the past';
        }
        break;
      case 'time':
        if (!value) error = 'Time is required';
        break;
      case 'service':
        if (!value) error = 'Please select a service';
        break;
      case 'duration':
        if (!value) error = 'Please select a duration';
        break;
      case 'location':
        if (!value.trim()) error = 'Location is required';
        else if (value.trim().length < 5) error = 'Please provide more details about your location';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 更新表单数据
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 验证字段并更新错误状态
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const selectTherapist = (id: number) => {
    setSelectedTherapist(id);
    const therapist = therapists.find(t => t.id === id);
    if (therapist) {
      setFormData(prev => ({
        ...prev,
        therapist: therapist.name
      }));
    }
    setStep(1);
    // 滚动到预约表单
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 验证当前步骤的所有字段
  const validateStep = (currentStep: number) => {
    let isValid = true;
    const newErrors = { ...formErrors };
    
    if (currentStep === 1) {
      // 验证个人信息
      const fields = ['name', 'email', 'phone'];
      fields.forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData] as string);
        newErrors[field as keyof typeof formErrors] = error;
        if (error) isValid = false;
      });
    } else if (currentStep === 2) {
      // 验证服务详情
      const fields = ['service', 'duration', 'date', 'time', 'location'];
      fields.forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData] as string);
        newErrors[field as keyof typeof formErrors] = error;
        if (error) isValid = false;
      });
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证所有字段
    const isStep1Valid = validateStep(1);
    const isStep2Valid = validateStep(2);
    
    if (isStep1Valid && isStep2Valid) {
      // 在实际应用中，这里会处理表单提交逻辑
      console.log('Booking submitted:', formData);
      setIsSubmitted(true);
    } else {
      // 如果有错误，回到相应的步骤
      if (!isStep1Valid) setStep(1);
      else if (!isStep2Valid) setStep(2);
    }
  };

  return (
    <main className="relative">
      <Header />
      <div className="relative z-10">
        {/* 页面标题区域 - 修复黑边问题 */}
        <section className="relative h-[500px] mb-0">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/oil-massage-new.jpg"
              alt="Therapists background"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
          
          <div className="container relative z-10 h-full flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4 text-center">
              Our Professional Therapists
            </h1>
            <p className="text-lg text-center max-w-2xl mx-auto">
              Meet our team of certified and experienced massage therapists. Choose your preferred therapist and book your session today.
            </p>
          </div>
        </section>
        
        {/* 按摩师展示区域 */}
        <section className="py-16 bg-light">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-black">Meet Our Team</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <div className="text-gray-700 mb-4">
                      <p>Age: {therapist.age}</p>
                      <p>Measurements: {therapist.measurements}</p>
                      <p>Weight: {therapist.weight}</p>
                      <p>Height: {therapist.height}</p>
                      <p>Experience: {therapist.experience}</p>
                    </div>
                    
                    {expandedTherapists.includes(therapist.id) ? (
                      <>
                        <h4 className="font-semibold text-black mb-1">Specialties:</h4>
                        <ul className="text-gray-700 mb-4 list-disc pl-5">
                          {therapist.specialties.map((specialty, index) => (
                            <li key={index}>{specialty}</li>
                          ))}
                        </ul>
                        <p className="text-gray-700 mb-4">{therapist.description}</p>
                        <button 
                          onClick={(e) => toggleExpand(therapist.id, e)}
                          className="w-full mb-3 bg-gray-200 text-gray-700 font-medium py-2 rounded-full hover:bg-gray-300 transition-all"
                        >
                          See Less
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={(e) => toggleExpand(therapist.id, e)}
                        className="w-full mb-3 bg-gray-200 text-gray-700 font-medium py-2 rounded-full hover:bg-gray-300 transition-all"
                      >
                        See More
                      </button>
                    )}
                    
                    <button 
                      onClick={() => selectTherapist(therapist.id)}
                      className="w-full bg-primary text-dark font-medium py-2 rounded-full hover:bg-opacity-90 transition-all"
                    >
                      Book with {therapist.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 为什么选择我们的按摩师 */}
        <section className="py-16 bg-cream">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-black">Why Choose Our Therapists?</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary bg-opacity-20 rounded-full p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-black">Certified Professionals</h4>
                <p className="text-black">
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
                <p className="text-black">
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
                <p className="text-black">
                  We respect your time and ensure our therapists arrive promptly for your scheduled session.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* 预约表单区域 */}
        <section id="booking-form" className="py-16 bg-light">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-black">Book Your Session</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-12"></div>
            
            {selectedTherapist ? (
              <div className="mb-8 text-center">
                <p className="text-lg text-black">
                  You are booking with <span className="font-semibold text-primary">{therapists.find(t => t.id === selectedTherapist)?.name}</span>
                </p>
              </div>
            ) : (
              <div className="mb-8 text-center">
                <p className="text-lg text-black">
                  Select a therapist above or continue to book with any available therapist
                </p>
              </div>
            )}
            
            {isSubmitted ? (
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-primary bg-opacity-20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-semibold mb-4">Booking Successful!</h2>
                <p className="text-black mb-6">
                  Thank you for booking with Victoria&apos;s Outcall Massage. We have received your request and will contact you shortly to confirm your appointment.
                </p>
                <Link href="/" className="bg-primary text-dark font-medium px-6 py-3 rounded-full hover:bg-opacity-90 transition-all inline-block">
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
                      <h2 className="text-2xl font-serif font-semibold mb-6 text-black">Personal Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-black font-medium mb-2">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                            required
                          />
                          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-black font-medium mb-2">Email Address (Optional)</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                          />
                          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-black font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+66 XX XXX XXXX"
                          className={`w-full px-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                          required
                        />
                        {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="bg-primary text-dark font-medium px-6 py-3 rounded-full hover:bg-opacity-90 transition-all"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-serif font-semibold mb-6 text-black">Service Details</h2>
                      
                      {!selectedTherapist && (
                        <div>
                          <label htmlFor="therapist" className="block text-black font-medium mb-2">Select Therapist (Optional)</label>
                          <select
                            id="therapist"
                            name="therapist"
                            value={formData.therapist}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                          >
                            <option value="">Any available therapist</option>
                            {therapists.map(therapist => (
                              <option key={therapist.id} value={therapist.name}>{therapist.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="service" className="block text-black font-medium mb-2">Select Service</label>
                          <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${formErrors.service ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
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
                          {formErrors.service && <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="duration" className="block text-black font-medium mb-2">Duration</label>
                          <select
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${formErrors.duration ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                            required
                          >
                            <option value="">Select duration</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                          </select>
                          {formErrors.duration && <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-black font-medium mb-2">Preferred Date</label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${formErrors.date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                            required
                          />
                          {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
                        </div>
                        
                        <div>
                          <label htmlFor="time" className="block text-black font-medium mb-2">Preferred Time</label>
                          <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${formErrors.time ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                            required
                          />
                          {formErrors.time && <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-black font-medium mb-2">Your Location in Bangkok</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Hotel name, address, or area"
                          className={`w-full px-4 py-2 border ${formErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                          required
                        />
                        {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="border border-gray-300 text-black font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-all"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="bg-primary text-dark font-medium px-6 py-3 rounded-full hover:bg-opacity-90 transition-all"
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-serif font-semibold mb-6 text-black">Confirm Your Booking</h2>
                      
                      <div className="bg-cream p-6 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-black">Booking Summary</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                          <div>
                            <p className="mb-2"><span className="font-medium">Name:</span> {formData.name}</p>
                            <p className="mb-2"><span className="font-medium">Email:</span> {formData.email}</p>
                            <p className="mb-2"><span className="font-medium">Phone:</span> {formData.phone}</p>
                            <p className="mb-2"><span className="font-medium">Therapist:</span> {formData.therapist || 'Any available therapist'}</p>
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
                        <label htmlFor="message" className="block text-black font-medium mb-2">Additional Notes (Optional)</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Any special requests or information for the therapist"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                        ></textarea>
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="border border-gray-300 text-black font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-all"
                        >
                          Previous
                        </button>
                        <button
                          type="submit"
                          className="bg-primary text-dark font-medium px-6 py-3 rounded-full hover:bg-opacity-90 transition-all"
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