import { redirect } from 'next/navigation';

// 重定向到默认语言页面
export default function HomePage() {
  // 重定向到英语页面（作为默认语言）
  redirect('/en');
}
