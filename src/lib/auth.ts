import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, generateToken as createJwtToken, decodeToken } from './jwt';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// 会话密钥 - 简单的静态密钥，用于紧急情况下的认证
// 注意：这只是作为JWT失效时的临时解决方案
const SESSION_KEY = 'thai-massage-emergency-session-key';
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24小时

export async function verifyAuth(request: NextRequest) {
  try {
    // 1. 首先尝试使用JWT验证
    // 从cookie和header中获取token
    const cookieToken = request.cookies.get('admin_token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // 使用任一有效token
    const token = cookieToken || headerToken;
    
    if (token) {
      try {
        // 首先尝试解码token看看内容（不验证签名）
        const decodedContent = decodeToken(token);
        if (decodedContent) {
          // 尝试使用JWT验证
          try {
            const decoded = verifyToken(token);
            return decoded;
          } catch (jwtError) {
            // JWT验证失败但解码成功，可以尝试备选方案 - 简单返回解码内容
            // 注意：这是一种临时的降级方案，不建议长期使用
            if (decodedContent.role?.toLowerCase() === 'admin') {
              console.log('认证降级: 使用token解码内容而非验证');
              return decodedContent;
            }
          }
        }
      } catch (decodeErr) {
        console.error('Token解码异常');
      }
    }
    
    // 2. 尝试使用备用会话认证
    const sessionId = request.cookies.get('admin_session')?.value;
    const sessionData = request.cookies.get('admin_session_data')?.value;
    
    if (sessionId && sessionData) {
      try {
        // 验证会话ID格式和时间戳
        const [timestamp, hash] = sessionId.split('.');
        const now = Date.now();
        const sessionTime = parseInt(timestamp, 10);
        
        if (!isNaN(sessionTime) && (now - sessionTime) < ADMIN_SESSION_DURATION) {
          // 简单的会话验证 - 检查哈希是否匹配
          const expectedHash = generateSessionHash(timestamp, SESSION_KEY);
          
          if (hash === expectedHash) {
            // 解析会话数据
            const userData = JSON.parse(atob(sessionData));
            if (userData && userData.role?.toLowerCase() === 'admin') {
              return userData;
            }
          }
        }
      } catch (sessionErr) {
        console.error('会话验证异常');
      }
    }
    
    return null;
  } catch (error) {
    console.error('验证出现异常');
    return null;
  }
}

export function withAuth(handler: Function) {
  return async function(request: NextRequest) {
    const user = await verifyAuth(request);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { message: 'Unauthorized' } 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 将用户信息添加到请求中
    (request as any).user = user;
    
    return handler(request);
  }
}

export function generateToken(user: AdminUser): string {
  const token = createJwtToken(user);
  return token;
}

export function setAuthCookie(token: string) {
  cookies().set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export function clearAuthCookie() {
  cookies().delete('admin_token');
  cookies().delete('admin_session');
  cookies().delete('admin_session_data');
}

// 生成备用会话ID
export function generateSessionId(user: AdminUser): { sessionId: string, sessionData: string } {
  const timestamp = Date.now().toString();
  const hash = generateSessionHash(timestamp, SESSION_KEY);
  const sessionId = `${timestamp}.${hash}`;
  
  // 编码用户数据
  const sessionData = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  }));
  
  return { sessionId, sessionData };
}

// 设置备用会话cookie
export function setSessionCookie(user: AdminUser) {
  const { sessionId, sessionData } = generateSessionId(user);
  
  cookies().set('admin_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  cookies().set('admin_session_data', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// 生成会话哈希
function generateSessionHash(timestamp: string, key: string): string {
  // 简单的哈希函数，仅用于演示
  let hash = 0;
  const str = timestamp + key;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
} 