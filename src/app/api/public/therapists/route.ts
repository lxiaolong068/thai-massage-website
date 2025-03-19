import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError } from '@/utils/api/response';

/**
 * 公开API - 获取所有按摩师或按服务ID过滤的按摩师列表
 * 此端点不需要授权，可直接访问
 */
export async function GET(request: NextRequest) {
  // 获取参数
  const url = new URL(request.url);
  // 始终使用英语
  const locale = 'en';
  const serviceId = url.searchParams.get('serviceId');
  
  try {
    // 模拟按摩师数据 - 支持中文、英文和韩文
    // 实际项目中应该从数据库获取
    const mockTherapists = [
      {
        id: '1',
        name: 'Lily',
        imageUrl: '/images/therapist-1.jpg',
        bio: 'Professional massage therapist with 10 years of experience. Specializes in traditional Thai massage and oil massage.',
        specialties: ['traditional', 'oil'],
        experience: 10,
        experienceYears: 10,
        serviceIds: ['1', '2']
      },
      {
        id: '2',
        name: 'Jason',
        imageUrl: '/images/therapist-2.jpg',
        bio: 'Focused on deep tissue and sports massage. Helps clients relieve chronic pain and muscle tension.',
        specialties: ['deep-tissue', 'sports'],
        experience: 8,
        experienceYears: 8,
        serviceIds: ['1', '3']
      },
      {
        id: '3',
        name: 'Mimi',
        imageUrl: '/images/therapist-3.jpg',
        bio: 'Aromatherapy and oil massage specialist. Provides relaxing and soothing experiences.',
        specialties: ['aromatherapy', 'oil'],
        experience: 6,
        experienceYears: 6,
        serviceIds: ['2', '3']
      },
      {
        id: '4',
        name: 'Tony',
        imageUrl: '/images/therapist-4.jpg',
        bio: 'Versatile therapist skilled in various massage techniques. Dedicated to providing personalized massage experiences.',
        specialties: ['traditional', 'oil', 'foot'],
        experience: 7,
        experienceYears: 7,
        serviceIds: ['1', '2', '4']
      }
    ];

    // 如果指定了服务ID，则过滤按摩师列表
    let filteredTherapists = mockTherapists;
    if (serviceId) {
      filteredTherapists = mockTherapists.filter(therapist => 
        therapist.serviceIds && therapist.serviceIds.includes(serviceId)
      );
    }

    // 使用apiSuccess返回统一格式的成功响应
    return apiSuccess(filteredTherapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    // 使用apiServerError返回统一格式的错误响应
    return apiServerError('Failed to fetch therapists');
  }
} 