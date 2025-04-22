/**
 * 客户端认证工具函数
 * 统一处理管理后台认证相关操作
 */

// 检查用户是否已登录
export async function checkAdminAuth(): Promise<{
  isLoggedIn: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
}> {
  try {
    // 首先尝试V1版本的API
    const v1Response = await fetch('/api/v1/admin/check-session', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
    
    // 如果V1版本API成功返回
    if (v1Response.ok) {
      const data = await v1Response.json();
      if (data.success) {
        return {
          isLoggedIn: true,
          user: data.data.user,
        };
      }
    }
    
    // 后备方案：尝试旧版API
    const legacyResponse = await fetch('/api/admin/check-session', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${getAdminToken()}`,
      },
    });
    
    const legacyData = await legacyResponse.json();
    
    if (legacyData.success) {
      return {
        isLoggedIn: true,
        user: legacyData.user,
      };
    }
    
    return {
      isLoggedIn: false,
      error: 'Failed to authenticate',
    };
  } catch (error) {
    console.error('Auth check error:', error);
    return {
      isLoggedIn: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 从本地存储获取管理员令牌
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // 优先使用统一命名的admin_token
  const token = localStorage.getItem('admin_token');
  
  // 后备: 检查旧格式的adminToken
  if (!token) {
    const legacyToken = localStorage.getItem('adminToken');
    if (legacyToken) {
      // 顺便迁移到新格式
      localStorage.setItem('admin_token', legacyToken);
      return legacyToken;
    }
  }
  
  return token;
}

// 从本地存储获取管理员用户信息
export function getAdminUser(): {
  id: string;
  email: string;
  name: string;
  role: string;
} | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userJson = localStorage.getItem('adminUser');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error('Failed to parse admin user data:', e);
    }
  }
  
  return null;
}

// 登出管理员
export async function logoutAdmin(): Promise<boolean> {
  try {
    // 清除所有本地存储相关认证信息
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('adminUser');
    }
    
    // 调用登出API清除服务器cookie
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
    });
    
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}
