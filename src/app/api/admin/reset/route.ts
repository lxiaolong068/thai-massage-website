import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('重置API: 开始处理请求');
    
    try {
      // 测试数据库连接
      await prisma.$queryRaw`SELECT 1 as connected`;
      console.log('重置API: 数据库连接测试成功');
    } catch (dbError) {
      console.error('重置API: 数据库连接测试失败', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            message: 'Database connection failed',
            details: dbError instanceof Error ? dbError.message : String(dbError)
          } 
        },
        { status: 500 }
      );
    }
    
    // 查看现有的管理员账户
    try {
      const existingAdmins = await prisma.admin.findMany({
        select: { id: true, email: true }
      });
      console.log('重置API: 现有管理员账户:', existingAdmins);
    } catch (error) {
      console.error('重置API: 查询管理员失败', error);
    }
    
    // 删除所有现有的管理员账户
    try {
      console.log('重置API: 删除现有管理员账户');
      const deleteResult = await prisma.admin.deleteMany({});
      console.log('重置API: 删除结果:', deleteResult);
    } catch (error) {
      console.error('重置API: 删除管理员失败', error);
      // 继续执行，尝试创建新账户
    }

    // 创建新的管理员账户
    console.log('重置API: 开始创建管理员账户');
    const adminEmail = 'admin@admin.com';
    const adminPassword = 'admin123';
    
    console.log('重置API: 加密密码');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('重置API: 密码加密完成, 长度:', hashedPassword.length);

    console.log('重置API: 创建管理员账户');
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      }
    });
    console.log('重置API: 管理员账户创建成功:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    });

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        message: '管理员账户已重置，请使用 admin@admin.com / admin123 登录'
      }
    });
  } catch (error) {
    console.error('重置API: 出错:', error);
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