import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 获取请求体中的凭据
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: '邮箱和密码是必需的'
      }, { status: 400 });
    }
    
    // 查询用户
    const user = await prisma.admin.findFirst({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '找不到用户',
        allAdmins: await prisma.admin.findMany({
          select: { id: true, email: true }
        })
      }, { status: 404 });
    }
    
    // 测试密码验证
    let passwordTestResults = [];
    
    // 测试1: 直接验证
    const directTest = await bcrypt.compare(password, user.password);
    passwordTestResults.push({
      name: '直接验证',
      result: directTest
    });
    
    // 测试2: 创建新哈希并验证
    const newHash = await bcrypt.hash(password, 10);
    const newHashTest = await bcrypt.compare(password, newHash);
    passwordTestResults.push({
      name: '新哈希验证',
      result: newHashTest
    });
    
    // 如果密码验证失败，返回详细信息
    if (!directTest) {
      return NextResponse.json({
        success: false,
        error: '密码验证失败',
        tests: passwordTestResults,
        passwordInfo: {
          storedHashPrefix: user.password.substring(0, 10) + '...',
          storedHashLength: user.password.length,
          newHashPrefix: newHash.substring(0, 10) + '...',
          newHashLength: newHash.length
        }
      }, { status: 401 });
    }
    
    // 测试token生成
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    return NextResponse.json({
      success: true,
      message: 'DEBUG: 登录成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      tokenInfo: {
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 20) + '...'
      },
      passwordTests: passwordTestResults
    });
  } catch (error) {
    console.error('登录调试错误:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 