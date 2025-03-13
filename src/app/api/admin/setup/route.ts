import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// 检查是否已存在管理员账户
export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: {
        role: UserRole.ADMIN,
      },
    });

    return NextResponse.json({
      adminExists: adminCount > 0,
    });
  } catch (error) {
    console.error('检查管理员账户失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '服务器错误，请稍后再试',
        },
      },
      { status: 500 }
    );
  }
}

// 此API仅用于初始设置管理员账户
export async function POST(request: Request) {
  try {
    // 检查是否已存在管理员用户
    const existingAdmins = await prisma.user.count({
      where: {
        role: UserRole.ADMIN,
      },
    });

    // 如果已存在管理员，则不允许再次设置
    if (existingAdmins > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ADMIN_EXISTS',
            message: '管理员账户已存在，无法重复设置',
          },
        },
        { status: 400 }
      );
    }

    const { name, email, password } = await request.json();

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: '请提供姓名、邮箱和密码',
          },
        },
        { status: 400 }
      );
    }

    // 动态导入bcrypt并加密密码
    const bcrypt = await import('bcrypt');
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建管理员用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: UserRole.ADMIN,
      },
    });

    // 返回成功响应（不包含密码）
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('设置管理员账户失败:', error);
    
    // 处理唯一约束错误
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DUPLICATE_EMAIL',
            message: '该邮箱已被使用',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '服务器错误，请稍后再试',
        },
      },
      { status: 500 }
    );
  }
}
