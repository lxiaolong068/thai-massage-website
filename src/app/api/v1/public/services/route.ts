import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError } from '@/utils/api/response';
import { withPublicApi } from '../../middleware';

/**
 * 公开API - 获取所有服务
 * 此端点不需要授权，可直接访问
 */
async function getServices(request: NextRequest) {
  // 获取locale参数
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';
  
  try {
    // 模拟服务数据 - 支持中文、英文和韩文
    // 实际项目中应该从数据库获取
    const mockServices = [
      {
        id: '1',
        price: 1200,
        duration: 60,
        imageUrl: '/images/traditional-thai-new.jpg',
        name: locale === 'zh' ? '传统泰式按摩' : locale === 'ko' ? '전통 태국 마사지' : 'Traditional Thai Massage',
        description: locale === 'zh' ? '使用正宗技术的古老按摩方法，缓解身体紧张。' : 
                    locale === 'ko' ? '정통 기법을 사용한 고대 마사지 방법으로 신체 긴장을 풀어줍니다.' : 
                    'Ancient massage method using authentic techniques to relieve body tension.',
        slug: 'traditional-thai-massage',
      },
      {
        id: '2',
        price: 1500,
        duration: 90,
        imageUrl: '/images/oil-massage-new.jpg',
        name: locale === 'zh' ? '精油按摩' : locale === 'ko' ? '오일 마사지' : 'Oil Massage',
        description: locale === 'zh' ? '使用芳香精油的放松按摩，舒缓您的身心。' : 
                    locale === 'ko' ? '향기로운 오일을 사용하는 편안한 마사지로 신체와 마음을 위로합니다.' : 
                    'Relaxing massage using aromatic oils to soothe your body and mind.',
        slug: 'oil-massage',
      },
      {
        id: '3',
        price: 1800,
        duration: 120,
        imageUrl: '/images/aromatherapy-massage.jpg',
        name: locale === 'zh' ? '芳香疗法按摩' : locale === 'ko' ? '아로마테라피 마사지' : 'Aromatherapy Massage',
        description: locale === 'zh' ? '使用精油的治疗按摩，带来深度放松。' : 
                    locale === 'ko' ? '딥 릴랙스에 위한 에센셜 오일을 사용한 치료 마사지입니다.' : 
                    'Therapeutic massage using essential oils for deep relaxation.',
        slug: 'aromatherapy-massage',
      },
      {
        id: '4',
        price: 1000,
        duration: 45,
        imageUrl: '/images/foot-massage.jpg',
        name: locale === 'zh' ? '足部按摩' : locale === 'ko' ? '발 마사지' : 'Foot Massage',
        description: locale === 'zh' ? '反射区按摩技术，为您的双脚和身体注入活力。' : 
                    locale === 'ko' ? '발과 신체를 활기차게 하는 반사구학 기법입니다.' : 
                    'Reflexology techniques to energize your feet and body.',
        slug: 'foot-massage',
      },
    ];

    // 使用apiSuccess返回统一格式的成功响应
    return apiSuccess(mockServices);
  } catch (error) {
    console.error('获取服务列表出错:', error);
    // 使用apiServerError返回统一格式的错误响应
    return apiServerError('获取服务列表失败');
  }
}

// 使用公共API中间件包装处理函数
export const GET = withPublicApi(getServices); 