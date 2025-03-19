import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function AdminRedirect() {
  // 检查用户是否已登录
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');
  
  // 如果没有会话 cookie，重定向到登录页面
  if (!adminSession) {
    redirect('/admin/login');
  }
  
  // 如果有会话 cookie，重定向到仪表盘
  redirect('/admin/dashboard');
}
