import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

// 创建Google Generative AI适配器，使用Gemini Flash模型
const serviceAdapter = new GoogleGenerativeAIAdapter({ 
  model: 'gemini-2.5-flash-preview-04-17'
});

// 创建CopilotRuntime实例
const runtime = new CopilotRuntime();

// 处理POST请求
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
}; 