import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function AdminRedirect() {
  // Check if user is logged in
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');
  
  // If no session cookie, redirect to login page
  if (!adminSession) {
    redirect('/admin/login');
  }
  
  // If has session cookie, redirect to dashboard
  redirect('/admin/dashboard');
}
