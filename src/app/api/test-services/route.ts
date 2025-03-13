import { NextRequest, NextResponse } from 'next/server';

// 测试API - 返回简单的服务列表
export async function GET(request: NextRequest) {
  try {
    // 模拟数据
    const mockServices = [
      {
        id: '1',
        name: '测试服务1',
        price: 1000,
        duration: 60,
        description: '这是一个测试服务',
        imageUrl: '/images/test-service.jpg'
      },
      {
        id: '2',
        name: '测试服务2',
        price: 1500,
        duration: 90,
        description: '这是另一个测试服务',
        imageUrl: '/images/test-service.jpg'
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockServices
    });
  } catch (error) {
    console.error('测试服务API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: '测试服务API错误'
        }
      },
      { status: 500 }
    );
  }
} 