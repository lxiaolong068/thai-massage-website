import { NextResponse } from 'next/server';

/**
 * 标准化API成功响应
 * @param data 响应数据
 * @param message 成功消息
 * @returns NextResponse实例
 */
export function apiSuccess(data: any, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

/**
 * 标准化API错误响应
 * @param code 错误代码
 * @param message 错误消息
 * @param status HTTP状态码
 * @returns NextResponse实例
 */
export function apiError(code: string, message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    { status }
  );
}
