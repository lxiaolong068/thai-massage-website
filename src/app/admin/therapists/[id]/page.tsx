'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type TherapistData = {
  name: string;
  bio: string;
  specialtiesTranslation: string[];
};

type Therapist = {
  id: string;
  imageUrl: string;
  specialties: string[];
  experienceYears: number;
  workStatus: 'AVAILABLE' | 'WORKING';
  name: string;
  bio: string;
  specialtiesTranslation: string[];
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
  const [workStatus, setWorkStatus] = useState<'AVAILABLE' | 'WORKING'>('AVAILABLE');
  const [therapistData, setTherapistData] = useState<TherapistData>({
    name: '',
    bio: '',
    specialtiesTranslation: []
  });
  const [loading, setLoading] = useState(!isNewTherapist);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isNewTherapist) {
      return;
    }

    const fetchTherapist = async () => {
      try {
        const response = await fetch(`/api/therapists/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to fetch therapist data');
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to fetch therapist data');
        }

        const therapistData = data.data;
        
        // 获取英文数据
        const localeResponse = await fetch(`/api/therapists/${id}?locale=en`);
        const localeData = await localeResponse.json();
        
        const therapistDataEnglish = {
          name: localeData.data.name || '',
          bio: localeData.data.bio || '',
          specialtiesTranslation: localeData.data.specialtiesTranslation || [],
        };
        
        setTherapist(therapistData);
        setImageUrl(therapistData.imageUrl);
        setSpecialties(therapistData.specialties);
        setExperienceYears(therapistData.experienceYears);
        setWorkStatus(therapistData.workStatus || 'AVAILABLE');
        setTherapistData(therapistDataEnglish);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch therapist data');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id, isNewTherapist]);

  const handleDataChange = (field: keyof TherapistData, value: any) => {
    setTherapistData(prevData => ({
      ...prevData,
      [field]: value
    }));
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

  const handleAddSpecialtyTranslation = () => {
    const input = document.getElementById('specialty-input') as HTMLInputElement;
    const value = input?.value.trim();
    
    if (value && !therapistData.specialtiesTranslation.includes(value)) {
      handleDataChange(
        'specialtiesTranslation', 
        [...therapistData.specialtiesTranslation, value]
      );
      input.value = '';
    }
  };

  const handleRemoveSpecialtyTranslation = (index: number) => {
    handleDataChange(
      'specialtiesTranslation', 
      therapistData.specialtiesTranslation.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!imageUrl) {
      setSaveError('请输入照片URL');
      return;
    }
    if (!experienceYears || experienceYears <= 0) {
      setSaveError('请输入有效的工作经验年数');
      return;
    }
    if (!therapistData.name) {
      setSaveError('请输入按摩师姓名');
      return;
    }
    if (!therapistData.bio) {
      setSaveError('请输入按摩师简介');
      return;
    }
    
    setSaving(true);
    setSaveError('');
    
    const url = isNewTherapist ? '/api/therapists' : `/api/therapists/${id}`;
    const method = isNewTherapist ? 'POST' : 'PUT';
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          specialties,
          experienceYears,
          workStatus,
          translations: [
            {
              locale: 'en',
              name: therapistData.name,
              bio: therapistData.bio,
              specialtiesTranslation: therapistData.specialtiesTranslation,
            }
          ],
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `保存按摩师信息失败: ${response.status}`);
      }
      
      // 显示成功消息
      setSaveSuccess(true);
      
      // 如果是新建，则在2秒后重定向到列表页面
      if (isNewTherapist) {
        setTimeout(() => {
          router.push('/admin/therapists');
        }, 2000);
      }
    } catch (err) {
      setSaveSuccess(false);
      setSaveError(err instanceof Error ? err.message : '保存按摩师信息时发生未知错误');
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

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md mb-6">
        <p className="text-red-700">{error}</p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/admin/therapists">返回按摩师列表</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">
          {id === 'new' ? '添加新按摩师' : '编辑按摩师'}
        </h1>
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            按摩师信息保存成功
          </div>
        )}
        {saveError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {saveError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                照片 URL
              </label>
              <Input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                请输入按摩师照片的URL
              </p>
            </div>
            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                工作经验（年）
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                工作状态
              </label>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setWorkStatus('AVAILABLE')}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${workStatus === 'AVAILABLE' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-green-600 hover:bg-green-50'}`}
                >
                  可预约
                </button>
                <button
                  type="button"
                  onClick={() => setWorkStatus('WORKING')}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${workStatus === 'WORKING' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                >
                  工作中
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              专长（原始语言）
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
            <div className="mt-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <Input
                  type="text"
                  id="name"
                  value={therapistData.name}
                  onChange={(e) => handleDataChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  简介
                </label>
                <textarea
                  id="bio"
                  value={therapistData.bio}
                  onChange={(e) => handleDataChange('bio', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  专长
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    id="specialty-input"
                    className="flex-1 rounded-r-none"
                    placeholder="输入专长"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialtyTranslation())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSpecialtyTranslation}
                    className="rounded-l-none"
                  >
                    添加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {therapistData.specialtiesTranslation.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800"
                    >
                      {specialty}
                      <Button
                        type="button"
                        onClick={() => handleRemoveSpecialtyTranslation(index)}
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-5 w-5 p-0 text-green-400 hover:text-green-600"
                      >
                        &times;
                      </Button>
                    </span>
                  ))}
                  {therapistData.specialtiesTranslation.length === 0 && (
                    <p className="text-sm text-gray-500">尚未添加专长</p>
                  )}
                </div>
              </div>
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
    </div>
  );
}
