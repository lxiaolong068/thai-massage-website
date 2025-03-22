import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';

// 定义数据集类型
interface DataSet {
  label: string;
  data: number[];
  color?: string;
}

// 定义分布数据类型
interface DistributionItem {
  id: string;
  name: string;
  value: number;
  color: string;
}

/**
 * 管理API - 获取仪表盘概览统计数据
 * 此端点需要管理员授权
 */
async function getDashboardStats(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'week'; // 默认为周
    
    // 验证时间段参数
    const validPeriods = ['day', 'week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      return apiValidationError('无效的时间段参数');
    }
    
    // 模拟统计数据
    const stats = {
      bookings: {
        total: period === 'day' ? 8 : period === 'week' ? 42 : period === 'month' ? 156 : 1872,
        confirmed: period === 'day' ? 5 : period === 'week' ? 28 : period === 'month' ? 98 : 1120,
        pending: period === 'day' ? 2 : period === 'week' ? 10 : period === 'month' ? 35 : 420,
        cancelled: period === 'day' ? 1 : period === 'week' ? 4 : period === 'month' ? 23 : 332,
        percentChange: period === 'day' ? 5.2 : period === 'week' ? 3.8 : period === 'month' ? 7.5 : 12.3
      },
      revenue: {
        total: period === 'day' ? 2400 : period === 'week' ? 12600 : period === 'month' ? 46800 : 561600,
        average: period === 'day' ? 300 : period === 'week' ? 300 : period === 'month' ? 300 : 300,
        percentChange: period === 'day' ? 4.5 : period === 'week' ? 6.2 : period === 'month' ? 8.7 : 15.4,
        currency: 'CNY'
      },
      services: {
        mostPopular: {
          id: '1',
          name: '传统泰式按摩',
          bookings: period === 'day' ? 3 : period === 'week' ? 18 : period === 'month' ? 65 : 780,
          revenue: period === 'day' ? 1200 : period === 'week' ? 7200 : period === 'month' ? 26000 : 312000
        },
        leastPopular: {
          id: '4',
          name: '足部按摩',
          bookings: period === 'day' ? 1 : period === 'week' ? 5 : period === 'month' ? 18 : 216,
          revenue: period === 'day' ? 200 : period === 'week' ? 1000 : period === 'month' ? 3600 : 43200
        }
      },
      therapists: {
        mostBooked: {
          id: '3',
          name: '小美',
          bookings: period === 'day' ? 4 : period === 'week' ? 20 : period === 'month' ? 75 : 900,
          revenue: period === 'day' ? 1200 : period === 'week' ? 6000 : period === 'month' ? 22500 : 270000
        },
        leastBooked: {
          id: '2',
          name: '杰克',
          bookings: period === 'day' ? 1 : period === 'week' ? 5 : period === 'month' ? 20 : 240,
          revenue: period === 'day' ? 300 : period === 'week' ? 1500 : period === 'month' ? 6000 : 72000
        }
      },
      customers: {
        total: period === 'day' ? 7 : period === 'week' ? 35 : period === 'month' ? 120 : 1450,
        new: period === 'day' ? 2 : period === 'week' ? 8 : period === 'month' ? 25 : 300,
        returning: period === 'day' ? 5 : period === 'week' ? 27 : period === 'month' ? 95 : 1150,
        percentChange: period === 'day' ? 3.1 : period === 'week' ? 4.7 : period === 'month' ? 6.2 : 10.8
      },
      timeSlots: {
        mostPopular: period === 'day' ? '10:00' : period === 'week' ? '10:00' : period === 'month' ? '10:00' : '10:00',
        leastPopular: period === 'day' ? '16:00' : period === 'week' ? '16:00' : period === 'month' ? '16:00' : '16:00'
      }
    };
    
    // 返回成功响应
    return apiSuccess(stats);
  } catch (error) {
    console.error('获取仪表盘统计数据出错:', error);
    return apiServerError('获取仪表盘统计数据失败');
  }
}

/**
 * 管理API - 获取预约趋势数据
 * 此端点需要管理员授权
 */
async function getBookingTrends(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'week'; // 默认为周
    
    // 验证时间段参数
    const validPeriods = ['week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      return apiValidationError('无效的时间段参数');
    }
    
    // 生成趋势数据
    let trendData: DataSet[] = [];
    let labels: string[] = [];
    
    if (period === 'week') {
      labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      trendData = [
        { label: '预约总数', data: [5, 7, 6, 8, 10, 12, 8] },
        { label: '已确认', data: [4, 5, 4, 6, 7, 9, 6] },
        { label: '已取消', data: [1, 2, 2, 2, 3, 3, 2] }
      ];
    } else if (period === 'month') {
      // 生成一个月的日期标签
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
      
      // 生成随机数据
      const totalData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 5);
      const confirmedData = totalData.map(val => Math.floor(val * 0.7));
      const cancelledData = totalData.map(val => Math.floor(val * 0.3));
      
      trendData = [
        { label: '预约总数', data: totalData },
        { label: '已确认', data: confirmedData },
        { label: '已取消', data: cancelledData }
      ];
    } else if (period === 'year') {
      labels = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      
      // 生成随机数据
      const totalData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 100);
      const confirmedData = totalData.map(val => Math.floor(val * 0.7));
      const cancelledData = totalData.map(val => Math.floor(val * 0.3));
      
      trendData = [
        { label: '预约总数', data: totalData },
        { label: '已确认', data: confirmedData },
        { label: '已取消', data: cancelledData }
      ];
    }
    
    // 返回成功响应
    return apiSuccess({
      labels,
      datasets: trendData
    });
  } catch (error) {
    console.error('获取预约趋势数据出错:', error);
    return apiServerError('获取预约趋势数据失败');
  }
}

/**
 * 管理API - 获取收入趋势数据
 * 此端点需要管理员授权
 */
async function getRevenueTrends(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'month'; // 默认为月
    
    // 验证时间段参数
    const validPeriods = ['week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      return apiValidationError('无效的时间段参数');
    }
    
    // 生成趋势数据
    let trendData: DataSet[] = [];
    let labels: string[] = [];
    
    if (period === 'week') {
      labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      trendData = [
        { label: '总收入', data: [1500, 2100, 1800, 2400, 3000, 3600, 2400] },
        { label: '传统泰式按摩', data: [600, 900, 750, 1200, 1500, 1800, 1200] },
        { label: '精油按摩', data: [450, 600, 450, 600, 750, 900, 600] },
        { label: '其他服务', data: [450, 600, 600, 600, 750, 900, 600] }
      ];
    } else if (period === 'month') {
      // 生成一个月的日期标签
      labels = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
      
      // 生成随机数据
      const totalData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 2000) + 1000);
      const traditionalData = totalData.map(val => Math.floor(val * 0.5));
      const oilData = totalData.map(val => Math.floor(val * 0.3));
      const otherData = totalData.map(val => Math.floor(val * 0.2));
      
      trendData = [
        { label: '总收入', data: totalData },
        { label: '传统泰式按摩', data: traditionalData },
        { label: '精油按摩', data: oilData },
        { label: '其他服务', data: otherData }
      ];
    } else if (period === 'year') {
      labels = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      
      // 生成随机数据
      const totalData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 30000) + 30000);
      const traditionalData = totalData.map(val => Math.floor(val * 0.5));
      const oilData = totalData.map(val => Math.floor(val * 0.3));
      const otherData = totalData.map(val => Math.floor(val * 0.2));
      
      trendData = [
        { label: '总收入', data: totalData },
        { label: '传统泰式按摩', data: traditionalData },
        { label: '精油按摩', data: oilData },
        { label: '其他服务', data: otherData }
      ];
    }
    
    // 返回成功响应
    return apiSuccess({
      labels,
      datasets: trendData,
      currency: 'CNY'
    });
  } catch (error) {
    console.error('获取收入趋势数据出错:', error);
    return apiServerError('获取收入趋势数据失败');
  }
}

/**
 * 管理API - 获取服务分布数据
 * 此端点需要管理员授权
 */
async function getServiceDistribution(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const period = url.searchParams.get('period') || 'month'; // 默认为月
    
    // 验证时间段参数
    const validPeriods = ['week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      return apiValidationError('无效的时间段参数');
    }
    
    // 模拟服务分布数据
    const distribution: DistributionItem[] = [
      { id: '1', name: '传统泰式按摩', value: 45, color: '#4CAF50' },
      { id: '2', name: '精油按摩', value: 25, color: '#2196F3' },
      { id: '3', name: '芳香疗法按摩', value: 15, color: '#FFC107' },
      { id: '4', name: '足部按摩', value: 10, color: '#9C27B0' },
      { id: '5', name: '其他服务', value: 5, color: '#F44336' }
    ];
    
    // 返回成功响应
    return apiSuccess(distribution);
  } catch (error) {
    console.error('获取服务分布数据出错:', error);
    return apiServerError('获取服务分布数据失败');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(async (request: NextRequest) => {
  // 获取URL参数确定调用哪个函数
  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'dashboard';
  
  switch (type) {
    case 'booking_trends':
      return getBookingTrends(request);
    case 'revenue_trends':
      return getRevenueTrends(request);
    case 'service_distribution':
      return getServiceDistribution(request);
    default:
      return getDashboardStats(request);
  }
}); 