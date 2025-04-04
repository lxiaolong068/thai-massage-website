import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 创建响应
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
    // 直接在响应中删除cookie
    response.cookies.delete('admin_token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to logout' } },
      { status: 500 }
    );
  }
}
