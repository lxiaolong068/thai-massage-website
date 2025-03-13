import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError, apiNotFoundError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';

/**
 * 管理API - 获取所有服务
 * 此端点需要管理员授权
 */
async function getServices(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'zh';
    
    // 模拟服务数据
    const mockServices = [
      {
        id: '1',
        price: 1200,
        duration: 60,
        imageUrl: '/images/traditional-thai-new.jpg',
        translations: [
          { locale: 'zh', name: '传统泰式按摩', description: '使用正宗技术的古老按摩方法，缓解身体紧张。' },
          { locale: 'en', name: 'Traditional Thai Massage', description: 'Ancient massage method using authentic techniques to relieve body tension.' },
          { locale: 'ko', name: '전통 태국 마사지', description: '정통 기법을 사용한 고대 마사지 방법으로 신체 긴장을 풀어줍니다.' }
        ],
        slug: 'traditional-thai-massage',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      },
      {
        id: '2',
        price: 1500,
        duration: 90,
        imageUrl: '/images/oil-massage-new.jpg',
        translations: [
          { locale: 'zh', name: '精油按摩', description: '使用芳香精油的放松按摩，舒缓您的身心。' },
          { locale: 'en', name: 'Oil Massage', description: 'Relaxing massage using aromatic oils to soothe your body and mind.' },
          { locale: 'ko', name: '오일 마사지', description: '향기로운 오일을 사용하는 편안한 마사지로 신체와 마음을 위로합니다.' }
        ],
        slug: 'oil-massage',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      },
      {
        id: '3',
        price: 1800,
        duration: 120,
        imageUrl: '/images/aromatherapy-massage.jpg',
        translations: [
          { locale: 'zh', name: '芳香疗法按摩', description: '使用精油的治疗按摩，带来深度放松。' },
          { locale: 'en', name: 'Aromatherapy Massage', description: 'Therapeutic massage using essential oils for deep relaxation.' },
          { locale: 'ko', name: '아로마테라피 마사지', description: '딥 릴랙스에 위한 에센셜 오일을 사용한 치료 마사지입니다.' }
        ],
        slug: 'aromatherapy-massage',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      },
      {
        id: '4',
        price: 1000,
        duration: 45,
        imageUrl: '/images/foot-massage.jpg',
        translations: [
          { locale: 'zh', name: '足部按摩', description: '反射区按摩技术，为您的双脚和身体注入活力。' },
          { locale: 'en', name: 'Foot Massage', description: 'Reflexology techniques to energize your feet and body.' },
          { locale: 'ko', name: '발 마사지', description: '발과 신체를 활기차게 하는 반사구학 기법입니다.' }
        ],
        slug: 'foot-massage',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-10-15T08:30:00Z'
      }
    ];
    
    // 返回成功响应
    return apiSuccess(mockServices);
  } catch (error) {
    console.error('获取服务列表出错:', error);
    return apiServerError('获取服务列表失败');
  }
}

/**
 * 管理API - 创建服务
 * 此端点需要管理员授权
 */
async function createService(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { price, duration, imageUrl, translations, slug } = body;
    
    // 验证必填字段
    if (!price || !duration || !imageUrl || !translations || !slug) {
      return apiValidationError('缺少必填字段');
    }
    
    // 验证价格和时长
    if (price <= 0 || duration <= 0) {
      return apiValidationError('价格和时长必须大于0');
    }
    
    // 验证翻译
    if (!Array.isArray(translations) || translations.length === 0) {
      return apiValidationError('至少需要一种语言的翻译');
    }
    
    // 验证slug格式
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return apiValidationError('slug格式不正确，只能包含小写字母、数字和连字符');
    }
    
    // 模拟创建服务
    const newService = {
      id: Math.random().toString(36).substring(2, 15),
      price,
      duration,
      imageUrl,
      translations,
      slug,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(newService, '服务创建成功');
  } catch (error) {
    console.error('创建服务出错:', error);
    return apiServerError('创建服务失败');
  }
}

/**
 * 管理API - 更新服务
 * 此端点需要管理员授权
 */
async function updateService(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id, price, duration, imageUrl, translations, slug, isActive } = body;
    
    // 验证必填字段
    if (!id) {
      return apiNotFoundError('服务ID不能为空');
    }
    
    // 验证价格和时长
    if (price !== undefined && price <= 0) {
      return apiValidationError('价格必须大于0');
    }
    
    if (duration !== undefined && duration <= 0) {
      return apiValidationError('时长必须大于0');
    }
    
    // 验证slug格式
    if (slug) {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return apiValidationError('slug格式不正确，只能包含小写字母、数字和连字符');
      }
    }
    
    // 模拟更新服务
    const updatedService = {
      id,
      price: price !== undefined ? price : 1200,
      duration: duration !== undefined ? duration : 60,
      imageUrl: imageUrl || '/images/default-service.jpg',
      translations: translations || [{ locale: 'zh', name: '服务名称', description: '服务描述' }],
      slug: slug || 'service-slug',
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(updatedService, '服务更新成功');
  } catch (error) {
    console.error('更新服务出错:', error);
    return apiServerError('更新服务失败');
  }
}

/**
 * 管理API - 删除服务
 * 此端点需要管理员授权
 */
async function deleteService(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id } = body;
    
    // 验证必填字段
    if (!id) {
      return apiNotFoundError('服务ID不能为空');
    }
    
    // 模拟删除服务（实际上可能是软删除）
    const deletedService = {
      id,
      isActive: false,
      deletedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(deletedService, '服务删除成功');
  } catch (error) {
    console.error('删除服务出错:', error);
    return apiServerError('删除服务失败');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(getServices);
export const POST = withAdminApi(createService);
export const PUT = withAdminApi(updateService);
export const DELETE = withAdminApi(deleteService); 