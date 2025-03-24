import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export const dynamic = 'force-dynamic';

// 文件信息类型定义
interface FileInfo {
  name: string;
  path: string;
  size: number;
  createdAt: Date;
  accessError?: string;
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const THERAPISTS_DIR = path.join(UPLOADS_DIR, 'therapists');

export async function GET() {
  try {
    // 确保目录存在
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(THERAPISTS_DIR)) {
      fs.mkdirSync(THERAPISTS_DIR, { recursive: true });
    }

    // 获取文件列表
    const files: FileInfo[] = [];
    
    try {
      const fileEntries = await fsPromises.readdir(THERAPISTS_DIR);
      
      for (const fileName of fileEntries) {
        try {
          const filePath = path.join(THERAPISTS_DIR, fileName);
          const stat = await fsPromises.stat(filePath);
          
          if (stat.isFile()) {
            // 计算相对于public的路径，用于前端访问
            const relativePath = `/uploads/therapists/${fileName}`;
            
            files.push({
              name: fileName,
              path: relativePath,
              size: stat.size,
              createdAt: new Date(stat.birthtime),
            });
          }
        } catch (fileError) {
          console.error(`读取文件 ${fileName} 信息出错:`, fileError);
          
          files.push({
            name: fileName,
            path: `/uploads/therapists/${fileName}`,
            size: 0,
            createdAt: new Date(),
            accessError: fileError instanceof Error ? fileError.message : '未知错误'
          });
        }
      }
    } catch (dirError) {
      console.error('读取目录出错:', dirError);
      return NextResponse.json({ 
        success: false, 
        error: { 
          message: '读取上传目录失败', 
          details: dirError instanceof Error ? dirError.message : '未知错误'
        } 
      }, { status: 500 });
    }
    
    // 检查目录权限
    let dirInfo = {
      exists: fs.existsSync(THERAPISTS_DIR),
      writable: false,
      readable: false,
      path: THERAPISTS_DIR
    };
    
    try {
      await fsPromises.access(THERAPISTS_DIR, fs.constants.W_OK);
      dirInfo.writable = true;
    } catch (e) {
      dirInfo.writable = false;
    }
    
    try {
      await fsPromises.access(THERAPISTS_DIR, fs.constants.R_OK);
      dirInfo.readable = true;
    } catch (e) {
      dirInfo.readable = false;
    }

    return NextResponse.json({
      success: true,
      data: {
        files: files,
        directory: dirInfo
      }
    });
  } catch (error) {
    console.error('获取上传文件列表出错:', error);
    return NextResponse.json({
      success: false,
      error: {
        message: '获取上传文件列表出错',
        details: error instanceof Error ? error.message : '未知错误'
      }
    }, { status: 500 });
  }
} 