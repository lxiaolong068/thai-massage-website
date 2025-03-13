import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError } from '@/utils/api/response';
import { withClientApi } from '../../middleware';

/**
 * 客户端API - 获取客户个人资料
 * 此端点需要客户授权
 */
async function getClientProfile(request: NextRequest) {
  try {
    // 从cookie获取客户ID（在实际项目中，这应该从JWT令牌中获取）
    const clientId = request.cookies.get('client_token')?.value || 'mock-client-id';
    
    // 模拟客户资料数据
    const mockProfile = {
      id: clientId,
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      preferredLocale: 'zh',
      createdAt: '2023-01-15T08:30:00Z',
      lastLogin: '2023-11-05T14:20:00Z'
    };
    
    // 返回成功响应
    return apiSuccess(mockProfile);
  } catch (error) {
    console.error('获取客户资料出错:', error);
    return apiServerError('获取客户资料失败');
  }
}

/**
 * 客户端API - 更新客户个人资料
 * 此端点需要客户授权
 */
async function updateClientProfile(request: NextRequest) {
  try {
    // 从cookie获取客户ID（在实际项目中，这应该从JWT令牌中获取）
    const clientId = request.cookies.get('client_token')?.value || 'mock-client-id';
    
    // 解析请求体
    const body = await request.json();
    const { name, phone, email, preferredLocale } = body;
    
    // 验证必填字段
    if (!name || !phone) {
      return apiValidationError('姓名和电话不能为空');
    }
    
    // 验证电话号码格式
    const phoneRegex = /^[+\d\s-]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return apiValidationError('电话号码格式不正确');
    }
    
    // 验证邮箱格式（如果提供）
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return apiValidationError('邮箱格式不正确');
      }
    }
    
    // 验证语言偏好
    const validLocales = ['zh', 'en', 'ko'];
    if (preferredLocale && !validLocales.includes(preferredLocale)) {
      return apiValidationError('不支持的语言偏好');
    }
    
    // 模拟更新客户资料
    const updatedProfile = {
      id: clientId,
      name,
      phone,
      email: email || null,
      preferredLocale: preferredLocale || 'zh',
      updatedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(updatedProfile, '个人资料已更新');
  } catch (error) {
    console.error('更新客户资料出错:', error);
    return apiServerError('更新客户资料失败');
  }
}

// 使用客户端API中间件包装处理函数
export const GET = withClientApi(getClientProfile);
export const PUT = withClientApi(updateClientProfile); 