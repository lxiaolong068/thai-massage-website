import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';
import { cookies } from 'next/headers';

// 指定为动态路由
export const dynamic = 'force-dynamic';

// 创建上传目录函数
async function ensureUploadDir() {
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'therapists');
  
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }
  
  return uploadDir;
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员会话
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '未授权访问'
          }
        },
        { status: 401 }
      );
    }
    
    // 处理FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: '未提供文件'
          }
        },
        { status: 400 }
      );
    }
    
    // 验证文件类型
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: '只支持图片文件'
          }
        },
        { status: 400 }
      );
    }
    
    // 创建唯一文件名
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // 确保上传目录存在
    const uploadDir = await ensureUploadDir();
    const filePath = join(uploadDir, fileName);
    
    // 将文件写入服务器
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);
    
    // 返回文件URL路径
    const fileUrl = `/uploads/therapists/${fileName}`;
    
    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl
      },
      message: '文件上传成功'
    });
  } catch (error) {
    console.error('上传文件失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '服务器错误，请稍后重试',
          details: error instanceof Error ? error.message : '未知错误'
        }
      },
      { status: 500 }
    );
  }
} 