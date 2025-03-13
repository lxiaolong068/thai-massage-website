import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiNotFoundError } from '@/utils/api/response';
import { withClientApi } from '../../middleware';

/**
 * 客户端API - 获取客户的预约列表
 * 此端点需要客户授权
 */
async function getClientBookings(request: NextRequest) {
  try {
    // 从cookie获取客户ID（在实际项目中，这应该从JWT令牌中获取）
    const clientId = request.cookies.get('client_token')?.value || 'mock-client-id';
    
    // 获取查询参数
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    // 模拟客户预约数据
    const mockBookings = [
      {
        id: '1',
        serviceId: '1',
        serviceName: '传统泰式按摩',
        therapistId: '1',
        therapistName: '莉莉',
        date: '2023-11-15',
        time: '10:00',
        status: 'confirmed',
        createdAt: '2023-11-01T10:30:00Z'
      },
      {
        id: '2',
        serviceId: '2',
        serviceName: '精油按摩',
        therapistId: '3',
        therapistName: '小美',
        date: '2023-11-20',
        time: '14:00',
        status: 'pending',
        createdAt: '2023-11-05T15:45:00Z'
      },
      {
        id: '3',
        serviceId: '4',
        serviceName: '足部按摩',
        therapistId: '4',
        therapistName: '托尼',
        date: '2023-10-25',
        time: '16:00',
        status: 'completed',
        createdAt: '2023-10-20T09:15:00Z'
      }
    ];
    
    // 根据状态过滤预约
    let filteredBookings = mockBookings;
    if (status) {
      filteredBookings = mockBookings.filter(booking => booking.status === status);
    }
    
    // 返回成功响应
    return apiSuccess(filteredBookings);
  } catch (error) {
    console.error('获取客户预约列表出错:', error);
    return apiServerError('获取预约列表失败');
  }
}

/**
 * 客户端API - 获取客户的单个预约详情
 * 此端点需要客户授权
 */
async function getClientBooking(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 从cookie获取客户ID（在实际项目中，这应该从JWT令牌中获取）
    const clientId = request.cookies.get('client_token')?.value || 'mock-client-id';
    
    // 获取预约ID
    const bookingId = params.id;
    
    // 模拟查找预约
    const mockBooking = {
      id: bookingId,
      serviceId: '1',
      serviceName: '传统泰式按摩',
      therapistId: '1',
      therapistName: '莉莉',
      date: '2023-11-15',
      time: '10:00',
      status: 'confirmed',
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      notes: '请准备热毛巾',
      createdAt: '2023-11-01T10:30:00Z'
    };
    
    // 返回成功响应
    return apiSuccess(mockBooking);
  } catch (error) {
    console.error('获取预约详情出错:', error);
    return apiServerError('获取预约详情失败');
  }
}

/**
 * 客户端API - 取消客户的预约
 * 此端点需要客户授权
 */
async function cancelClientBooking(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { bookingId, reason } = body;
    
    // 验证必填字段
    if (!bookingId) {
      return apiNotFoundError('预约ID不能为空');
    }
    
    // 模拟取消预约
    const cancelledBooking = {
      id: bookingId,
      status: 'cancelled',
      cancelReason: reason || null,
      cancelledAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(cancelledBooking, '预约已成功取消');
  } catch (error) {
    console.error('取消预约出错:', error);
    return apiServerError('取消预约失败');
  }
}

// 使用客户端API中间件包装处理函数
export const GET = withClientApi(getClientBookings);
export const POST = withClientApi(cancelClientBooking); 