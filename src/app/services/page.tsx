import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function DefaultServicesPage() {
  // 重定向到带有默认语言前缀的路径
  redirect(`/${defaultLocale}/services`);
} 