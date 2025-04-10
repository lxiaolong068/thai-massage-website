'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useImprovedTranslator } from '@/i18n/improved-client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ContactProps = {
  locale?: string;
};

// 添加：定义联系方式接口
interface ActiveContactMethod {
  id: string;
  type: string;
  value: string | null;
  qrCode: string | null;
}

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

  // 添加：状态来存储联系方式和错误
  const [activeMethods, setActiveMethods] = useState<ActiveContactMethod[]>([]);
  const [fetchError, setFetchError] = useState(false);
  // 添加：弹窗状态和当前二维码 URL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQrCodeUrl, setCurrentQrCodeUrl] = useState<string | null>(null);

  // 添加：useEffect 来获取联系方式数据
  useEffect(() => {
    const fetchContactMethods = async () => {
      try {
        // 使用相对URL，移除对process.env.NEXT_PUBLIC_APP_URL的依赖
        const apiUrl = `/api/v1/public/contact-methods`;

        const response = await fetch(apiUrl, {
          cache: 'no-store', // 确保获取最新数据
        });
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          // 仅显示包含二维码的方法
          setActiveMethods(data.data.filter((method: ActiveContactMethod) => method.qrCode));
        } else {
          throw new Error(data.error?.message || "Failed to parse contact methods data");
        }
      } catch (error) {
        console.error("Failed to load contact methods for contact page:", error);
        setFetchError(true);
      }
    };

    fetchContactMethods();
  }, []);

  // 添加：处理二维码点击事件
  const handleQrCodeClick = (qrCodeUrl: string | null) => {
    if (qrCodeUrl) {
      setCurrentQrCodeUrl(qrCodeUrl);
      setIsModalOpen(true);
    }
  };

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
      {/* 联系方式和二维码部分 */}
      <section className="section-container section-light">
        <div className="container">
          <h2 className="title-lg text-center mb-12 text-black">{t('connectWithUsTitle', '与我们联系')}</h2>
          {fetchError && (
            <p className="text-red-500 text-center mb-8">{t('connectError', '无法加载联系方式。')}</p>
          )}
          {activeMethods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {activeMethods.map((method) => (
                <div key={method.id} className="flex flex-col items-center text-center">
                  {method.qrCode && (
                    <div
                      className="relative w-32 h-32 md:w-36 md:h-36 mb-4 bg-white p-2 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() => handleQrCodeClick(method.qrCode)}
                      title={t('viewLargerQr', '点击查看大图')}
                    >
                      <Image
                        src={method.qrCode}
                        alt={`${method.type} QR Code`}
                        fill
                        sizes="(max-width: 768px) 128px, 144px"
                        className="object-contain"
                        unoptimized={method.qrCode.startsWith('data:')}
                      />
                    </div>
                  )}
                  <h4 className="text-lg font-semibold mb-1 capitalize text-black">{method.type.toLowerCase()}</h4>
                  {method.value && (
                    <p className="text-sm text-gray-600 break-all" title={method.value}>{method.value}</p>
                  )}
                </div>
              ))}
            </div>
          ) : !fetchError ? (
            <p className="text-center text-gray-600">{t('loadingContacts', '正在加载联系方式...')}</p>
          ) : null}
        </div>
      </section>

      {/* 添加：二维码放大弹窗 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[500px] lg:max-w-[600px] bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900 mb-4">
              {t('qrCodeTitle', '二维码')}
            </DialogTitle>
          </DialogHeader>
          {currentQrCodeUrl && (
            <div className="relative w-full aspect-square max-w-[400px] mx-auto">
              <Image
                src={currentQrCodeUrl}
                alt={t('enlargedQrAlt', '放大的二维码')}
                fill
                sizes="400px"
                className="object-contain"
                unoptimized={currentQrCodeUrl.startsWith('data:')}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 反馈表单部分 */}
      <section className="section-container section-light" id="contact">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-16">
            <div>
              <h3 className="title-lg text-black">{t('sendFeedbackTitle', '发送反馈')}</h3>
              <p className="text-black mb-8">
                {t('feedbackIntro', '我们随时欢迎您的反馈和建议。请填写下方的表格，我们会尽快回复您。')}
              </p>
              <p className="text-black">
                {t('privacyNotice', '我们尊重您的隐私，您的信息将严格保密。')}
              </p>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="card p-8">
                <h3 className="title-lg text-black text-center mb-6">{t('feedbackFormTitle', '反馈表单')}</h3>
                
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