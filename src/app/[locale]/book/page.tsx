import { useTranslations } from 'next-intl';

export default function BookPage() {
  const t = useTranslations('booking');
  
  return (
    <main className="pt-20">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">预约页面</h1>
        <p className="mb-4">此页面正在开发中...</p>
      </div>
    </main>
  );
} 