import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError, apiNotFoundError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';

/**
 * 管理API - 获取所有按摩师
 * 此端点需要管理员授权
 */
async function getTherapists(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'zh';
    const serviceId = url.searchParams.get('serviceId');
    
    // 模拟按摩师数据
    const mockTherapists = [
      {
        id: '1',
        imageUrl: '/images/therapist-1.jpg',
        translations: [
          { locale: 'zh', name: '莉莉', bio: '专业按摩师，拥有10年经验。擅长传统泰式按摩和精油按摩。' },
          { locale: 'en', name: 'Lily', bio: 'Professional massage therapist with 10 years of experience. Specializes in traditional Thai massage and oil massage.' },
          { locale: 'ko', name: '릴리', bio: '전문 마사지사, 10년의 경험을 가지고 있습니다. 전통 태국 마사지와 오일 마사지를 전문으로 합니다.' }
        ],
        specialties: ['traditional', 'oil'],
        experience: 10,
        serviceIds: ['1', '2'],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      },
      {
        id: '2',
        imageUrl: '/images/therapist-2.jpg',
        translations: [
          { locale: 'zh', name: '杰森', bio: '专注于深层组织按摩和运动按摩。帮助客户缓解慢性疼痛和肌肉紧张。' },
          { locale: 'en', name: 'Jason', bio: 'Focused on deep tissue and sports massage. Helps clients relieve chronic pain and muscle tension.' },
          { locale: 'ko', name: '제이슨', bio: '딥 티슈 마사지와 스포츠 마사지에 전문화되어 있습니다. 만성 통증과 근육 긴장을 완화하는 데 도움을 줍니다.' }
        ],
        specialties: ['deep-tissue', 'sports'],
        experience: 8,
        serviceIds: ['1', '3'],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      },
      {
        id: '3',
        imageUrl: '/images/therapist-3.jpg',
        translations: [
          { locale: 'zh', name: '小美', bio: '芳香疗法和精油按摩专家。提供放松和舒缓的体验。' },
          { locale: 'en', name: 'Mimi', bio: 'Aromatherapy and oil massage specialist. Provides relaxing and soothing experiences.' },
          { locale: 'ko', name: '미미', bio: '아로마테라피와 오일 마사지 전문가. 편안하고 진정되는 경험을 제공합니다.' }
        ],
        specialties: ['aromatherapy', 'oil'],
        experience: 6,
        serviceIds: ['2', '3'],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      },
      {
        id: '4',
        imageUrl: '/images/therapist-4.jpg',
        translations: [
          { locale: 'zh', name: '托尼', bio: '全方位按摩师，擅长多种按摩技术。致力于提供个性化的按摩体验。' },
          { locale: 'en', name: 'Tony', bio: 'Versatile therapist skilled in various massage techniques. Dedicated to providing personalized massage experiences.' },
          { locale: 'ko', name: '토니', bio: '다양한 마사지 기술에 능숙한 전문 마사지사입니다. 맞춤형 마사지 경험을 제공하는 데 전념하고 있습니다.' }
        ],
        specialties: ['traditional', 'oil', 'foot'],
        experience: 7,
        serviceIds: ['1', '2', '4'],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      }
    ];
    
    // 如果指定了服务ID，则过滤按摩师列表
    let filteredTherapists = mockTherapists;
    if (serviceId) {
      filteredTherapists = mockTherapists.filter(therapist => 
        therapist.serviceIds && therapist.serviceIds.includes(serviceId)
      );
    }
    
    // 返回成功响应
    return apiSuccess(filteredTherapists);
  } catch (error) {
    console.error('获取按摩师列表出错:', error);
    return apiServerError('获取按摩师列表失败');
  }
}

/**
 * 管理API - 创建按摩师
 * 此端点需要管理员授权
 */
async function createTherapist(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { imageUrl, translations, specialties, experience, serviceIds } = body;
    
    // 验证必填字段
    if (!imageUrl || !translations || !specialties || !experience || !serviceIds) {
      return apiValidationError('缺少必填字段');
    }
    
    // 验证经验年限
    if (experience <= 0) {
      return apiValidationError('经验年限必须大于0');
    }
    
    // 验证翻译
    if (!Array.isArray(translations) || translations.length === 0) {
      return apiValidationError('至少需要一种语言的翻译');
    }
    
    // 验证专长
    if (!Array.isArray(specialties) || specialties.length === 0) {
      return apiValidationError('至少需要一项专长');
    }
    
    // 验证服务ID
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return apiValidationError('至少需要一项服务');
    }
    
    // 模拟创建按摩师
    const newTherapist = {
      id: Math.random().toString(36).substring(2, 15),
      imageUrl,
      translations,
      specialties,
      experience,
      serviceIds,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(newTherapist, '按摩师创建成功');
  } catch (error) {
    console.error('创建按摩师出错:', error);
    return apiServerError('创建按摩师失败');
  }
}

/**
 * 管理API - 更新按摩师
 * 此端点需要管理员授权
 */
async function updateTherapist(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id, imageUrl, translations, specialties, experience, serviceIds, isActive } = body;
    
    // 验证必填字段
    if (!id) {
      return apiNotFoundError('按摩师ID不能为空');
    }
    
    // 验证经验年限
    if (experience !== undefined && experience <= 0) {
      return apiValidationError('经验年限必须大于0');
    }
    
    // 模拟更新按摩师
    const updatedTherapist = {
      id,
      imageUrl: imageUrl || '/images/default-therapist.jpg',
      translations: translations || [{ locale: 'zh', name: '按摩师姓名', bio: '按摩师简介' }],
      specialties: specialties || ['traditional'],
      experience: experience !== undefined ? experience : 5,
      serviceIds: serviceIds || ['1'],
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(updatedTherapist, '按摩师更新成功');
  } catch (error) {
    console.error('更新按摩师出错:', error);
    return apiServerError('更新按摩师失败');
  }
}

/**
 * 管理API - 删除按摩师
 * 此端点需要管理员授权
 */
async function deleteTherapist(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id } = body;
    
    // 验证必填字段
    if (!id) {
      return apiNotFoundError('按摩师ID不能为空');
    }
    
    // 模拟删除按摩师（实际上可能是软删除）
    const deletedTherapist = {
      id,
      isActive: false,
      deletedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(deletedTherapist, '按摩师删除成功');
  } catch (error) {
    console.error('删除按摩师出错:', error);
    return apiServerError('删除按摩师失败');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(getTherapists);
export const POST = withAdminApi(createTherapist);
export const PUT = withAdminApi(updateTherapist);
export const DELETE = withAdminApi(deleteTherapist); 