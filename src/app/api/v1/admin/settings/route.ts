import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';

// 定义设置类型
interface Setting {
  key: string;
  value: string | number | boolean | object;
  category: string;
  description: string;
  updatedAt: string;
}

/**
 * 管理API - 获取所有系统设置
 * 此端点需要管理员授权
 */
async function getSettings(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    
    // 模拟设置数据
    const mockSettings: Setting[] = [
      {
        key: 'business_name',
        value: '泰式按摩中心',
        category: 'general',
        description: '业务名称',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'business_address',
        value: '北京市朝阳区建国路88号',
        category: 'general',
        description: '业务地址',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'business_phone',
        value: '010-12345678',
        category: 'general',
        description: '业务电话',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'business_email',
        value: 'contact@thaimassage.example.com',
        category: 'general',
        description: '业务邮箱',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'business_hours',
        value: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '21:00' },
          saturday: { open: '10:00', close: '22:00' },
          sunday: { open: '10:00', close: '20:00' }
        },
        category: 'general',
        description: '营业时间',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'default_locale',
        value: 'zh-CN',
        category: 'localization',
        description: '默认语言',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'supported_locales',
        value: ['zh-CN', 'en-US', 'ko-KR'],
        category: 'localization',
        description: '支持的语言',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'currency',
        value: 'CNY',
        category: 'payment',
        description: '货币',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'tax_rate',
        value: 0.06,
        category: 'payment',
        description: '税率',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'payment_methods',
        value: ['cash', 'wechat', 'alipay', 'credit_card'],
        category: 'payment',
        description: '支付方式',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'booking_advance_days',
        value: 30,
        category: 'booking',
        description: '预约提前天数',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'booking_cancel_hours',
        value: 24,
        category: 'booking',
        description: '预约取消小时数',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'booking_time_slot',
        value: 60,
        category: 'booking',
        description: '预约时间间隔（分钟）',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'smtp_host',
        value: 'smtp.example.com',
        category: 'notification',
        description: 'SMTP主机',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'smtp_port',
        value: 587,
        category: 'notification',
        description: 'SMTP端口',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'smtp_user',
        value: 'notification@thaimassage.example.com',
        category: 'notification',
        description: 'SMTP用户名',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'sms_enabled',
        value: true,
        category: 'notification',
        description: '短信通知启用',
        updatedAt: '2023-10-01T10:00:00Z'
      },
      {
        key: 'email_enabled',
        value: true,
        category: 'notification',
        description: '邮件通知启用',
        updatedAt: '2023-10-01T10:00:00Z'
      }
    ];
    
    // 根据类别过滤设置
    let filteredSettings = mockSettings;
    if (category) {
      filteredSettings = mockSettings.filter(setting => setting.category === category);
    }
    
    // 按类别分组设置
    const groupedSettings: Record<string, Setting[]> = {};
    filteredSettings.forEach(setting => {
      if (!groupedSettings[setting.category]) {
        groupedSettings[setting.category] = [];
      }
      groupedSettings[setting.category].push(setting);
    });
    
    // 返回成功响应
    return apiSuccess(groupedSettings);
  } catch (error) {
    console.error('获取设置出错:', error);
    return apiServerError('获取设置失败');
  }
}

/**
 * 管理API - 更新系统设置
 * 此端点需要管理员授权
 */
async function updateSettings(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { settings } = body;
    
    // 验证设置数组
    if (!settings || !Array.isArray(settings) || settings.length === 0) {
      return apiValidationError('设置数据无效');
    }
    
    // 验证每个设置项
    for (const setting of settings) {
      if (!setting.key || setting.value === undefined) {
        return apiValidationError(`设置项 ${setting.key || '未知'} 数据无效`);
      }
    }
    
    // 模拟更新设置
    const updatedSettings = settings.map(setting => ({
      key: setting.key,
      value: setting.value,
      updatedAt: new Date().toISOString()
    }));
    
    // 返回成功响应
    return apiSuccess(updatedSettings, '设置更新成功');
  } catch (error) {
    console.error('更新设置出错:', error);
    return apiServerError('更新设置失败');
  }
}

/**
 * 管理API - 重置系统设置
 * 此端点需要管理员授权
 */
async function resetSettings(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { category } = body;
    
    // 验证类别
    if (!category) {
      return apiValidationError('类别不能为空');
    }
    
    // 模拟重置设置
    const resetResult = {
      category,
      resetAt: new Date().toISOString(),
      success: true
    };
    
    // 返回成功响应
    return apiSuccess(resetResult, `${category} 类别的设置已重置为默认值`);
  } catch (error) {
    console.error('重置设置出错:', error);
    return apiServerError('重置设置失败');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(getSettings);
export const PUT = withAdminApi(updateSettings);
export const POST = withAdminApi(resetSettings); 