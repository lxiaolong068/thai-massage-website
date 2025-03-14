'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type TherapistTranslation = {
  locale: string;
  name: string;
  bio: string;
  specialtiesTranslation: string[];
};

type Therapist = {
  id: string;
  imageUrl: string;
  specialties: string[];
  experienceYears: number;
  translations: TherapistTranslation[];
};

export default function TherapistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const isNewTherapist = id === 'new';
  
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('zh');
  const [translations, setTranslations] = useState<TherapistTranslation[]>([
    { locale: 'zh', name: '', bio: '', specialtiesTranslation: [] },
    { locale: 'en', name: '', bio: '', specialtiesTranslation: [] },
    { locale: 'ko', name: '', bio: '', specialtiesTranslation: [] },
  ]);
  const [loading, setLoading] = useState(!isNewTherapist);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNewTherapist) {
      return;
    }

    const fetchTherapist = async () => {
      try {
        const response = await fetch(`/api/therapists/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || '获取按摩师数据失败');
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error?.message || '获取按摩师数据失败');
        }

        const therapistData = data.data;
        
        // 获取所有语言的翻译
        const allTranslationsResponse = await Promise.all(
          ['zh', 'en', 'ko'].map(locale => 
            fetch(`/api/therapists/${id}?locale=${locale}`).then(res => res.json())
          )
        );
        
        const allTranslations = allTranslationsResponse.map((res, index) => {
          const localeData = res.data;
          return {
            locale: ['zh', 'en', 'ko'][index],
            name: localeData.name || '',
            bio: localeData.bio || '',
            specialtiesTranslation: localeData.specialtiesTranslation || [],
          };
        });
        
        setTherapist(therapistData);
        setImageUrl(therapistData.imageUrl);
        setSpecialties(therapistData.specialties);
        setExperienceYears(therapistData.experienceYears);
        setTranslations(allTranslations);
      } catch (err: any) {
        setError(err.message || '获取按摩师数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id, isNewTherapist]);

  const handleTranslationChange = (locale: string, field: keyof TherapistTranslation, value: any) => {
    setTranslations(prevTranslations =>
      prevTranslations.map(translation =>
        translation.locale === locale
          ? { ...translation, [field]: value }
          : translation
      )
    );
  };

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleAddSpecialtyTranslation = (locale: string) => {
    const translation = translations.find(t => t.locale === locale);
    const input = document.getElementById(`specialty-input-${locale}`) as HTMLInputElement;
    const value = input?.value.trim();
    
    if (value && translation && !translation.specialtiesTranslation.includes(value)) {
      handleTranslationChange(
        locale, 
        'specialtiesTranslation', 
        [...translation.specialtiesTranslation, value]
      );
      input.value = '';
    }
  };

  const handleRemoveSpecialtyTranslation = (locale: string, index: number) => {
    const translation = translations.find(t => t.locale === locale);
    if (translation) {
      handleTranslationChange(
        locale, 
        'specialtiesTranslation', 
        translation.specialtiesTranslation.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // 验证必填字段
      if (!imageUrl) {
        throw new Error('请填写图片URL');
      }
      
      if (specialties.length === 0) {
        throw new Error('请至少添加一个专长');
      }
      
      if (experienceYears <= 0) {
        throw new Error('请填写有效的经验年限');
      }

      for (const locale of ['zh', 'en', 'ko']) {
        const translation = translations.find(t => t.locale === locale);
        if (!translation?.name || !translation?.bio) {
          throw new Error(`请填写${locale === 'zh' ? '中文' : locale === 'en' ? '英文' : '韩文'}的姓名和简介`);
        }
        
        if (translation.specialtiesTranslation.length === 0) {
          throw new Error(`请至少添加一个${locale === 'zh' ? '中文' : locale === 'en' ? '英文' : '韩文'}的专长翻译`);
        }
      }

      const therapistData = {
        imageUrl,
        specialties,
        experienceYears,
        translations,
      };

      const url = isNewTherapist ? '/api/therapists' : `/api/therapists/${id}`;
      const method = isNewTherapist ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(therapistData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || `${isNewTherapist ? '创建' : '更新'}按摩师失败`);
      }

      toast.success(`按摩师${isNewTherapist ? '创建' : '更新'}成功`);
      // 操作成功，重定向到按摩师列表页
      router.push('/admin/therapists');
    } catch (err: any) {
      setError(err.message || `${isNewTherapist ? '创建' : '更新'}按摩师失败，请稍后再试`);
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

  if (error && !therapist && !isNewTherapist) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-500">{error}</div>
        <Link
          href="/admin/therapists"
          className="mt-4 inline-block text-primary hover:underline"
        >
          返回按摩师列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{isNewTherapist ? '添加' : '编辑'}按摩师</h1>
        <Button asChild variant="outline">
          <Link href="/admin/therapists">
            返回列表
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              图片URL
            </label>
            <Input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              请输入按摩师照片的URL地址
            </p>
          </div>
          <div>
            <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
              经验年限
            </label>
            <Input
              type="number"
              id="experienceYears"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              min="1"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            专长 (原始语言)
          </label>
          <div className="flex">
            <Input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              className="flex-1 rounded-r-none"
              placeholder="输入专长"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
            />
            <Button
              type="button"
              onClick={handleAddSpecialty}
              className="rounded-l-none"
            >
              添加
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
              >
                {specialty}
                <Button
                  type="button"
                  onClick={() => handleRemoveSpecialty(index)}
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-5 w-5 p-0 text-blue-400 hover:text-blue-600"
                >
                  &times;
                </Button>
              </span>
            ))}
            {specialties.length === 0 && (
              <p className="text-sm text-gray-500">尚未添加专长</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {['zh', 'en', 'ko'].map((locale) => (
                <Button
                  key={locale}
                  type="button"
                  onClick={() => setActiveTab(locale)}
                  variant="ghost"
                  className={`py-2 px-4 text-sm font-medium rounded-none ${
                    activeTab === locale
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {locale === 'zh' ? '中文' : locale === 'en' ? '英文' : '韩文'}
                </Button>
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
                    姓名
                  </label>
                  <Input
                    type="text"
                    id={`name-${translation.locale}`}
                    value={translation.name}
                    onChange={(e) => handleTranslationChange(translation.locale, 'name', e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`bio-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    简介
                  </label>
                  <textarea
                    id={`bio-${translation.locale}`}
                    value={translation.bio}
                    onChange={(e) => handleTranslationChange(translation.locale, 'bio', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    专长翻译
                  </label>
                  <div className="flex">
                    <Input
                      type="text"
                      id={`specialty-input-${translation.locale}`}
                      className="flex-1 rounded-r-none"
                      placeholder={`输入${translation.locale === 'zh' ? '中文' : translation.locale === 'en' ? '英文' : '韩文'}专长`}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialtyTranslation(translation.locale))}
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSpecialtyTranslation(translation.locale)}
                      className="rounded-l-none"
                    >
                      添加
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {translation.specialtiesTranslation.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800"
                      >
                        {specialty}
                        <Button
                          type="button"
                          onClick={() => handleRemoveSpecialtyTranslation(translation.locale, index)}
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-5 w-5 p-0 text-green-400 hover:text-green-600"
                        >
                          &times;
                        </Button>
                      </span>
                    ))}
                    {translation.specialtiesTranslation.length === 0 && (
                      <p className="text-sm text-gray-500">尚未添加专长翻译</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/therapists">
              取消
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </div>
  );
}
