const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 指向Next.js应用的路径
  dir: './',
});

// 自定义Jest配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
    }],
  },
  // 添加全局变量
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  // 添加测试环境变量
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
};

// createJestConfig会将Next.js的配置与我们的自定义配置合并
module.exports = createJestConfig(customJestConfig); 