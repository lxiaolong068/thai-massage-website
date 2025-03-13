import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError, apiNotFoundError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';

/**
 * 管理API - 获取所有预约
 * 此端点需要管理员授权
 */
async function getBookings(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');
    const therapistId = url.searchParams.get('therapistId');
    const serviceId = url.searchParams.get('serviceId');
    
    // 模拟预约数据
    const mockBookings = [
      {
        id: '1',
        serviceId: '1',
        serviceName: '传统泰式按摩',
        therapistId: '1',
        therapistName: '莉莉',
        date: '2023-11-15',
        time: '10:00',
        name: '张三',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        notes: '请准备热毛巾',
        status: 'confirmed',
        createdAt: '2023-11-01T10:30:00Z',
        updatedAt: '2023-11-02T14:20:00Z'
      },
      {
        id: '2',
        serviceId: '2',
        serviceName: '精油按摩',
        therapistId: '3',
        therapistName: '小美',
        date: '2023-11-20',
        time: '14:00',
        name: '李四',
        phone: '13900139000',
        email: 'lisi@example.com',
        notes: '',
        status: 'pending',
        createdAt: '2023-11-05T15:45:00Z',
        updatedAt: '2023-11-05T15:45:00Z'
      },
      {
        id: '3',
        serviceId: '4',
        serviceName: '足部按摩',
        therapistId: '4',
        therapistName: '托尼',
        date: '2023-10-25',
        time: '16:00',
        name: '王五',
        phone: '13700137000',
        email: '',
        notes: '脚部有伤，请轻柔按摩',
        status: 'completed',
        createdAt: '2023-10-20T09:15:00Z',
        updatedAt: '2023-10-25T17:30:00Z'
      },
      {
        id: '4',
        serviceId: '3',
        serviceName: '芳香疗法按摩',
        therapistId: '3',
        therapistName: '小美',
        date: '2023-11-10',
        time: '11:00',
        name: '赵六',
        phone: '13600136000',
        email: 'zhaoliu@example.com',
        notes: '',
        status: 'cancelled',
        cancelReason: '客户临时有事',
        createdAt: '2023-11-01T16:20:00Z',
        updatedAt: '2023-11-08T09:10:00Z',
        cancelledAt: '2023-11-08T09:10:00Z'
      }
    ];
    
    // 根据查询参数过滤预约
    let filteredBookings = mockBookings;
    
    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    if (date) {
      filteredBookings = filteredBookings.filter(booking => booking.date === date);
    }
    
    if (therapistId) {
      filteredBookings = filteredBookings.filter(booking => booking.therapistId === therapistId);
    }
    
    if (serviceId) {
      filteredBookings = filteredBookings.filter(booking => booking.serviceId === serviceId);
    }
    
    // 返回成功响应
    return apiSuccess(filteredBookings);
  } catch (error) {
    console.error('获取预约列表出错:', error);
    return apiServerError('获取预约列表失败');
  }
}

/**
 * 管理API - 更新预约状态
 * 此端点需要管理员授权
 */
async function updateBookingStatus(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id, status, notes } = body;
    
    // 验证必填字段
    if (!id || !status) {
      return apiValidationError('预约ID和状态不能为空');
    }
    
    // 验证状态值
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return apiValidationError('无效的预约状态');
    }
    
    // 模拟更新预约状态
    const updatedBooking = {
      id,
      status,
      notes: notes || undefined,
      updatedAt: new Date().toISOString(),
      ...(status === 'cancelled' ? { cancelledAt: new Date().toISOString() } : {})
    };
    
    // 返回成功响应
    return apiSuccess(updatedBooking, `预约状态已更新为${status}`);
  } catch (error) {
    console.error('更新预约状态出错:', error);
    return apiServerError('更新预约状态失败');
  }
}

/**
 * 管理API - 创建预约
 * 此端点需要管理员授权
 */
async function createBooking(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { serviceId, therapistId, date, time, name, phone, email, notes } = body;
    
    // 验证必填字段
    if (!serviceId || !therapistId || !date || !time || !name || !phone) {
      return apiValidationError('缺少必填字段');
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
    
    // 模拟创建预约
    const newBooking = {
      id: Math.random().toString(36).substring(2, 15),
      serviceId,
      serviceName: '服务名称', // 实际应该从数据库获取
      therapistId,
      therapistName: '按摩师姓名', // 实际应该从数据库获取
      date,
      time,
      name,
      phone,
      email: email || null,
      notes: notes || null,
      status: 'confirmed', // 管理员创建的预约默认为已确认
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(newBooking, '预约创建成功');
  } catch (error) {
    console.error('创建预约出错:', error);
    return apiServerError('创建预约失败');
  }
}

/**
 * 管理API - 删除预约
 * 此端点需要管理员授权
 */
async function deleteBooking(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id } = body;
    
    // 验证必填字段
    if (!id) {
      return apiNotFoundError('预约ID不能为空');
    }
    
    // 模拟删除预约
    const deletedBooking = {
      id,
      deleted: true,
      deletedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(deletedBooking, '预约已删除');
  } catch (error) {
    console.error('删除预约出错:', error);
    return apiServerError('删除预约失败');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(getBookings);
export const POST = withAdminApi(createBooking);
export const PUT = withAdminApi(updateBookingStatus);
export const DELETE = withAdminApi(deleteBooking); 