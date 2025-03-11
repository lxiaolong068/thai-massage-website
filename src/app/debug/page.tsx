import { cache } from 'react';
import { prisma } from '@/lib/prisma';

// 定义返回数据类型
type DataResult = {
  success: true;
  counts: {
    services: number;
    therapists: number;
    users: number;
    bookings: number;
    messages: number;
    shopSettings: number;
  };
  examples: {
    services: any[];
    therapists: any[];
  };
} | {
  success: false;
  error: string;
};

// 使用React的cache函数来缓存数据库查询
const getData = cache(async (): Promise<DataResult> => {
  try {
    // 检查服务数据
    const servicesCount = await prisma.service.count();
    
    // 检查按摩师数据
    const therapistsCount = await prisma.therapist.count();
    
    // 检查用户数据
    const usersCount = await prisma.user.count();
    
    // 检查预约数据
    const bookingsCount = await prisma.booking.count();
    
    // 检查留言数据
    const messagesCount = await prisma.message.count();
    
    // 检查店铺设置数据
    const shopSettingsCount = await prisma.shopSetting.count();
    
    // 获取一些示例数据
    let services: any[] = [];
    let therapists: any[] = [];
    
    if (servicesCount > 0) {
      services = await prisma.service.findMany({
        take: 2,
        include: {
          translations: {
            where: {
              locale: 'zh',
            },
          },
        },
      });
    }
    
    if (therapistsCount > 0) {
      therapists = await prisma.therapist.findMany({
        take: 2,
        include: {
          translations: {
            where: {
              locale: 'zh',
            },
          },
        },
      });
    }
    
    return {
      success: true,
      counts: {
        services: servicesCount,
        therapists: therapistsCount,
        users: usersCount,
        bookings: bookingsCount,
        messages: messagesCount,
        shopSettings: shopSettingsCount,
      },
      examples: {
        services,
        therapists,
      }
    };
  } catch (error) {
    console.error('数据库查询出错:', error);
    return {
      success: false,
      error: String(error),
    };
  }
});

export default async function DebugPage() {
  const data = await getData();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">数据库调试信息</h1>
      
      {data.success ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">数据统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">服务</div>
                <div className="text-2xl font-bold">{data.counts.services}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">按摩师</div>
                <div className="text-2xl font-bold">{data.counts.therapists}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">用户</div>
                <div className="text-2xl font-bold">{data.counts.users}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">预约</div>
                <div className="text-2xl font-bold">{data.counts.bookings}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">留言</div>
                <div className="text-2xl font-bold">{data.counts.messages}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <div className="text-lg font-medium">店铺设置</div>
                <div className="text-2xl font-bold">{data.counts.shopSettings}</div>
              </div>
            </div>
          </div>
          
          {data.examples.services.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">服务示例</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(data.examples.services, null, 2)}
              </pre>
            </div>
          )}
          
          {data.examples.therapists.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">按摩师示例</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(data.examples.therapists, null, 2)}
              </pre>
            </div>
          )}
        </>
      ) : (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">错误</h2>
          <pre className="whitespace-pre-wrap">{data.error}</pre>
        </div>
      )}
    </div>
  );
} 