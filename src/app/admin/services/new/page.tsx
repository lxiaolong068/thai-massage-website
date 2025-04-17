'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
  const [imageUrl, setImageUrl] = useState<string>('/images/placeholder-service.jpg');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('zh');
  const [translations, setTranslations] = useState<ServiceTranslation[]>([
    { locale: 'zh', name: '', description: '', slug: '' },
    { locale: 'en', name: '', description: '', slug: '' },
    { locale: 'ko', name: '', description: '', slug: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);

  const handleTranslationChange = (locale: string, field: keyof ServiceTranslation, value: string) => {
    setTranslations(prevTranslations =>
      prevTranslations.map(translation =>
        translation.locale === locale
          ? { ...translation, [field]: value }
          : translation
      )
    );

    // If the name field is modified, automatically generate slug
    if (field === 'name' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // Replace non-word characters and non-Chinese characters with hyphens
        .replace(/^-+|-+$/g, ''); // Remove hyphens at the beginning and end
      
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
      // Validate required fields
      for (const locale of ['en', 'zh', 'ko']) {
        const translation = translations.find(t => t.locale === locale);
        if (!translation?.name || !translation?.description) {
          throw new Error(`Please fill in the name and description for ${locale === 'zh' ? 'Chinese' : locale === 'en' ? 'English' : 'Korean'}`);
        }
      }

      // 验证图片
      if (!imageUrl) {
        throw new Error('Please upload a service image');
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
          sortOrder,
          translations,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to create service');
      }

      router.push('/admin/services');
    } catch (err: any) {
      setError(err.message || 'Failed to create service. Please try again later');
    } finally {
      setLoading(false);
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
    setImageUrl('/images/placeholder-service.jpg');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Service</h1>
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
                  src={imagePreview || imageUrl}
                  alt="Service photo"
                  className="object-cover rounded-lg w-full h-full"
                  onError={(e) => {
                    console.error('Image load error for:', e.currentTarget.src);
                    e.currentTarget.src = '/images/placeholder-service.jpg';
                  }}
                />
                {(imagePreview || imageUrl !== '/images/placeholder-service.jpg') && (
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
                  {imagePreview || imageUrl !== '/images/placeholder-service.jpg' ? 'Change image' : 'Upload image'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imageLoading}
                  />
                </label>
                <p className="text-xs text-gray-500">
                  Supports JPG, PNG format images
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <input
              type="number"
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div>
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
                  {locale === 'zh' ? 'Chinese' : locale === 'en' ? 'English' : 'Korean'}
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
                <div>
                  <label htmlFor={`description-${translation.locale}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id={`description-${translation.locale}`}
                    value={translation.description}
                    onChange={(e) => handleTranslationChange(translation.locale, 'description', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="text-red-500">{error}</div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || imageLoading}
            className="w-full md:w-auto px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {loading ? 'Creating...' : 'Create Service'}
          </Button>
        </div>
      </form>
    </div>
  );
} 