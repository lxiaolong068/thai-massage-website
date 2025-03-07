# 泰式按摩网站 (Thai Massage Website)

这是一个使用Next.js 14和Tailwind CSS构建的泰式按摩服务网站。该网站设计精美，响应式布局，并针对SEO进行了优化。

## 功能特点

- 响应式设计，适配各种设备尺寸
- 现代化UI设计，提供良好的用户体验
- 多个页面组件，包括首页、服务介绍、价格列表、预约系统等
- 表单验证和交互功能
- SEO友好的元数据和结构
- 针对Google搜索引擎优化

## 技术栈

- [Next.js 14](https://nextjs.org/) - React框架
- [React 18](https://reactjs.org/) - JavaScript库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [ESLint](https://eslint.org/) - 代码质量工具
- [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器

## 项目结构

```
thai-massage/
├── public/             # 静态资源
│   └── images/         # 图片资源
├── src/                # 源代码
│   ├── app/            # Next.js App Router
│   │   ├── book/       # 预约页面
│   │   ├── globals.css # 全局样式
│   │   ├── layout.tsx  # 根布局
│   │   └── page.tsx    # 首页
│   └── components/     # React组件
│       ├── Header.tsx  # 页头组件
│       ├── Footer.tsx  # 页脚组件
│       ├── Hero.tsx    # 首屏组件
│       └── ...         # 其他组件
├── tailwind.config.js  # Tailwind配置
├── tsconfig.json       # TypeScript配置
├── .npmrc              # pnpm配置
└── package.json        # 项目依赖
```

## 开始使用

### 前提条件

- Node.js 18.17.0或更高版本
- pnpm包管理器 (推荐)

### 安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/thai-massage.git
cd thai-massage
```

2. 安装依赖

```bash
pnpm install
```

3. 运行开发服务器

```bash
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
pnpm build
```

### 运行生产版本

```bash
pnpm start
```

## SEO优化

本项目已针对搜索引擎优化进行了以下设置：

- 使用语义化HTML标签
- 添加适当的meta标签和Open Graph协议支持
- 优化图片加载和性能
- 响应式设计，适配移动设备
- 结构化数据标记

## 自定义和扩展

您可以通过修改以下文件来自定义网站：

- `tailwind.config.js` - 自定义颜色、字体和其他设计变量
- `src/app/globals.css` - 添加自定义全局样式
- `src/app/layout.tsx` - 修改网站的元数据和布局

## 贡献

欢迎提交问题和拉取请求。对于重大更改，请先打开一个问题讨论您想要更改的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
