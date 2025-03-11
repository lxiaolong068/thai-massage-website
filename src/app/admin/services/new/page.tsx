'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ServiceTranslation = {
  locale: string;
  name: string;
  description: string;
  slug: string;
};

export default function NewServicePage() {
  const router = useRouter();
  const [price, setPrice] = useState<number>(800);
  const [duration, setDuration] = useState<number>(60);
  const [imageUrl, setImageUrl] = useState<string>('/images/service-placeholder.jpg');
  const [activeTab, setActiveTab] = useState<string>('zh');
  const [translations, setTranslations] = useState<ServiceTranslation[]>([
    { locale: 'zh', name: '', description: '', slug: '' },
    { locale: 'en', name: '', description: '', slug: '' },
    { locale: 'ko', name: '', description: '', slug: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslationChange = (locale: string, field: keyof ServiceTranslation, value: string) => {
    setTranslations(prevTranslations =>
      prevTranslations.map(translation =>
        translation.locale === locale
          ? { ...translation, [field]: value }
          : translation
      )
    );

    // 如果修改的是名称字段，自动生成slug
    if (field === 'name' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 将非单词字符和非中文字符替换为连字符
        .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
      
      setTranslations(prevTranslations =>
        prevTranslations.map(translation =>
          translation.locale === locale
            ? { ...translation, slug }
            : translation
        )
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 验证必填字段
      const currentTranslation = translations.find(t => t.locale === activeTab);
      if (!currentTranslation?.name || !currentTranslation?.description) {
        throw new Error(`请填写${activeTab === 'zh' ? '中文' : activeTab === 'en' ? '英文' : '韩文'}的名称和描述`);
      }

      // 验证所有语言的必填字段
      for (const locale of ['zh', 'en', 'ko']) {
        const translation = translations.find(t => t.locale === locale);
        if (!translation?.name || !translation?.description) {
          throw new Error(`请填写${locale === 'zh' ? '中文' : locale === 'en' ? '英文' : '韩文'}的名称和描述`);
        }
      }

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price,
          duration,
          imageUrl,
          translations,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || '创建服务失败');
      }

      // 创建成功，重定向到服务列表页
      router.push('/admin/services');
    } catch (err: any) {
      setError(err.message || '创建服务失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">添加服务</h1>
        <Link
          href="/admin/services"
          className="text-gray-600 hover:text-gray-900"
        >
          返回列表
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              价格 (泰铢)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              时长 (分钟)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            图片URL
          </label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            请输入图片的URL地址，或使用默认图片
          </p>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {['zh', 'en', 'ko'].map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setActiveTab(locale)}
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === locale
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {locale === 'zh' ? '中文' : locale === 'en' ? '英文' : '韩文'}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4">
            {translations.map((translation) => (
              <div
                key={translation.locale}
                className={`${activeTab === translation.locale ? 'block' : 'hidden'}`}
              >
                <div className="mb-4">
                  <label htmlFor={`name-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    名称
                  </label>
                  <input
                    type="text"
                    id={`name-${translation.locale}`}
                    value={translation.name}
                    onChange={(e) => handleTranslationChange(translation.locale, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required={activeTab === translation.locale}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`description-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    id={`description-${translation.locale}`}
                    value={translation.description}
                    onChange={(e) => handleTranslationChange(translation.locale, 'description', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required={activeTab === translation.locale}
                  ></textarea>
                </div>

                <div>
                  <label htmlFor={`slug-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    URL别名
                  </label>
                  <input
                    type="text"
                    id={`slug-${translation.locale}`}
                    value={translation.slug}
                    onChange={(e) => handleTranslationChange(translation.locale, 'slug', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required={activeTab === translation.locale}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL别名用于生成服务详情页的URL，只能包含字母、数字、连字符和下划线
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/admin/services"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-200 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
} 