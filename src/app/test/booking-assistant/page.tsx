'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { CopilotKit } from '@copilotkit/react-core';

// 动态导入BookingAssistant以避免SSR问题
const BookingAssistant = dynamic(() => import('@/components/BookingAssistant'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">加载预约助手中...</span>
    </div>
  )
});

export default function BookingAssistantTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              预约助手测试页面 (移动端优化版)
            </h1>
            <p className="text-gray-600 text-center mb-6">
              测试移动端优化的预约助手功能：智能设备检测、触摸优化、联系方式推荐
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">新增移动端优化：</h2>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• 自动检测移动设备，使用适合的UI组件</li>
                <li>• 移动端使用弹窗式聊天界面</li>
                <li>• 桌面端使用侧边栏聊天界面</li>
                <li>• 优化触摸交互和输入体验</li>
                <li>• 防止iOS设备自动缩放输入框</li>
                <li>• 改进滚动和键盘适配</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-green-800 mb-2">功能测试建议：</h2>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• 在不同设备上测试界面适配</li>
                <li>• 试问："你们有什么按摩服务？"</li>
                <li>• 试问："我想了解价格"</li>
                <li>• 试问："如何预约？"</li>
                <li>• 观察AI是否会推荐联系方式</li>
                <li>• 测试WeChat和WhatsApp二维码显示</li>
                <li>• 验证移动端输入框和按钮交互</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">移动端测试提示：</h2>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• 在移动设备上聊天框应显示为底部弹窗</li>
                <li>• 输入框应防止页面缩放</li>
                <li>• 按钮应有足够的触摸面积(44px+)</li>
                <li>• 滚动应流畅且支持触摸</li>
                <li>• 键盘弹出时界面应正确适配</li>
              </ul>
            </div>
          </div>
          
          {/* 预约助手 - 已包含设备检测和移动端优化 */}
          <CopilotKit runtimeUrl="/api/copilotkit">
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">初始化预约助手...</span>
              </div>
            }>
              <BookingAssistant 
                locale="zh"
                onBookingComplete={(data) => {
                  console.log('预约完成:', data);
                }}
              />
            </Suspense>
          </CopilotKit>
        </div>
      </div>
    </div>
  );
} 