import { redirect } from 'next/navigation';
import { BookingModal } from '@/components/BookingModal';
import { BookingAssistant } from '@/components/BookingAssistant';
import { useState } from 'react';
import { CopilotKit } from '@copilotkit/react-core';

// 重定向到默认语言页面
export default function HomePage() {
  // 重定向到英语页面（作为默认语言）
  redirect('/en');
}
