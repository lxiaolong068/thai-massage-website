import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || 'admin@admin.com';
    const testPassword = url.searchParams.get('password') || 'admin123';
    
    // 查找用户
    const user = await prisma.admin.findFirst({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: `用户不存在: ${email}`,
        allAccounts: await prisma.admin.findMany({
          select: { id: true, email: true }
        })
      });
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    // 快速测试手动加密
    const testHash = await bcrypt.hash(testPassword, 10);
    const testCompare = await bcrypt.compare(testPassword, testHash);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHashPrefix: user.password.substring(0, 10) + '...'
      },
      passwordTest: {
        inputPassword: testPassword,
        isValid: isValid,
        testHashPrefix: testHash.substring(0, 10) + '...',
        testCompareResult: testCompare
      }
    });
  } catch (error) {
    console.error('Password test error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 