import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

type ApiHandler = (request: NextRequest) => Promise<NextResponse>;

export function withAdminApi(handler: ApiHandler) {
  return async (request: NextRequest) => {
    try {
      // 从请求头中获取 Authorization token
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'No authorization token provided'
            }
          },
          { status: 401 }
        );
      }

      const token = authHeader.split(' ')[1];
      
      // 验证 token
      try {
        const decoded = await verifyToken(token);
        if (!decoded || decoded.role !== 'ADMIN') {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'Invalid or insufficient permissions'
              }
            },
            { status: 403 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_TOKEN',
              message: 'Invalid or expired token'
            }
          },
          { status: 401 }
        );
      }

      // 调用实际的处理函数
      return handler(request);
    } catch (error) {
      console.error('API middleware error:', error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Internal server error'
          }
        },
        { status: 500 }
      );
    }
  };
} 