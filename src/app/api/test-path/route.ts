import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { join } from 'path';

// 检查文件是否存在于public目录
function doesPublicFileExist(filePath: string): boolean {
  try {
    const fullPath = join(process.cwd(), 'public', filePath.startsWith('/') ? filePath.slice(1) : filePath);
    return existsSync(fullPath);
  } catch (err) {
    console.error('检查文件存在性失败:', err);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get('path') || '';
  
  const exists = doesPublicFileExist(path);
  const fullPath = join(process.cwd(), 'public', path.startsWith('/') ? path.slice(1) : path);
  
  // 测试不同格式的占位图路径
  const testPaths = [
    '/images/placeholder-therapist.jpg', 
    'images/placeholder-therapist.jpg',
    '/ko/images/placeholder-therapist.jpg',
    '/en/images/placeholder-therapist.jpg'
  ];
  
  const pathResults = testPaths.map(testPath => {
    const testExists = doesPublicFileExist(testPath);
    const testFullPath = join(process.cwd(), 'public', testPath.startsWith('/') ? testPath.slice(1) : testPath);
    return {
      path: testPath,
      exists: testExists,
      fullPath: testFullPath
    };
  });
  
  return NextResponse.json({
    path,
    exists,
    fullPath,
    testResults: pathResults
  });
} 