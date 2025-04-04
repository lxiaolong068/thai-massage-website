import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError, apiNotFoundError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';
import prisma from '@/lib/prisma';

/**
 * 管理API - 获取所有服务
 * 此端点需要管理员授权
 */
async function getServices(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'zh';
    
    // 从数据库获取服务数据
    const services = await prisma.service.findMany({
      include: {
        translations: {
          where: {
            locale: locale
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 格式化服务数据
    const formattedServices = services.map(service => ({
      id: service.id,
      price: service.price,
      duration: service.duration,
      imageUrl: service.imageUrl,
      name: service.translations[0]?.name || '',
      description: service.translations[0]?.description || '',
      slug: service.translations[0]?.slug || '',
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    }));
    
    // 返回成功响应
    return apiSuccess(formattedServices);
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