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

    // 从数据库中获取所有该语言的服务项目
    const translations = await prisma.therapistTranslation.findMany({
      where: {
        locale,
      },
      select: {
        specialtiesTranslation: true
      }
    });

    // 提取所有服务项目并去重
    const allSpecialtiesSet = new Set<string>();
    translations.forEach(t => {
      t.specialtiesTranslation.forEach(s => allSpecialtiesSet.add(s));
    });

    // 根据查询过滤
    const filteredSpecialties = Array.from(allSpecialtiesSet)
      .filter(specialty => 
        query ? specialty.toLowerCase().includes(query.toLowerCase()) : true
      )
      .sort();

    return apiSuccess(filteredSpecialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return apiError(
      'SERVER_ERROR',
      'Failed to fetch specialties. Please try again later.',
      500
    );
  }
} 