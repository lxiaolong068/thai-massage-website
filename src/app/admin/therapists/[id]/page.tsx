'use client';

import React, { useEffect, useState } from 'react';
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

type TherapistData = {
  id?: string;
  name: string;
  bio: string;
  specialtiesTranslation: string[];
  specialties: string[];
  experienceYears: number;
  workStatus: string;
  imageUrl: string;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [workStatus, setWorkStatus] = useState<'AVAILABLE' | 'WORKING'>('AVAILABLE');
  const [therapistData, setTherapistData] = useState<TherapistData>({
    name: '',
    bio: '',
    specialtiesTranslation: [],
    specialties: [],
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
          specialties: localeData.data.specialties || [],
          experienceYears: localeData.data.experienceYears || 0,
          workStatus: localeData.data.workStatus || 'AVAILABLE',
          imageUrl: localeData.data.imageUrl || '',
        };
        
        setTherapist(therapistData);
        setImageUrl(therapistData.imageUrl);
        setImagePreview(therapistData.imageUrl); // 设置初始图片预览
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

  // 处理图片上传
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setSaveError('Please select an image file');
      return;
    }

    // Create temporary URL for preview immediately
    const previewUrl = URL.createObjectURL(file);
    console.log('Creating temporary preview URL:', previewUrl);
    
    setImageFile(file);
    setImagePreview(previewUrl); // Set image preview immediately
    setSaveError('');
    
    // Execute actual upload
    handleImageUpload(e);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setTherapistData(prevData => ({
      ...prevData,
      imageUrl: '', // Clear image URL in therapist data
    }));
  };

  // 更新头像图片
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Uploading image file:', file.name, file.size, file.type);
    setImageLoading(true);
    
    // 立即创建本地预览
    const localPreviewUrl = URL.createObjectURL(file);
    console.log('Created local preview URL:', localPreviewUrl);
    setImagePreview(localPreviewUrl);
    
    try {
      // Show loading status
      const loadingToastId = 'upload-loading';
      toast.loading('Uploading image...', { id: loadingToastId });
      
      const formData = new FormData();
      formData.append('file', file);

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
        console.log('Image upload successful, response data:', result);
        
        // Ensure URL starts with /
        const imageUrl = result.data.url.startsWith('/')
          ? result.data.url
          : `/${result.data.url}`;
        
        console.log('Formatted server image URL:', imageUrl);
        
        // 不修改预览图，继续使用本地预览
        // 只更新数据库存储的URL
        setImageUrl(imageUrl);
        
        // 创建一个图片元素来验证图片
        const validateImage = document.createElement('img');
        validateImage.onload = () => {
          console.log('Uploaded image validated successfully');
        };
        validateImage.onerror = () => {
          console.error('Uploaded image URL is invalid:', imageUrl);
          // 设计接下来的操作，继续使用本地预览
        };
        validateImage.src = imageUrl;
        
        // Update therapist data
        setTherapistData(prevData => ({
          ...prevData,
          imageUrl: imageUrl,
        }));
        
        // Update therapist state if it exists
        if (therapist) {
          setTherapist(prevTherapist => ({
            ...prevTherapist!,
            imageUrl: imageUrl,
          }));
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

  const handleSubmit = async (e: React.FormEvent, shouldRedirect = true) => {
    e.preventDefault();
    
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // 构建更新数据
      const updateData = {
        ...therapistData,
      };
      
      // 使用当前的imageUrl，不再通过handleImageUpload获取
      // 因为图片上传已经单独处理了
      
      // 发送更新请求
      const response = await fetch(`/api/therapists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save therapist information');
      }
      
      const data = await response.json();
      console.log('Save successful:', data);
      
      setSaveSuccess(true);
      toast.success('Saved successfully!');
      
      if (shouldRedirect) {
        router.push('/admin/therapists');
      }
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

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
            <div className="flex items-center gap-4">
              {/* Debug image URLs */}
              {(() => {
                console.log('Current image states:', {
                  imageUrl,
                  imagePreview,
                  therapistImageUrl: therapist?.imageUrl,
                  therapistDataImageUrl: therapistData.imageUrl
                });
                return null;
              })()}
              
              {/* 图片预览和上传区域 */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-40 h-40">
                  {/* 使用标准 img 标签 */}
                  {(() => {
                    console.log('Rendering image with URL:', imagePreview || therapistData.imageUrl || '/images/placeholder-therapist.jpg');
                    return null;
                  })()}
                  <img
                    src={imagePreview || therapistData.imageUrl || '/images/placeholder-therapist.jpg'}
                    alt="Therapist photo"
                    className="object-cover rounded-lg w-full h-full"
                    onError={(e) => {
                      console.error('Image load error for:', e.currentTarget.src);
                      // 图片加载失败，立即使用占位图片
                      e.currentTarget.src = '/images/placeholder-therapist.jpg';
                      // 如果是从服务器加载的图片失败，更新状态
                      if (e.currentTarget.src === therapistData.imageUrl) {
                        console.log('Updating therapistData.imageUrl to placeholder');
                        setTherapistData(prev => ({
                          ...prev,
                          imageUrl: '/images/placeholder-therapist.jpg'
                        }));
                      }
                    }}
                  />
                  {(imagePreview || therapistData.imageUrl) && (
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
                
                {/* 文件上传按钮 */}
                <div className="flex flex-col items-center space-y-2">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <Upload className="mr-2 h-4 w-4" />
                    {imagePreview || therapistData.imageUrl ? 'Change image' : 'Upload image'}
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
                onChange={(e) => handleDataChange('experienceYears', Number(e.target.value))}
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
                  onClick={() => handleDataChange('workStatus', 'AVAILABLE')}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${therapistData.workStatus === 'AVAILABLE' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-white text-green-600 hover:bg-green-50'}`}
                >
                  Available
                </button>
                <button
                  type="button"
                  onClick={() => handleDataChange('workStatus', 'WORKING')}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${therapistData.workStatus === 'WORKING' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                >
                  Working
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
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

            <div>
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

            <div>
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
              {saving || imageLoading ? 'Processing...' : 'Save'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
