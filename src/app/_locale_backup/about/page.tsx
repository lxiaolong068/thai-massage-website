import { Link } from '@/i18n/navigation';

export default function AboutPage() {
  return (
    <main className="pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">关于我们</h1>
        <p className="mb-4">这是一个关于页面的简单示例，用于测试国际化路由。</p>
        <p className="mb-8">我们提供优质的泰式按摩服务，致力于为客户带来放松和舒适的体验。</p>
        
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </div>
    </main>
  );
} 