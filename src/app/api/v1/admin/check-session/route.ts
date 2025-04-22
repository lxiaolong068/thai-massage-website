import { NextRequest } from 'next/server';
import { apiSuccess, apiAuthError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

/**
 * 检查管理员会话状态
 * 由于使用了withAdminApi中间件，该函数只有在用户通过认证后才会被调用
 */
async function checkAdminSession(request: NextRequest) {
  try {
    // 获取用户信息(由中间件放入请求中)
    const user = (request as any).user;
    
    if (!user) {
      // 这种情况理论上不会发生，因为withAdminApi已经验证了用户
      return apiAuthError('未找到有效的用户会话');
    }

    // 返回用户信息
    return apiSuccess({
      isLoggedIn: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('会话检查出错:', error);
    return apiAuthError('会话验证失败');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(checkAdminSession);
