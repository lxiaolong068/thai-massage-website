/**
 * 增强型fetch工具函数，自动添加认证头
 */

/**
 * 获取存储的认证token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('admin_token');
}

/**
 * 带认证的fetch请求，如果存在token则自动添加authorization头
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
  
  return fetch(url, options);
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
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  return response.json();
} 