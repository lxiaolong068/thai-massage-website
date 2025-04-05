import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 测试数据库连接
    let dbStatus = 'unknown';
    try {
      const result = await prisma.$queryRaw`SELECT 1 as connected`;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error: ' + (error instanceof Error ? error.message : String(error));
    }

    // 测试管理员账户存在性
    let adminStatus = 'unknown';
    let adminCount = 0;
    try {
      adminCount = await prisma.admin.count();
      adminStatus = adminCount > 0 ? `${adminCount} accounts found` : 'no accounts';
    } catch (error) {
      adminStatus = 'error: ' + (error instanceof Error ? error.message : String(error));
    }

    // 返回系统状态信息
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        url: process.env.DATABASE_URL ? '(configured)' : '(missing)',
      },
      admin: {
        status: adminStatus,
        count: adminCount
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          message: 'Internal server error',
          details: error instanceof Error ? error.message : String(error)
        } 
      },
      { status: 500 }
    );
  }
} 