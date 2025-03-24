'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  defaultImageUrl?: string;
  className?: string;
  apiEndpoint?: string;
}

export function ImageUpload({
  onUploadSuccess,
  onUploadError,
  defaultImageUrl,
  className = '',
  apiEndpoint = '/api/upload',
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImageUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(defaultImageUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 创建本地预览
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);

    // 自动上传
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const loadingToastId = 'upload-loading';
      toast.loading('正在上传图片...', { id: loadingToastId });
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      toast.dismiss(loadingToastId);

      if (result.success) {
        // 确保URL以/开头
        const imageUrl = result.data.url.startsWith('/') 
          ? result.data.url 
          : `/${result.data.url}`;
        
        console.log('图片上传成功:', imageUrl);
        setUploadedUrl(imageUrl);
        toast.success('图片上传成功');
        
        // 测试图片可访问性
        testImageAccessibility(imageUrl);
        
        // 触发成功回调
        if (onUploadSuccess) {
          onUploadSuccess(imageUrl);
        }
      } else {
        const errorMessage = result.error?.message || '未知错误';
        console.error('图片上传失败:', errorMessage);
        toast.error(`图片上传失败: ${errorMessage}`);
        
        // 触发错误回调
        if (onUploadError) {
          onUploadError(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      console.error('图片上传出错:', error);
      toast.error(`图片上传过程中出错: ${errorMessage}`);
      
      // 触发错误回调
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  const testImageAccessibility = (url: string) => {
    if (!url) return;
    
    const img = new window.Image();
    img.onload = () => {
      console.log('图片可以正常访问:', url);
    };
    img.onerror = () => {
      console.error('图片无法访问:', url);
      toast.error('图片上传成功但无法加载，可能存在访问权限问题');
      
      if (onUploadError) {
        onUploadError('图片上传成功但无法加载，可能存在访问权限问题');
      }
    };
    img.src = url;
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setUploadedUrl(null);
    
    if (onUploadSuccess) {
      onUploadSuccess('');  // 设置为空字符串表示移除图片
    }
  };

  // 图片加载错误处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn('图片加载错误，使用占位图', e.currentTarget.src);
    e.currentTarget.src = '/images/placeholder-therapist.jpg';
  };

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      {previewUrl && (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="预览图片" 
            className="w-32 h-32 object-cover rounded-md border" 
            onError={handleImageError}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
            onClick={handleRemoveImage}
            disabled={uploading}
          >
            ×
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="max-w-xs"
        />
        
        {uploading && (
          <div className="text-sm text-gray-500">上传中...</div>
        )}
      </div>
    </div>
  );
} 