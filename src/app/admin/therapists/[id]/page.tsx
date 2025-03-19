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
        setError(err.message || '获取按摩师数据失败');
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
    setError('');
    setSaving(true);

    try {
      // 验证必填字段
      if (!imageUrl) {
        throw new Error('Please enter an image URL');
      }
      
      if (specialties.length === 0) {
        throw new Error('Please add at least one specialty');
      }
      
      if (experienceYears <= 0) {
        throw new Error('Please enter valid years of experience');
      }

      if (!therapistData.name || !therapistData.bio) {
        throw new Error('Please enter the name and bio');
      }
      
      if (therapistData.specialtiesTranslation.length === 0) {
        throw new Error('Please add at least one specialty translation');
      }

      const dataToSubmit = {
        imageUrl,
        specialties,
        experienceYears,
        workStatus,
        name: therapistData.name,
        bio: therapistData.bio,
        specialtiesTranslation: therapistData.specialtiesTranslation,
      };

      const url = isNewTherapist ? '/api/therapists' : `/api/therapists/${id}`;
      const method = isNewTherapist ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
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
        <h1 className="text-2xl font-semibold">{isNewTherapist ? 'Add' : 'Edit'} Therapist</h1>
        <Button asChild variant="outline">
          <Link href="/admin/therapists">
            Back to List
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
              Please enter the URL of the therapist's photo
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Status
            </label>
            <div className="flex border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setWorkStatus('AVAILABLE')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${workStatus === 'AVAILABLE' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Available
              </button>
              <button
                type="button"
                onClick={() => setWorkStatus('WORKING')}
                className={`flex-1 px-4 py-2 text-sm font-medium ${workStatus === 'WORKING' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Working
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialties (Original)
          </label>
          <div className="flex">
            <Input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              className="flex-1 rounded-r-none"
              placeholder="Enter specialty"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
            />
            <Button
              type="button"
              onClick={handleAddSpecialty}
              className="rounded-l-none"
            >
              Add
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
              <p className="text-sm text-gray-500">No specialties added yet</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="mt-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
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
                Bio
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
                Specialties
              </label>
              <div className="flex">
                <Input
                  type="text"
                  id="specialty-input"
                  className="flex-1 rounded-r-none"
                  placeholder="Enter specialty"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialtyTranslation())}
                />
                <Button
                  type="button"
                  onClick={handleAddSpecialtyTranslation}
                  className="rounded-l-none"
                >
                  Add
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
                  <p className="text-sm text-gray-500">No specialties added yet</p>
                )}
              </div>
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
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}
