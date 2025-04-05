/**
 * 增强型fetch工具函数，自动添加认证头和处理认证失效情况
 */

/**
 * 获取存储的认证token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('admin_token');
}

/**
 * 处理认证失败的情况
 */
export function handleAuthFailure(): void {
  if (typeof window === 'undefined') return;
  
  console.log('认证失败，清除凭证并重定向到登录页面');
  
  // 清除本地存储的认证信息
  localStorage.removeItem('admin_token');
  localStorage.removeItem('adminUser');
  
  // 获取当前URL作为回调
  const callbackUrl = encodeURIComponent(window.location.href);
  
  // 重定向到登录页面
  window.location.href = `/admin/login?callbackUrl=${callbackUrl}`;
}

/**
 * 带认证的fetch请求，如果存在token则自动添加authorization头
 * 自动处理401认证错误
 */
export async function authFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  
  // 如果有token，添加到headers
  if (token) {
    const headers = new Headers(options.headers || {});
    
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    options.headers = headers;
  }
  
  // 确保包含认证cookies
  if (!options.credentials) {
    options.credentials = 'include';
  }
  
  const response = await fetch(url, options);
  
  // 如果请求是401 Unauthorized，处理认证失败
  if (response.status === 401) {
    console.log('请求返回401未授权状态，可能需要重新登录');
    
    // 如果API请求，不自动重定向，而是由调用方处理
    if (!url.startsWith('/api/admin/login')) {
      handleAuthFailure();
    }
  }
  
  return response;
}

/**
 * 带认证的json请求
 */
export async function authJsonFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  options.headers = headers;
  
  const response = await authFetch(url, options);
  
  if (!response.ok) {
    try {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `API错误: ${response.status}`;
      
      console.error(`API请求失败: ${url}`, errorData);
      throw new Error(errorMessage);
    } catch (parseError) {
      console.error(`API请求失败: ${url}，无法解析错误响应`, parseError);
      throw new Error(`API请求失败: ${response.status}`);
    }
  }
  
  return response.json();
} 