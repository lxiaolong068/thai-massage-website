/**
 * API响应工具函数
 * 用于统一API响应格式
 */

import { NextResponse } from 'next/server';

// 错误代码类型
export type ErrorCode = 
  | 'AUTH_ERROR'       // 认证相关错误
  | 'VALIDATION_ERROR' // 数据验证错误
  | 'RESOURCE_ERROR'   // 资源不存在或冲突
  | 'SERVER_ERROR'     // 服务器内部错误
  | 'NOT_FOUND'        // 资源不存在
  | 'BAD_REQUEST';     // 错误的请求

/**
 * 创建成功响应
 * @param data 响应数据
 * @param message 可选的成功消息
 * @returns NextResponse对象
 */
export function apiSuccess<T>(data: T, message?: string) {
  const response = {
    success: true,
    data,
    ...(message ? { message } : {})
  };
  
  return NextResponse.json(response);
}

/**
 * 创建错误响应
 * @param message 错误消息
 * @param code 错误代码
 * @param status HTTP状态码
 * @returns NextResponse对象
 */
export function apiError(message: string, code: ErrorCode = 'SERVER_ERROR', status: number = 500) {
  const response = {
    success: false,
    error: {
      code,
      message
    }
  };
  
  return NextResponse.json(response, { status });
}

/**
 * 创建验证错误响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function apiValidationError(message: string) {
  return apiError(message, 'VALIDATION_ERROR', 400);
}

/**
 * 创建认证错误响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function apiAuthError(message: string = '未授权访问') {
  return apiError(message, 'AUTH_ERROR', 401);
}

/**
 * 创建资源不存在错误响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function apiNotFoundError(message: string = '资源不存在') {
  return apiError(message, 'NOT_FOUND', 404);
}

/**
 * 创建请求错误响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function apiBadRequestError(message: string) {
  return apiError(message, 'BAD_REQUEST', 400);
}

/**
 * 创建服务器错误响应
 * @param message 错误消息
 * @returns NextResponse对象
 */
export function apiServerError(message: string = '服务器内部错误') {
  return apiError(message, 'SERVER_ERROR', 500);
} 