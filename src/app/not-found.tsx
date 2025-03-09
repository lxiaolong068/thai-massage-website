import { defaultLocale } from '@/i18n/locales';

export default function RootNotFound() {
  // 不要重定向到 404 页面，这会导致循环
  // 直接显示一个简单的错误页面
  return (
    <html>
      <body>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1>404 - 页面未找到</h1>
          <p>请访问 <a href={`/${defaultLocale}`} style={{ color: 'blue', textDecoration: 'underline' }}>主页</a></p>
        </div>
      </body>
    </html>
  );
} 