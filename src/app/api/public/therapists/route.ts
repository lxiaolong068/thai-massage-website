import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError } from '@/utils/api/response';

/**
 * 公开API - 获取所有按摩师或按服务ID过滤的按摩师列表
 * 此端点不需要授权，可直接访问
 */
export async function GET(request: NextRequest) {
  // 获取参数
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';
  const serviceId = url.searchParams.get('serviceId');
  
  try {
    // 模拟按摩师数据 - 支持中文、英文和韩文
    // 实际项目中应该从数据库获取
    const mockTherapists = [
      {
        id: '1',
        name: locale === 'zh' ? '莉莉' : locale === 'ko' ? '릴리' : 'Lily',
        imageUrl: '/images/therapist-1.jpg',
        bio: locale === 'zh' ? '专业按摩师，拥有10年经验。擅长传统泰式按摩和精油按摩。' : 
            locale === 'ko' ? '전문 마사지사, 10년의 경험을 가지고 있습니다. 전통 태국 마사지와 오일 마사지를 전문으로 합니다.' : 
            'Professional massage therapist with 10 years of experience. Specializes in traditional Thai massage and oil massage.',
        specialties: ['traditional', 'oil'],
        experience: 10,
        experienceYears: 10,
        serviceIds: ['1', '2']
      },
      {
        id: '2',
        name: locale === 'zh' ? '杰森' : locale === 'ko' ? '제이슨' : 'Jason',
        imageUrl: '/images/therapist-2.jpg',
        bio: locale === 'zh' ? '专注于深层组织按摩和运动按摩。帮助客户缓解慢性疼痛和肌肉紧张。' : 
            locale === 'ko' ? '딥 티슈 마사지와 스포츠 마사지에 전문화되어 있습니다. 만성 통증과 근육 긴장을 완화하는 데 도움을 줍니다.' : 
            'Focused on deep tissue and sports massage. Helps clients relieve chronic pain and muscle tension.',
        specialties: ['deep-tissue', 'sports'],
        experience: 8,
        experienceYears: 8,
        serviceIds: ['1', '3']
      },
      {
        id: '3',
        name: locale === 'zh' ? '小美' : locale === 'ko' ? '미미' : 'Mimi',
        imageUrl: '/images/therapist-3.jpg',
        bio: locale === 'zh' ? '芳香疗法和精油按摩专家。提供放松和舒缓的体验。' : 
            locale === 'ko' ? '아로마테라피와 오일 마사지 전문가. 편안하고 진정되는 경험을 제공합니다.' : 
            'Aromatherapy and oil massage specialist. Provides relaxing and soothing experiences.',
        specialties: ['aromatherapy', 'oil'],
        experience: 6,
        experienceYears: 6,
        serviceIds: ['2', '3']
      },
      {
        id: '4',
        name: locale === 'zh' ? '托尼' : locale === 'ko' ? '토니' : 'Tony',
        imageUrl: '/images/therapist-4.jpg',
        bio: locale === 'zh' ? '全方位按摩师，擅长多种按摩技术。致力于提供个性化的按摩体验。' : 
            locale === 'ko' ? '다양한 마사지 기술에 능숙한 전문 마사지사입니다. 맞춤형 마사지 경험을 제공하는 데 전념하고 있습니다.' : 
            'Versatile therapist skilled in various massage techniques. Dedicated to providing personalized massage experiences.',
        specialties: ['traditional', 'oil', 'foot'],
        experience: 7,
        experienceYears: 7,
        serviceIds: ['1', '2', '4']
      }
    ];

    // 如果指定了服务ID，则过滤按摩师列表
    let filteredTherapists = mockTherapists;
    if (serviceId) {
      filteredTherapists = mockTherapists.filter(therapist => 
        therapist.serviceIds && therapist.serviceIds.includes(serviceId)
      );
    }

    // 使用apiSuccess返回统一格式的成功响应
    return apiSuccess(filteredTherapists);
  } catch (error) {
    console.error('获取按摩师列表出错:', error);
    // 使用apiServerError返回统一格式的错误响应
    return apiServerError('获取按摩师列表失败');
  }
} 