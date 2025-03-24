'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function DebugUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取已上传的文件列表
  const fetchUploadedFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/uploads');
      const data = await response.json();
      if (data.success) {
        setUploadedFiles(data.data.files || []);
      } else {
        console.error('获取文件列表失败:', data.error);
        toast.error('获取文件列表失败: ' + data.error.message);
      }
    } catch (error) {
      console.error('获取文件列表出错:', error);
      toast.error('获取文件列表出错');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('请先选择文件');
      return;
    }

    setUploading(true);
    setUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      toast.loading('正在上传...', { id: 'upload-toast' });
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      toast.dismiss('upload-toast');

      if (data.success) {
        toast.success('上传成功！');
        setUploadResult(data);
        
        // 刷新文件列表
        await fetchUploadedFiles();
        
        // 测试生成的URL是否可访问
        checkImageAccessibility(data.data.url);
      } else {
        toast.error('上传失败: ' + data.error.message);
        setUploadResult({
          success: false,
          error: data.error
        });
      }
    } catch (error) {
      toast.dismiss('upload-toast');
      toast.error('上传出错');
      setUploadResult({
        success: false,
        error: { message: error instanceof Error ? error.message : '未知错误' }
      });
    } finally {
      setUploading(false);
    }
  };

  const checkImageAccessibility = (url: string) => {
    if (!url) return;
    
    const img = new Image();
    img.onload = () => {
      console.log('图片可以正常访问:', url);
      toast.success('图片可以正常访问');
    };
    img.onerror = () => {
      console.error('图片无法访问:', url);
      toast.error('图片无法访问: ' + url);
    };
    img.src = url;
  };

  const testImageVisibility = (imagePath: string) => {
    if (!imagePath) return;
    checkImageAccessibility(imagePath);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">图片上传调试工具</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>上传测试</CardTitle>
            <CardDescription>选择文件并上传以测试图片上传功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">选择图片</label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  disabled={uploading} 
                />
              </div>
              
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">预览</p>
                  <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="预览" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || uploading}
                className="mt-4"
              >
                {uploading ? '上传中...' : '上传图片'}
              </Button>
            </div>
          </CardContent>
          {uploadResult && (
            <CardFooter className="flex flex-col items-start border-t p-4">
              <h3 className="font-medium mb-2">上传结果</h3>
              <pre className="text-xs bg-gray-100 p-3 rounded-md max-h-40 overflow-auto w-full">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
              
              {uploadResult.success && uploadResult.data?.url && (
                <div className="mt-3">
                  <p className="mb-1">图片URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 p-1 rounded">{uploadResult.data.url}</code>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testImageVisibility(uploadResult.data.url)}
                    >
                      测试访问
                    </Button>
                  </div>
                </div>
              )}
            </CardFooter>
          )}
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>已上传的文件</CardTitle>
            <CardDescription className="flex justify-between">
              <span>查看服务器中存储的图片文件</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchUploadedFiles}
                disabled={loading}
              >
                {loading ? '加载中...' : '刷新'}
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-4">加载中...</p>
            ) : uploadedFiles.length === 0 ? (
              <p className="text-center text-gray-500 py-4">没有找到已上传的文件</p>
            ) : (
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                    <div className="text-xs text-gray-500">路径: {file.path}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testImageVisibility(file.path)}
                      >
                        测试访问
                      </Button>
                      <a 
                        href={file.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm hover:underline"
                      >
                        查看图片
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button asChild variant="outline">
              <Link href="/admin/therapists">返回按摩师管理</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 