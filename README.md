# 泰式按摩网站 (Thai Massage Website)

*中文版本 | [English Version](README.en.md)*

这是一个使用Next.js 14和Tailwind CSS构建的泰式按摩服务网站。该网站设计精美，响应式布局，并针对SEO进行了优化，适合用于展示泰式按摩服务和在线预约。

## 功能特点

- **响应式设计**：完美适配手机、平板和桌面设备
- **现代化UI设计**：精美的界面和流畅的用户体验
- **多语言支持**：支持中文和英文界面
- **丰富的组件**：
  - 动态轮播图展示
  - 服务项目和价格列表
  - 专业按摩师团队介绍
  - 客户评价展示
  - 联系表单和地图集成
- **多步骤预约系统**：用户友好的预约流程
- **表单验证**：确保用户输入的数据有效
- **SEO优化**：针对搜索引擎优化的元数据和结构

## 技术栈

- [Next.js 14](https://nextjs.org/) - React框架，支持服务端渲染和静态生成
- [React 18](https://reactjs.org/) - 用于构建用户界面的JavaScript库
- [TypeScript](https://www.typescriptlang.org/) - 提供类型安全的JavaScript超集
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架，用于快速构建自定义设计
- [ESLint](https://eslint.org/) - 代码质量工具，确保代码一致性
- [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器

## 详细项目结构

```
thai-massage/
├── public/                 # 静态资源
│   └── images/             # 图片资源
│       ├── slider-1.jpg    # 轮播图图片
│       ├── therapist-1.jpg # 按摩师图片
│       └── ...             # 其他图片
├── src/                    # 源代码
│   ├── app/                # Next.js App Router
│   │   ├── book/           # 预约页面
│   │   │   └── page.tsx    # 预约页面组件
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React组件
│   │   ├── Header.tsx      # 页头导航组件
│   │   ├── Footer.tsx      # 页脚组件
│   │   ├── Hero.tsx        # 首屏轮播组件
│   │   ├── About.tsx       # 关于我们组件
│   │   ├── Services.tsx    # 服务和价格组件
│   │   ├── Therapists.tsx  # 按摩师团队组件
│   │   ├── Testimonials.tsx# 客户评价组件
│   │   ├── Contact.tsx     # 联系表单组件
│   │   └── ...             # 其他组件
│   └── styles/             # 其他样式文件
├── scripts/                # 脚本文件
│   └── download-images.js  # 图片下载脚本
├── tailwind.config.js      # Tailwind配置
├── next.config.js          # Next.js配置
├── tsconfig.json           # TypeScript配置
├── .npmrc                  # pnpm配置
├── package.json            # 项目依赖
└── README.md               # 项目文档
```

## 组件说明

### 1. 首页组件 (`src/app/page.tsx`)
首页组件整合了多个子组件，包括轮播图、服务介绍、按摩师团队等。

### 2. 轮播图组件 (`src/components/Hero.tsx`)
展示精美的按摩服务图片，支持自动轮播和手动切换。

### 3. 服务组件 (`src/components/Services.tsx`)
展示各种按摩服务、详细描述和价格信息。

### 4. 按摩师团队组件 (`src/components/Therapists.tsx`)
展示专业按摩师的信息、专长和经验。

### 5. 预约系统 (`src/app/book/page.tsx`)
多步骤预约表单，包括服务选择、时间选择和个人信息填写。

## 开始使用

### 前提条件

- Node.js 18.17.0或更高版本
- pnpm包管理器 (推荐)

### 本地开发

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

## Vercel部署说明

Vercel是部署Next.js应用的最佳平台，提供了无缝集成和自动部署功能。

### 部署步骤

1. **创建Vercel账户**
   - 访问 [Vercel官网](https://vercel.com/) 并注册账户
   - 可以使用GitHub、GitLab或Bitbucket账户直接登录

2. **导入项目**
   - 在Vercel控制台中点击"Import Project"
   - 选择"Import Git Repository"
   - 授权Vercel访问您的GitHub/GitLab/Bitbucket账户
   - 选择thai-massage仓库

3. **配置项目**
   - 项目名称：输入您想要的项目名称，如"thai-massage"
   - 框架预设：Vercel会自动检测为Next.js
   - 构建命令：保持默认（`next build`）
   - 输出目录：保持默认（`.next`）
   - 环境变量：如果需要，可以添加环境变量

4. **部署项目**
   - 点击"Deploy"按钮
   - Vercel会自动构建和部署您的项目
   - 部署完成后，您会获得一个类似`https://your-project-name.vercel.app`的URL

5. **自定义域名**（可选）
   - 在项目设置中点击"Domains"
   - 添加您的自定义域名
   - 按照Vercel提供的说明配置DNS记录

### 持续部署

Vercel支持持续部署，每当您推送更改到Git仓库时，Vercel会自动重新构建和部署您的项目。

- **预览部署**：当您创建Pull Request时，Vercel会自动创建预览部署
- **生产部署**：当您合并到主分支时，Vercel会自动更新生产环境

### 监控和分析

Vercel提供了内置的监控和分析工具：

- **Analytics**：查看网站流量和性能指标
- **Logs**：查看部署和运行日志
- **Speed Insights**：分析网站加载速度和性能

## SEO优化

本项目已针对搜索引擎优化进行了以下设置：

- **语义化HTML**：使用适当的HTML标签结构
- **元数据优化**：
  - 添加适当的title和meta描述
  - 支持Open Graph协议，优化社交媒体分享
  - 添加规范链接标签
- **图片优化**：
  - 使用Next.js的Image组件自动优化图片
  - 添加适当的alt文本
- **响应式设计**：确保在所有设备上都有良好的用户体验
- **结构化数据**：添加JSON-LD结构化数据，提高搜索结果展示效果

## 自定义和扩展

您可以通过修改以下文件来自定义网站：

- `tailwind.config.js` - 自定义颜色、字体和其他设计变量
- `src/app/globals.css` - 添加自定义全局样式
- `src/app/layout.tsx` - 修改网站的元数据和布局
- `public/images/` - 替换图片资源

### 添加新服务

1. 在`src/components/Services.tsx`中添加新的服务项目
2. 在`public/images/`目录中添加相应的图片
3. 如果需要，更新预约表单中的服务选项

### 添加新按摩师

在`src/components/Therapists.tsx`文件中的`therapists`数组中添加新的按摩师信息。

## 性能优化

- 使用Next.js的图片优化功能
- 组件懒加载
- 代码分割
- 静态生成和增量静态再生成

## 故障排除

### 常见问题

1. **安装依赖失败**
   - 确保您使用的是Node.js 18.17.0或更高版本
   - 尝试使用`pnpm install --force`

2. **图片不显示**
   - 检查图片路径是否正确
   - 确保图片已经下载到`public/images/`目录

3. **样式问题**
   - 确保Tailwind CSS正确配置
   - 检查类名是否正确应用

## 贡献

欢迎提交问题和拉取请求。对于重大更改，请先打开一个问题讨论您想要更改的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
