// 扩展NextRequest类型，添加测试所需的属性
import { NextRequest } from 'next/server';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUUID(): R;
    }
  }
}

declare module 'next/server' {
  interface NextRequest {
    params?: Record<string, string>;
  }
} 