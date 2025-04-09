import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

// 指定为动态路由
export const dynamic = 'force-dynamic';

// 获取所有服务项目
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const query = searchParams.get('query') || '';

    // 检查是否处于构建过程
    const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build';
    if (isBuildTime) {
      return apiSuccess([
        'Oil Massage',
        'Thai Massage',
        'Foot Massage',
        'Head & Shoulder Massage'
      ]);
    }

    // 从 ServiceTranslation 表中获取符合条件的服务名称
    const serviceTranslations = await prisma.serviceTranslation.findMany({
      where: {
        locale,
        name: {
          contains: query,
          mode: 'insensitive', // 忽略大小写
        },
      },
      select: {
        name: true, // 只选择服务名称
      },
      orderBy: {
        name: 'asc', // 按名称排序
      },
      take: 10, // 限制建议数量
    });

    // 提取服务名称列表
    const suggestions = serviceTranslations.map(st => st.name);

    return apiSuccess(suggestions);
  } catch (error) {
    console.error('Error fetching service specialties suggestions:', error);
    return apiError(
      'SERVER_ERROR',
      'Failed to fetch specialties. Please try again later.',
      500
    );
  }
} 