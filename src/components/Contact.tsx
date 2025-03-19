'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useImprovedTranslator } from '@/i18n/improved-client';

type ContactProps = {
  locale?: string;
};

const Contact = ({ locale = 'en' }: ContactProps) => {
  // 使用 useImprovedTranslator 钩子获取翻译
  const { t } = useImprovedTranslator(locale, 'contact');
  const { t: commonT } = useImprovedTranslator(locale, 'common');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 在实际应用中，这里会处理表单提交逻辑
    console.log('Feedback submitted:', formData);
    alert(t('feedbackAlert', '感谢您的反馈！我们会尽快与您联系。'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <>
      {/* 联系表单部分 */}
      <section className="section-container section-light" id="contact">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="title-lg text-black">{t('getInTouch', '联系我们')}</h3>
              <p className="text-black mb-8">
                {t('feedbackIntro', '我们随时欢迎您的反馈和建议。请使用以下任何方式与我们联系。')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="icon-circle mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{t('location', '地址')}</h4>
                    <p className="text-black">{t('locationValue', '泰国曼谷素坎维区')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="icon-circle mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{t('phone', '电话')}</h4>
                    <p className="text-black">{t('phoneValue', '+66 84 503 5702')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="icon-circle mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{t('email', '电子邮箱')}</h4>
                    <p className="text-black">{t('emailValue', 'info@thaimassage.com')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="icon-circle mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{t('workingHours', '营业时间')}</h4>
                    <p className="text-black">{t('workingHoursValue', '周一至周日，上午10:00 - 下午10:00')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="card p-8">
                <h3 className="title-lg text-black text-center">{t('feedbackTitle', '发送反馈')}</h3>
                
                <div className="mb-4">
                  <label htmlFor="name" className="block text-black font-medium mb-2">{t('nameLabel', '姓名')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-black font-medium mb-2">{t('emailLabel', '电子邮箱')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-black font-medium mb-2">{t('phoneLabel', '电话')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-black font-medium mb-2">{t('subjectLabel', '主题')}</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                    required
                  >
                    <option value="">{t('selectSubject', '请选择主题')}</option>
                    <option value="suggestion">{t('subjectOptions.suggestion', '建议')}</option>
                    <option value="complaint">{t('subjectOptions.complaint', '投诉')}</option>
                    <option value="praise">{t('subjectOptions.praise', '表扬')}</option>
                    <option value="question">{t('subjectOptions.question', '问题')}</option>
                    <option value="other">{t('subjectOptions.other', '其他')}</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-black font-medium mb-2">{t('messageLabel', '消息')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder={t('messagePlaceholder', '请输入您的消息...')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full primary-button py-3"
                >
                  {t('submitButton', '提交反馈')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact; 