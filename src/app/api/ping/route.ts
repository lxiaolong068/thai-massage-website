import { NextRequest, NextResponse } from 'next/server';

// 简单的ping API，不需要任何验证或复杂逻辑
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: { 
      message: 'pong',
      timestamp: new Date().toISOString()
    }
  });
} 