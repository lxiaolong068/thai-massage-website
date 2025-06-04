'use client';

import React from 'react';
import { BookingAssistant } from '@/components/BookingAssistant';
import { CopilotKit } from '@copilotkit/react-core';

export default function BookingAssistantTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-center mb-4">
              预约助手测试页面
            </h1>
            <p className="text-gray-600 text-center mb-6">
              测试新的联系方式推荐功能：Line和Telegram可直接点击链接，WeChat和WhatsApp显示二维码
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">测试功能说明：</h2>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• AI助手会在回答问题后主动推荐联系方式</li>
                <li>• Line和Telegram提供可点击的直接链接</li>
                <li>• WeChat和WhatsApp会显示"显示二维码"按钮</li>
                <li>• 点击按钮会弹出二维码供用户扫描</li>
                <li>• 支持多语言（中文、英文、韩文）</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-green-800 mb-2">测试建议：</h2>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• 试问："你们有什么按摩服务？"</li>
                <li>• 试问："我想了解价格"</li>
                <li>• 试问："如何预约？"</li>
                <li>• 观察AI是否会在回答后推荐联系方式</li>
                <li>• 测试点击WeChat和WhatsApp是否显示二维码</li>
              </ul>
            </div>
          </div>
          
          {/* 预约助手 */}
          <CopilotKit runtimeUrl="/api/copilotkit">
            <BookingAssistant 
              locale="zh"
              onBookingComplete={(data) => {
                console.log('预约完成:', data);
              }}
            />
          </CopilotKit>
        </div>
      </div>
    </div>
  );
} 