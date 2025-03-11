'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ServiceTranslation = {
  locale: string;
  name: string;
  description: string;
  slug: string;
};

type Service = {
  id: string;
  price: number;
  duration: number;
  imageUrl: string;
  translations: ServiceTranslation[];
};

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  
  const [service, setService] = useState<Service | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('zh');
  const [translations, setTranslations] = useState<ServiceTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('获取服务数据失败');
        }
        
        const data = await response.json();
        const serviceData = data.data;
        
        // 获取所有语言的翻译
        const allTranslationsResponse = await Promise.all(
          ['zh', 'en', 'ko'].map(locale => 
            fetch(`/api/services/${id}?locale=${locale}`).then(res => res.json())
          )
        );
        
        const allTranslations = allTranslationsResponse.map((res, index) => ({
          locale: ['zh', 'en', 'ko'][index],
          name: res.data.name || '',
          description: res.data.description || '',
          slug: res.data.slug || '',
        }));
        
        setService(serviceData);
        setPrice(serviceData.price);
        setDuration(serviceData.duration);
        setImageUrl(serviceData.imageUrl);
        setTranslations(allTranslations);
      } catch (err: any) {
        setError(err.message || '获取服务数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleTranslationChange = (locale: string, field: keyof ServiceTranslation, value: string) => {
    setTranslations(prevTranslations =>
      prevTranslations.map(translation =>
        translation.locale === locale
          ? { ...translation, [field]: value }
          : translation
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // 验证必填字段
      for (const locale of ['zh', 'en', 'ko']) {
        const translation = translations.find(t => t.locale === locale);
        if (!translation?.name || !translation?.description) {
          throw new Error(`请填写${locale === 'zh' ? '中文' : locale === 'en' ? '英文' : '韩文'}的名称和描述`);
        }
      }

      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
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
        throw new Error(data.error?.message || '更新服务失败');
      }

      // 更新成功，重定向到服务列表页
      router.push('/admin/services');
    } catch (err: any) {
      setError(err.message || '更新服务失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-500">{error}</div>
        <Link
          href="/admin/services"
          className="mt-4 inline-block text-primary hover:underline"
        >
          返回服务列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">编辑服务</h1>
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
            请输入图片的URL地址
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
                    required
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
                    required
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
                    required
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
            disabled={saving}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
} 