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
    const password = url.searchParams.get('password') || 'admin123';
    const debug = url.searchParams.get('debug') === 'true';
    
    // 获取管理员用户列表
    const allAdmins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        ...(debug ? { password: true } : {})
      }
    });
    
    // 查找指定用户
    const user = await prisma.admin.findFirst({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: `用户不存在: ${email}`,
        allAdmins: allAdmins.map(admin => ({
          ...admin,
          ...(debug && admin.password ? { 
            passwordPrefix: admin.password.substring(0, 10) + '...',
            passwordType: typeof admin.password,
            passwordLength: admin.password.length
          } : {})
        }))
      });
    }
    
    // 直接测试加密和验证
    const testHash = await bcrypt.hash(password, 10);
    const selfTestResult = await bcrypt.compare(password, testHash);
    
    // 验证用户密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    return NextResponse.json({
      success: true,
      passwordResult: {
        inputEmail: email,
        inputPassword: password,
        isPasswordValid: isPasswordValid,
        bcryptSelfTest: selfTestResult,
        userPasswordType: typeof user.password,
        userPasswordLength: user.password.length,
        ...(debug ? { userPasswordPrefix: user.password.substring(0, 10) + '...' } : {})
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      allAdmins: allAdmins.length
    });
  } catch (error) {
    console.error('Login test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 