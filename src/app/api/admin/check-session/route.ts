import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('check-session API被调用');
    console.log('所有cookies:', request.cookies.getAll().map(c => c.name));
    
    const user = await verifyAuth(request);
    
    if (!user) {
      console.log('会话检查: 未找到有效的用户会话');
      return NextResponse.json({ 
        success: false, 
        isLoggedIn: false 
      });
    }

    console.log('会话检查: 找到有效的用户会话:', user.email);
    
    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ 
      success: false, 
      isLoggedIn: false,
      error: { message: 'Failed to check session' } 
    });
  }
}
