'use client';

import React, { useState } from 'react';

export default function TestUpload() {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    console.log('选择的文件:', file.name, file.size, file.type);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('上传结果:', result);
      setUploadResult(result);
    } catch (error) {
      console.error('上传错误:', error);
      setUploadResult({ success: false, error: String(error) });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>文件上传测试</h1>
      
      <div style={{ margin: '20px 0' }}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && <span>上传中...</span>}
      </div>
      
      {uploadResult && (
        <div style={{ margin: '20px 0' }}>
          <h2>上传结果</h2>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(uploadResult, null, 2)}
          </pre>
          
          {uploadResult.success && uploadResult.data?.url && (
            <div>
              <p>图片预览:</p>
              <img 
                src={uploadResult.data.url} 
                alt="上传预览" 
                style={{ maxWidth: '300px', border: '1px solid #ddd' }} 
                onError={(e) => {
                  console.error('图片加载失败:', uploadResult.data.url);
                  e.currentTarget.style.border = '2px solid red';
                  e.currentTarget.style.padding = '10px';
                  e.currentTarget.style.backgroundColor = '#ffeeee';
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 