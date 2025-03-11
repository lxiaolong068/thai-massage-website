import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import request from 'supertest';
import { NextApiHandler } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { URL } from 'url';

/**
 * 创建一个测试客户端，用于测试API路由
 * @param handler API处理函数
 * @returns Supertest实例
 */
export function createTestClient(handler: NextApiHandler) {
  const server = createServer((req, res) => {
    return apiResolver(
      req,
      res,
      undefined,
      handler,
      {
        previewModeEncryptionKey: '',
        previewModeId: '',
        previewModeSigningKey: '',
      },
      false,
      undefined
    );
  });

  return request(server);
}

/**
 * 创建一个模拟的Next.js请求对象
 * @param options 请求选项
 * @returns 模拟的请求对象
 */
export function createMockRequest(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  body?: any;
}) {
  const {
    method = 'GET',
    url = 'http://localhost:3000/api/test',
    headers = {},
    cookies = {},
    body = null,
  } = options;

  return {
    method,
    url,
    headers: {
      ...headers,
      cookie: Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; '),
    },
    cookies,
    body,
    json: jest.fn().mockResolvedValue(body),
  };
}

/**
 * 创建一个模拟的Next.js响应对象
 * @returns 模拟的响应对象
 */
export function createMockResponse() {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    getHeader: jest.fn().mockReturnValue(null),
  };
  return res;
}

/**
 * 创建一个模拟的Next.js请求对象，用于测试App Router API
 * @param options 请求选项
 * @returns 模拟的NextRequest对象
 */
export function createMockNextRequest(options: {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}): NextRequest {
  const {
    url = 'http://localhost:3000/api/test',
    method = 'GET',
    headers = {},
    cookies = {},
    body = null,
    params = {},
  } = options;

  // 创建URL对象
  const urlObj = new URL(url);
  
  // 创建请求头
  const headersObj = new Headers();
  Object.entries(headers).forEach(([key, value]) => {
    headersObj.append(key, value);
  });
  
  // 创建请求对象
  const req = new Request(url, {
    method,
    headers: headersObj,
  }) as NextRequest;
  
  // 添加NextRequest特有的属性
  // @ts-ignore - 为了测试目的
  req.nextUrl = urlObj;
  // @ts-ignore - 为了测试目的
  req.cookies = new Map(Object.entries(cookies));
  // @ts-ignore - 为了测试目的
  req.params = params;
  
  // 添加json方法
  // @ts-ignore - 为了测试目的
  req.json = jest.fn().mockResolvedValue(body);
  
  return req;
}

/**
 * 创建一个模拟的Next.js响应对象
 * @returns 模拟的NextResponse对象
 */
export function createMockNextResponse(): NextResponse {
  // @ts-ignore - 为了测试目的
  const res: NextResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockImplementation((data) => {
      // @ts-ignore - 为了测试目的
      res.body = data;
      return res;
    }),
    headers: new Headers(),
    cookies: new Map(),
  };
  
  return res;
}

/**
 * 解析响应JSON
 * @param response NextResponse对象
 * @returns 解析后的JSON数据
 */
export async function parseResponseJson(response: NextResponse): Promise<any> {
  // 如果响应有json方法，使用它
  if (typeof response.json === 'function') {
    return await response.json();
  }
  
  // 否则，尝试从body属性获取数据
  // @ts-ignore - 为了测试目的
  return response.body;
} 