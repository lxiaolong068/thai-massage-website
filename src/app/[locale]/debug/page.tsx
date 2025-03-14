'use client';

import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    // 检查页面结构
    document.querySelectorAll('header').forEach((header, index) => {
      console.log(`检测到导航栏 ${index + 1}:`, {
        位置: getComputedStyle(header).position,
        顶部偏移: getComputedStyle(header).top,
        z轴层级: getComputedStyle(header).zIndex,
        宽度: getComputedStyle(header).width,
        高度: getComputedStyle(header).height,
        背景色: getComputedStyle(header).backgroundColor,
        边框: getComputedStyle(header).border,
        底部边框: getComputedStyle(header).borderBottom,
        边距: getComputedStyle(header).margin,
        内边距: getComputedStyle(header).padding,
        元素类名: header.className,
        HTML内容: header.innerHTML.substring(0, 100) + '...'
      });
    });
    
    // 检查body样式
    console.log('Body样式:', {
      边距: getComputedStyle(document.body).margin,
      内边距: getComputedStyle(document.body).padding,
      背景色: getComputedStyle(document.body).backgroundColor,
    });
    
    // 检查可能的其他顶部元素
    document.querySelectorAll('body > *').forEach((el, index) => {
      console.log(`Body直接子元素 ${index + 1}:`, {
        标签名: el.tagName,
        元素类名: el.className,
        位置: getComputedStyle(el).position,
        顶部偏移: getComputedStyle(el).top,
        高度: getComputedStyle(el).height.slice(0, 10),
        边距: getComputedStyle(el).margin.slice(0, 10),
        内边距: getComputedStyle(el).padding.slice(0, 10),
      });
    });
  }, []);
  
  return (
    <div className="container mx-auto px-4 pt-32">
      <h1 className="text-3xl font-bold mb-6">导航栏调试页面</h1>
      <p className="mb-4">此页面用于调试导航栏白边问题</p>
      <p className="text-sm text-gray-600">请打开浏览器控制台查看输出结果</p>
    </div>
  );
}
