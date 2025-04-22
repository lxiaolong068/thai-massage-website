import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken, decodeToken } from '@/lib/jwt';

export default function AdminRedirect() {
  // 获取所有可能的认证cookie
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');
  const adminToken = cookieStore.get('admin_token');
  
  // 检查是否有任何认证信息
  const hasAuth = adminSession || adminToken;
  
  // 如果没有认证信息，重定向到登录页面
  if (!hasAuth) {
    redirect('/admin/login');
  }
  
  // 如果有认证信息，重定向到仪表盘
  redirect('/admin/dashboard');
}
