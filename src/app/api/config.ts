// API全局配置
export const apiConfig = {
  requireAuth: false, // 默认不需要授权
};

// API响应助手函数
export function createSuccessResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    ...(message ? { message } : {})
  };
}

export function createErrorResponse(code: string, message: string, status: number = 500) {
  return {
    success: false,
    error: {
      code,
      message
    },
    status
  };
} 