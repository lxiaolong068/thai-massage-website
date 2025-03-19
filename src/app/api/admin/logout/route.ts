import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 获取cookie存储
    const cookieStore = cookies();
    
    // 删除admin_session cookie
    cookieStore.delete('admin_session');
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '登出成功',
    });
  } catch (error) {
    console.error('登出失败:', error);
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
