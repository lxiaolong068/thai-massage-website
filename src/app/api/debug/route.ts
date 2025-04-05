import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // 确保使用 Node.js 运行时

export async function GET() {
  // 在构建时返回静态响应
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      success: true,
      message: "此调试API路由仅在运行时可用，不支持在构建时静态生成",
      isStaticBuild: true
    });
  }

  try {
    // 获取数据库连接状态
    const result = await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: result
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 