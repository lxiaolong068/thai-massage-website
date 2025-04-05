import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { decodeToken } from '@/lib/jwt';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=====================================================');
    console.log('check-session API被调用');
    
    // 记录所有cookie
    const allCookies = request.cookies.getAll();
    console.log('所有cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 10)}...`));
    
    // 从cookie和header获取token
    const cookieToken = request.cookies.get('admin_token')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    console.log('Cookie token 存在:', !!cookieToken);
    console.log('Header authorization 存在:', !!authHeader);
    console.log('Header token 存在:', !!headerToken);
    
    // 尝试解码token（不验证签名）看看内容
    if (cookieToken) {
      console.log('尝试解码 Cookie token:');
      try {
        const decoded = decodeToken(cookieToken);
        console.log('Cookie token 解码结果:', decoded);
      } catch (e) {
        console.error('Cookie token 解码失败:', e);
      }
    }
    
    if (headerToken) {
      console.log('尝试解码 Header token:');
      try {
        const decoded = decodeToken(headerToken);
        console.log('Header token 解码结果:', decoded);
      } catch (e) {
        console.error('Header token 解码失败:', e);
      }
    }
    
    // 验证认证
    const user = await verifyAuth(request);
    
    if (!user) {
      console.log('会话检查: 未找到有效的用户会话');
      return NextResponse.json({ 
        success: false, 
        isLoggedIn: false,
        error: { message: 'Invalid token' }
      }, { status: 401 });
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
    
    if (error instanceof Error) {
      console.error(`错误类型: ${error.name}, 消息: ${error.message}`);
    }
    
    return NextResponse.json({ 
      success: false, 
      isLoggedIn: false,
      error: { 
        message: 'Failed to check session',
        details: error instanceof Error ? error.message : String(error)
      } 
    }, { status: 401 });
  }
}
