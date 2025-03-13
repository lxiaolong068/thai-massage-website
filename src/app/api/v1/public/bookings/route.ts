import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError } from '@/utils/api/response';
import { withPublicApi } from '../../middleware';

/**
 * 公开API - 创建预约
 * 此端点不需要授权，可直接访问
 */
async function createBooking(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 验证必填字段
    const { serviceId, therapistId, date, time, name, phone } = body;
    
    if (!serviceId || !therapistId || !date || !time || !name || !phone) {
      return apiValidationError('缺少必填字段');
    }
    
    // 验证电话号码格式
    const phoneRegex = /^[+\d\s-]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return apiValidationError('电话号码格式不正确');
    }
    
    // 验证日期格式
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return apiValidationError('日期格式不正确');
    }
    
    // 验证时间格式
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return apiValidationError('时间格式不正确');
    }
    
    // 验证预约时间是否在未来
    const now = new Date();
    const bookingDateTime = new Date(`${date}T${time}`);
    if (bookingDateTime <= now) {
      return apiValidationError('预约时间必须在未来');
    }
    
    // TODO: 验证服务和按摩师是否存在
    // TODO: 验证预约时间是否可用
    
    // 创建预约（模拟）
    const booking = {
      id: Math.random().toString(36).substring(2, 15),
      serviceId,
      therapistId,
      date,
      time,
      name,
      phone,
      email: body.email || null,
      notes: body.notes || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(booking, '预约创建成功');
  } catch (error) {
    console.error('创建预约出错:', error);
    return apiServerError('创建预约失败');
  }
}

/**
 * 公开API - 获取可用时间段
 * 此端点不需要授权，可直接访问
 */
async function getAvailableTimeSlots(request: NextRequest) {
  try {
    // 获取参数
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const serviceId = url.searchParams.get('serviceId');
    const therapistId = url.searchParams.get('therapistId');
    
    // 验证必填参数
    if (!date) {
      return apiValidationError('缺少日期参数');
    }
    
    // 验证日期格式
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return apiValidationError('日期格式不正确');
    }
    
    // 生成时间段（模拟）
    const timeSlots = [];
    const startHour = 9; // 9:00 AM
    const endHour = 18;  // 6:00 PM
    const interval = 60; // 60分钟间隔
    
    // 当前日期
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    
    // 生成时间段
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // 如果是今天，只显示未来的时间段
        if (selectedDate.getTime() === today.getTime()) {
          const slotTime = new Date(selectedDate);
          slotTime.setHours(hour, minute, 0, 0);
          
          if (slotTime <= now) {
            continue; // 跳过过去的时间段
          }
        }
        
        // 模拟一些时间段已被预约
        const isAvailable = Math.random() > 0.3; // 70%的概率可用
        
        timeSlots.push({
          time: timeString,
          available: isAvailable
        });
      }
    }
    
    // 返回成功响应
    return apiSuccess(timeSlots);
  } catch (error) {
    console.error('获取可用时间段出错:', error);
    return apiServerError('获取可用时间段失败');
  }
}

// 使用公共API中间件包装处理函数
export const POST = withPublicApi(createBooking);
export const GET = withPublicApi(getAvailableTimeSlots); 