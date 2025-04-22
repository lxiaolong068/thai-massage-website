import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 使用清除认证cookie辅助函数
    clearAuthCookie();
    
    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // 在响应中也删除cookie，确保客户端和服务器端都清除
    response.cookies.delete('admin_token');
    response.cookies.delete('admin_session');
    response.cookies.delete('admin_session_data');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to logout' } },
      { status: 500 }
    );
  }
}
