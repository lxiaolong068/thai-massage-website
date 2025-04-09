import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';
import prisma from '@/lib/prisma';

// 获取所有联系方式
async function getContactMethods(request: NextRequest) {
  try {
    const contactMethods = await prisma.contactMethod.findMany({
      orderBy: {
        type: 'asc',
      },
    });
    
    return apiSuccess(contactMethods);
  } catch (error) {
    console.error('获取联系方式出错:', error);
    return apiServerError('Failed to fetch contact methods');
  }
}

// 更新联系方式
async function updateContactMethod(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, value, isActive } = body;
    
    if (!id) {
      return apiValidationError('Contact method ID is required');
    }
    
    const updatedMethod = await prisma.contactMethod.update({
      where: { id },
      data: {
        ...(value !== undefined && { value }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    
    return apiSuccess(updatedMethod);
  } catch (error) {
    console.error('更新联系方式出错:', error);
    return apiServerError('Failed to update contact method');
  }
}

// 创建新的联系方式
async function createContactMethod(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, value, isActive } = body;
    
    if (!type) {
      return apiValidationError('Contact method type is required');
    }
    
    // 使用upsert，如果存在就更新，不存在就创建
    const contactMethod = await prisma.contactMethod.upsert({
      where: { type },
      update: {
        ...(value !== undefined && { value }),
        ...(isActive !== undefined && { isActive }),
      },
      create: {
        type,
        value: value || '',
        isActive: isActive ?? true,
      },
    });
    
    return apiSuccess(contactMethod);
  } catch (error) {
    console.error('创建联系方式出错:', error);
    return apiServerError('Failed to create contact method');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(getContactMethods);
export const PUT = withAdminApi(updateContactMethod);
export const POST = withAdminApi(createContactMethod); 