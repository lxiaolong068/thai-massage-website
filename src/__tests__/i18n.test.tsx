import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NextIntlClientProvider } from 'next-intl';
import ExampleComponent from '../components/ExampleComponent';

// 模拟翻译文件
const enMessages = {
  ExampleComponent: {
    title: 'Hello World',
    description: 'This is an example component',
  },
};

const zhMessages = {
  ExampleComponent: {
    title: '你好，世界',
    description: '这是一个示例组件',
  },
};

describe('国际化测试', () => {
  test('英文环境下正确渲染', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <ExampleComponent />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('This is an example component')).toBeInTheDocument();
  });
  
  test('中文环境下正确渲染', () => {
    render(
      <NextIntlClientProvider locale="zh" messages={zhMessages}>
        <ExampleComponent />
      </NextIntlClientProvider>
    );
    
    expect(screen.getByText('你好，世界')).toBeInTheDocument();
    expect(screen.getByText('这是一个示例组件')).toBeInTheDocument();
  });
}); 