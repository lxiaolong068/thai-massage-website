import { NextRequest, NextResponse } from 'next/server';
import { apiAuthError } from '@/utils/api/response';
import { verifyAuth } from '@/lib/auth';

/**
 * API版本控制中间件
 * 用于处理API版本兼容性
 */
export function withApiVersion(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // 从请求头获取API版本
    const apiVersionHeader = req.headers.get('API-Version');
    
    // 从URL路径获取API版本
    const pathVersion = req.nextUrl.pathname.split('/')[2]; // 例如 /api/v1/... 中的 v1
    
    // 确定使用的API版本
    const version = apiVersionHeader || (pathVersion.startsWith('v') ? pathVersion : 'v1');
    
    // 如果请求的是不支持的版本，返回错误
    if (version !== 'v1') {
      return apiAuthError(`不支持的API版本: ${version}，当前支持的版本为: v1`);
    }
    
    // 继续处理请求
    return handler(req);
  };
}

/**
 * 公共API中间件
 * 公共API不需要授权
 */
export function withPublicApi(handler: (req: NextRequest) => Promise<NextResponse>) {
  return withApiVersion(async (req: NextRequest) => {
    // 公共API不需要授权检查
    return handler(req);
  });
}

/**
 * 客户端API中间件
 * 客户端API需要客户授权
 */
export function withClientApi(handler: (req: NextRequest) => Promise<NextResponse>) {
  return withApiVersion(async (req: NextRequest) => {
    // 获取客户授权令牌
    const token = req.cookies.get('client_token')?.value;
    
    // 如果没有令牌，返回未授权错误
    if (!token) {
      return apiAuthError('需要客户授权');
    }
    
    // TODO: 验证令牌有效性
    // 这里应该添加令牌验证逻辑
    
    // 继续处理请求
    return handler(req);
  });
}

/**
 * 管理API中间件
 * 管理API需要管理员授权
 */
export function withAdminApi(handler: (req: NextRequest) => Promise<NextResponse>) {
  return withApiVersion(async (req: NextRequest) => {
    try {
      // 使用统一的认证逻辑进行验证
      const user = await verifyAuth(req);

      // 如果没有有效用户或用户不是管理员，返回未授权错误
      if (!user || user.role?.toLowerCase() !== 'admin') {
        return apiAuthError('需要管理员授权');
      }

      // 将用户信息添加到请求中
      (req as any).user = user;
      
      // 继续处理请求
      return handler(req);
    } catch (error) {
      console.error('管理API授权验证失败:', error);
      return apiAuthError('授权验证失败');
    }
  });
} 