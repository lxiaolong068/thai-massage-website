'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
};

export default function ServiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const isNewService = id === 'new';
  
  const [service, setService] = useState<Service | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [translations, setTranslations] = useState<ServiceTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch service data');
        }
        
        const data = await response.json();
        const serviceData = data.data;
        
        // Get translations for all supported languages
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
        setError(err.message || 'Failed to fetch service data');
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
      // Validate required fields
      for (const locale of ['en', 'zh', 'ko']) {
        const translation = translations.find(t => t.locale === locale);
        if (!translation?.name || !translation?.description) {
          throw new Error(`Please fill in the name and description for ${locale === 'zh' ? 'Chinese' : locale === 'en' ? 'English' : 'Korean'}`);
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
        throw new Error(data.error?.message || 'Failed to update service');
      }

      router.push('/admin/services');
    } catch (err: any) {
      setError(err.message || 'Failed to update service. Please try again later');
    } finally {
      setSaving(false);
    }
  };

  // 处理图片上传
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // 创建临时预览URL
    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
    
    // 执行实际上传
    handleImageUpload(e);
  };

  // 移除图片
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (service) {
      setService({
        ...service,
        imageUrl: '',
      });
    }
  };

  // 更新服务图片
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    
    try {
      const loadingToastId = 'upload-loading';
      toast.loading('Uploading image...', { id: loadingToastId });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'service');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        toast.dismiss(loadingToastId);
        console.error('Server returned error status:', response.status);
        toast.error('File upload failed: Server error');
        return;
      }

      const result = await response.json();
      toast.dismiss(loadingToastId);

      if (result.success) {
        const imageUrl = result.data.url.startsWith('/') ? result.data.url : `/${result.data.url}`;
        
        setImageUrl(imageUrl);
        if (service) {
          setService({
            ...service,
            imageUrl: imageUrl,
          });
        }
        
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
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
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isNewService ? 'Add New Service' : 'Edit Service'}
        </h1>
        <Link href="/admin/services">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Service Image</label>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40">
                <img
                  src={imagePreview || service?.imageUrl || '/images/placeholder-service.jpg'}
                  alt="Service photo"
                  className="object-cover rounded-lg w-full h-full"
                  onError={(e) => {
                    console.error('Image load error for:', e.currentTarget.src);
                    e.currentTarget.src = '/images/placeholder-service.jpg';
                    if (e.currentTarget.src === service?.imageUrl) {
                      setService(prev => ({
                        ...prev,
                        imageUrl: '/images/placeholder-service.jpg'
                      }));
                    }
                  }}
                />
                {(imagePreview || service?.imageUrl) && (
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
                  {imagePreview || service?.imageUrl ? 'Change image' : 'Upload image'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (THB)
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
              Duration (minutes)
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">Translations</h2>
          <div className="space-y-6">
            {translations.map((translation) => (
              <div
                key={translation.locale}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  {translation.locale === 'zh' ? 'Chinese' : translation.locale === 'en' ? 'English' : 'Korean'}
                </h3>

                <div className="mb-4">
                  <label htmlFor={`name-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Name
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
                    Description
                  </label>
                  <textarea
                    id={`description-${translation.locale}`}
                    value={translation.description}
                    onChange={(e) => handleTranslationChange(translation.locale, 'description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={`slug-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id={`slug-${translation.locale}`}
                    value={translation.slug}
                    readOnly
                    disabled
                    className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 cursor-not-allowed text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL slug is automatically generated from the English service name and cannot be modified manually to ensure consistency.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button asChild variant="outline">
            <Link href="/admin/services">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={saving || imageLoading}
          >
            {saving || imageLoading ? 'Processing...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
} 