import { NextResponse } from 'next/server';

/**
 * 重定向占位图片请求到正确的路径
 * 此函数将任何对 /placeholder-avatar.jpg 和 /placeholder-image.jpg 的请求
 * 重定向到 /images/placeholder-therapist.jpg
 */
export function redirectPlaceholderImage(url: string): string {
  // 检查是否是需要重定向的占位图片路径
  if (url.includes('/placeholder-avatar.jpg') || url.includes('/placeholder-image.jpg')) {
    console.log(`重定向占位图片请求: ${url} -> /images/placeholder-therapist.jpg`);
    return '/images/placeholder-therapist.jpg';
  }
  
  // 如果不需要重定向，返回原始URL
  return url;
}

/**
 * 处理图片URL，确保使用正确的占位图片
 * 此函数将检查图片URL是否有效，对无效URL返回占位图片路径
 */
export function getValidImageUrl(url: string | null | undefined): string {
  // 默认占位图片路径
  const defaultPlaceholderPath = '/images/placeholder-therapist.jpg';
  
  // 如果URL为空，返回默认占位图片
  if (!url) {
    return defaultPlaceholderPath;
  }
  
  // 重定向占位图片请求
  if (url.includes('/placeholder-avatar.jpg') || url.includes('/placeholder-image.jpg')) {
    return defaultPlaceholderPath;
  }
  
  // 返回原始URL
  return url;
}
