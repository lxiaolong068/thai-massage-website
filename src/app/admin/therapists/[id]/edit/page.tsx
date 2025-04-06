'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TherapistTranslation = {
  locale: string;
  name: string;
  bio: string;
  specialties: string[];
};

type TherapistData = {
  id?: string;
  translations: TherapistTranslation[];
  experienceYears: number;
  workStatus: string;
  imageUrl: string;
};

type Therapist = {
  id: string;
  imageUrl: string;
  experienceYears: number;
  workStatus: 'AVAILABLE' | 'WORKING';
  translations: TherapistTranslation[];
};

const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ko', name: '한국어' },
];

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [currentLocale, setCurrentLocale] = useState<string>('en');
  const [therapistData, setTherapistData] = useState<TherapistData>({
    translations: SUPPORTED_LOCALES.map(locale => ({
      locale: locale.code,
      name: '',
      bio: '',
      specialties: []
    })),
    experienceYears: 0,
    workStatus: 'AVAILABLE',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(!isNewTherapist);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNewTherapist) {
      return;
    }

    const fetchTherapist = async () => {
      try {
        // 获取所有语言版本的数据
        const responses = await Promise.all(
          SUPPORTED_LOCALES.map(locale => 
            fetch(`/api/therapists/${id}?locale=${locale.code}`).then(res => res.json())
          )
        );
        
        // 检查是否所有请求都成功
        const hasError = responses.some(res => !res.success);
        if (hasError) {
          const errors = responses.filter(res => !res.success).map(res => res.error?.message || `Locale ${res.locale} fetch failed`);
          console.error("Error fetching translations:", errors);
          throw new Error(`Failed to fetch some translations: ${errors.join(', ')}`);
        }

        // 合并所有语言版本的数据
        const translations = responses.map((res, index) => ({
          locale: SUPPORTED_LOCALES[index].code,
          name: res.data.name || '',
          bio: res.data.bio || '',
          specialties: res.data.specialties || []
        }));
        
        // 调试：打印获取到的翻译数据
        console.log("Fetched Translations:", translations);

        // 使用第一个响应（英文）的基本数据
        const baseData = responses[0].data;
        
        setTherapistData({
          id: baseData.id,
          translations,
          experienceYears: baseData.experienceYears || 0,
          workStatus: baseData.workStatus || 'AVAILABLE',
          imageUrl: baseData.imageUrl || '',
        });
        
        // 调试：打印更新后的 therapistData 状态
        console.log("Updated Therapist Data State:", {
          id: baseData.id,
          translations,
          experienceYears: baseData.experienceYears || 0,
          workStatus: baseData.workStatus || 'AVAILABLE',
          imageUrl: baseData.imageUrl || '',
        });
        
        setImageUrl(baseData.imageUrl || '');
        setImagePreview(baseData.imageUrl || '');
      } catch (err: any) {
        console.error("Error in fetchTherapist:", err);
        setError(err.message || 'Failed to fetch therapist data');
        toast.error('Failed to load therapist data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id, isNewTherapist]);

  // 添加点击外部关闭建议列表的处理
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 获取服务建议
  const fetchSuggestions = async (query: string, locale: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/specialties?locale=${locale}&query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 处理输入变化
  const handleSpecialtyInputChange = (e: React.ChangeEvent<HTMLInputElement>, locale: string) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value, locale);
  };

  // 处理建议选择
  const handleSuggestionClick = (locale: string, specialty: string) => {
    handleAddSpecialty(locale, specialty);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleTranslationChange = (locale: string, field: keyof Omit<TherapistTranslation, 'locale'>, value: any) => {
    setTherapistData(prevData => ({
      ...prevData,
      translations: prevData.translations.map(translation =>
        translation.locale === locale
          ? { ...translation, [field]: value }
          : translation
      )
    }));
  };

  // 处理图片上传
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveError('Please select an image file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    console.log('Creating temporary preview URL:', previewUrl);
    
    setImageFile(file);
    setImagePreview(previewUrl);
    setSaveError('');
    
    handleImageUpload(e);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setTherapistData(prevData => ({
      ...prevData,
      imageUrl: '',
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();

      if (result.success) {
        console.log('Image upload successful, response data:', result);
        
        const imageUrl = result.data.url.startsWith('/')
          ? result.data.url
          : `/${result.data.url}`;
        
        console.log('Formatted server image URL:', imageUrl);
        
        setImageUrl(imageUrl);
        
        const validateImage = document.createElement('img');
        validateImage.onload = () => {
          console.log('Uploaded image validated successfully');
        };
        validateImage.onerror = () => {
          console.error('Uploaded image URL is invalid:', imageUrl);
        };
        validateImage.src = imageUrl;
        
        setTherapistData(prevData => ({
          ...prevData,
          imageUrl: imageUrl,
        }));
        
        toast.success('Image uploaded successfully');
      } else {
        console.error('Image upload failed:', result.error);
        toast.error(`Image upload failed: ${result.error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Error during image upload');
    } finally {
      setImageLoading(false);
    }
  };

  const handleAddSpecialty = (locale: string, specialty: string) => {
    if (specialty.trim()) {
      handleTranslationChange(
        locale,
        'specialties',
        [...(therapistData.translations.find(t => t.locale === locale)?.specialties || []), specialty.trim()]
      );
    }
  };

  const handleRemoveSpecialty = (locale: string, index: number) => {
    const translation = therapistData.translations.find(t => t.locale === locale);
    if (translation) {
      handleTranslationChange(
        locale,
        'specialties',
        translation.specialties.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      const method = isNewTherapist ? 'POST' : 'PUT';
      const url = isNewTherapist ? '/api/therapists' : `/api/therapists/${id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(therapistData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save therapist information');
      }
      
      const data = await response.json();
      console.log('Save successful:', data);
      
      setSaveSuccess(true);
      toast.success('Saved successfully!');
      
      router.push('/admin/therapists');
    } catch (error) {
      console.error('Save failed:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
      toast.error('Save failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md mb-6">
        <p className="text-red-700">{error}</p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/admin/therapists">Return to therapist list</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentTranslation = therapistData.translations.find(t => t.locale === currentLocale) || {
    locale: currentLocale,
    name: '',
    bio: '',
    specialties: []
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewTherapist ? 'Add New Therapist' : 'Edit Therapist'}
        </h1>
        <Link href="/admin/therapists">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Profile Image</label>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40">
                <img
                  src={imagePreview || imageUrl || '/images/placeholder-therapist.jpg'}
                  alt="Therapist photo"
                  className="object-cover rounded-lg w-full h-full"
                  onError={(e) => {
                    console.error('Image load error for:', e.currentTarget.src);
                    e.currentTarget.src = '/images/placeholder-therapist.jpg';
                  }}
                />
                {(imagePreview || imageUrl) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex flex-col items-center space-y-2">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <Upload className="mr-2 h-4 w-4" />
                  {imagePreview || imageUrl ? 'Change image' : 'Upload image'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG format images
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
              Work Experience (years)
            </label>
            <Input
              type="number"
              id="experienceYears"
              value={therapistData.experienceYears}
              onChange={(e) => setTherapistData(prev => ({ ...prev, experienceYears: Number(e.target.value) }))}
              min="0"
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
                onClick={() => setTherapistData(prev => ({ ...prev, workStatus: 'AVAILABLE' }))}
                className={`flex-1 px-4 py-2 text-sm font-medium ${therapistData.workStatus === 'AVAILABLE' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-green-600 hover:bg-green-50'}`}
              >
                Available
              </button>
              <button
                type="button"
                onClick={() => setTherapistData(prev => ({ ...prev, workStatus: 'WORKING' }))}
                className={`flex-1 px-4 py-2 text-sm font-medium ${therapistData.workStatus === 'WORKING' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              >
                Working
              </button>
            </div>
          </div>
        </div>

        <Tabs value={currentLocale} onValueChange={setCurrentLocale} className="w-full">
          <TabsList className="w-full justify-start">
            {SUPPORTED_LOCALES.map(locale => (
              <TabsTrigger
                key={locale.code}
                value={locale.code}
                className="min-w-[100px]"
              >
                {locale.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {SUPPORTED_LOCALES.map(locale => (
            <TabsContent key={locale.code} value={locale.code} className="space-y-6">
              <div>
                <label htmlFor={`name-${locale.code}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Name ({locale.name})
                </label>
                <Input
                  type="text"
                  id={`name-${locale.code}`}
                  value={therapistData.translations.find(t => t.locale === locale.code)?.name || ''}
                  onChange={(e) => handleTranslationChange(locale.code, 'name', e.target.value)}
                  required={locale.code === 'en'}
                />
              </div>

              <div>
                <label htmlFor={`bio-${locale.code}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Bio ({locale.name})
                </label>
                <textarea
                  id={`bio-${locale.code}`}
                  value={therapistData.translations.find(t => t.locale === locale.code)?.bio || ''}
                  onChange={(e) => handleTranslationChange(locale.code, 'bio', e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required={locale.code === 'en'}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties ({locale.name})
                </label>
                <div className="relative">
                  <div className="flex">
                    <Input
                      type="text"
                      id={`specialty-input-${locale.code}`}
                      className="flex-1 rounded-r-none"
                      placeholder={`Enter specialty in ${locale.name}`}
                      value={inputValue}
                      onChange={(e) => handleSpecialtyInputChange(e, locale.code)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSpecialty(locale.code, inputValue);
                          setInputValue('');
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        handleAddSpecialty(locale.code, inputValue);
                        setInputValue('');
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="rounded-l-none"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSuggestionClick(locale.code, suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {therapistData.translations.find(t => t.locale === locale.code)?.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(locale.code, index)}
                        className="ml-1.5 h-4 w-4 rounded-full text-green-400 hover:text-green-600"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/therapists">
              Cancel
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={saving || imageLoading}
          >
            {saving || imageLoading ? 'Processing...' : (isNewTherapist ? 'Create Therapist' : 'Save Changes')}
          </Button>
        </div>
      </form>
    </div>
  );
}
