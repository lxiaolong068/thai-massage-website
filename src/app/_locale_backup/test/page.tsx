import { Link } from '@/i18n/navigation';

export default function TestPage() {
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-3xl font-bold mb-4">测试页面</h1>
      <p className="mb-4">这是一个简单的测试页面，用于验证路由配置。</p>
      <Link href="/" className="text-blue-500 hover:underline">
        返回首页
      </Link>
    </div>
  );
} 