'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';

// 创建一个包装组件来使用useSearchParams
function TherapistContent() {
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

  // 渲染表单步骤
  const renderFormStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
            </div>
            
            <div className="pt-4">
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-primary text-dark font-medium py-3 rounded-full hover:bg-opacity-90 transition-all"
              >
                Next Step
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Select Service *</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.service ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a service</option>
                  <option value="Traditional Thai Massage">Traditional Thai Massage</option>
                  <option value="Oil Massage">Oil Massage</option>
                  <option value="Aromatherapy Massage">Aromatherapy Massage</option>
                  <option value="Deep Tissue Massage">Deep Tissue Massage</option>
                  <option value="Foot Massage">Foot Massage</option>
                  <option value="Neck & Shoulder Massage">Neck & Shoulder Massage</option>
                </select>
                {formErrors.service && <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>}
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">Duration *</label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.duration ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select duration</option>
                  <option value="60 minutes">60 minutes</option>
                  <option value="90 minutes">90 minutes</option>
                  <option value="120 minutes">120 minutes</option>
                </select>
                {formErrors.duration && <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
              </div>
              
              <div>
                <label htmlFor="time" className="block text-gray-700 font-medium mb-2">Time *</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.time ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.time && <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Your Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Hotel name, room number, address, etc."
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${formErrors.location ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Special Requests (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/2 bg-gray-200 text-gray-800 font-medium py-3 rounded-full hover:bg-gray-300 transition-all"
              >
                Previous
              </button>
              <button
                type="submit"
                className="w-1/2 bg-primary text-dark font-medium py-3 rounded-full hover:bg-opacity-90 transition-all"
              >
                Book Now
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // 渲染成功提交消息
  const renderSuccessMessage = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-semibold mb-2">Booking Successful!</h3>
      <p className="text-gray-600 mb-6">
        Thank you for your booking. We will contact you shortly to confirm your appointment.
      </p>
      <button
        onClick={() => {
          setIsSubmitted(false);
          setFormData({
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
          setSelectedTherapist(null);
        }}
        className="bg-primary text-dark font-medium px-6 py-2 rounded-full hover:bg-opacity-90 transition-all"
      >
        Book Another Session
      </button>
    </div>
  );

  return (
    <div>
      {/* 顶部横幅 */}
      <section className="relative h-[300px] mb-12">
        {/* 背景图片和遮罩 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/cta-bg.jpg"
            alt="Our Therapists"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        {/* 标题内容 */}
        <div className="container relative z-10 h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4 text-center">
            Our Therapists
          </h1>
          <p className="text-lg text-center max-w-2xl mx-auto">
            Meet our team of professional massage therapists and book your session
          </p>
        </div>
      </section>
      
      {/* 按摩师列表 */}
      <section className="py-12 bg-light">
        <div className="container">
          <h2 className="text-3xl font-serif font-semibold text-center mb-12 text-black">
            Choose Your Therapist
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {therapists.map((therapist) => (
              <div 
                key={therapist.id} 
                className={`bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 cursor-pointer ${selectedTherapist === therapist.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => selectTherapist(therapist.id)}
              >
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
                  
                  {/* 展开/收起按钮 */}
                  <button 
                    onClick={(e) => toggleExpand(therapist.id, e)}
                    className="text-primary hover:text-primary-dark flex items-center text-sm mb-3"
                  >
                    {expandedTherapists.includes(therapist.id) ? 'Show less' : 'Show more'}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ml-1 transition-transform ${expandedTherapists.includes(therapist.id) ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* 展开的内容 */}
                  {expandedTherapists.includes(therapist.id) && (
                    <div className="mb-4 text-gray-700">
                      <p className="font-semibold mb-1">Specialties:</p>
                      <ul className="list-disc list-inside mb-2">
                        {therapist.specialties.map((specialty, index) => (
                          <li key={index}>{specialty}</li>
                        ))}
                      </ul>
                      <p className="font-semibold mb-1">About:</p>
                      <p>{therapist.description}</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => selectTherapist(therapist.id)}
                    className="w-full bg-primary text-dark font-medium py-2 rounded-full hover:bg-opacity-90 transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 预约表单 */}
      <section className="py-16 bg-cream" id="booking-form">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-semibold text-center mb-8 text-black">
              Book Your Massage
            </h2>
            
            {selectedTherapist ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Selected Therapist</h3>
                  <div className="flex items-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                      <Image
                        src={therapists.find(t => t.id === selectedTherapist)?.image || ''}
                        alt="Selected Therapist"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{therapists.find(t => t.id === selectedTherapist)?.name}</p>
                      <p className="text-gray-600">{therapists.find(t => t.id === selectedTherapist)?.experience} of experience</p>
                    </div>
                  </div>
                </div>
                
                {isSubmitted ? (
                  renderSuccessMessage()
                ) : (
                  <form onSubmit={handleSubmit}>
                    {renderFormStep()}
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-700 mb-6">Please select a therapist from the list above to book your massage session.</p>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// 主页面组件，使用Suspense包装TherapistContent
export default function TherapistsPage() {
  return (
    <main>
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <TherapistContent />
      </Suspense>
      <Footer />
    </main>
  );
} 