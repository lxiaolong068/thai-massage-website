# 泰式按摩网站 (Thai Massage Website)

*中文版本 | [English Version](README.en.md)*

这是一个使用Next.js 14和Tailwind CSS构建的泰式按摩服务网站。该网站设计精美，响应式布局，并针对SEO进行了优化，适合用于展示泰式按摩服务和在线预约。

## 功能特点

- **响应式设计**：完美适配手机、平板和桌面设备
- **现代化UI设计**：精美的界面和流畅的用户体验
- **多语言支持**：支持英文、中文、泰语和韩语界面
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
- [next-intl](https://next-intl-docs.vercel.app/) - Next.js的国际化解决方案
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
│   │   ├── [locale]/       # 国际化路由
│   │   │   ├── page.tsx    # 多语言首页
│   │   │   ├── about/      # 关于我们页面
│   │   │   ├── services/   # 服务页面
│   │   │   ├── therapists/ # 按摩师页面
│   │   │   ├── contact/    # 联系页面
│   │   │   └── book/       # 预约页面
│   │   ├── globals.css     # 全局样式
│   │   └── page.tsx        # 重定向到默认语言页面
│   ├── components/         # React组件
│   │   ├── Header.tsx      # 页头导航组件
│   │   ├── Footer.tsx      # 页脚组件
│   │   ├── Hero.tsx        # 首屏轮播组件
│   │   ├── About.tsx       # 关于我们组件
│   │   ├── Services.tsx    # 服务和价格组件
│   │   ├── Therapists.tsx  # 按摩师团队组件
│   │   ├── Testimonials.tsx# 客户评价组件
│   │   ├── Contact.tsx     # 联系表单组件
│   │   ├── LanguageSwitcher.tsx # 语言切换组件
│   │   └── ...             # 其他组件
│   ├── i18n/               # 国际化相关文件
│   │   ├── messages/       # 翻译文件
│   │   │   ├── en.json     # 英文翻译
│   │   │   ├── zh.json     # 中文翻译
│   │   │   ├── th.json     # 泰语翻译
│   │   │   └── ko.json     # 韩语翻译
│   │   ├── i18n.ts         # 国际化配置
│   │   ├── client.ts       # 客户端国际化工具
│   │   └── server.ts       # 服务器端国际化工具
│   └── styles/             # 其他样式文件
├── scripts/                # 脚本文件
│   ├── check-image-references.js  # 检查图片引用脚本
│   ├── backup-unused-images.js    # 备份未使用图片脚本
│   ├── download-images.js  # 图片下载脚本
│   └── extract-translations.js # 提取翻译文本脚本
├── middleware.ts           # Next.js中间件（处理国际化路由）
├── tailwind.config.js      # Tailwind配置
├── next.config.js          # Next.js配置
├── tsconfig.json           # TypeScript配置
├── .npmrc                  # pnpm配置
├── package.json            # 项目依赖
└── README.md               # 项目文档
```

## 组件说明

### 1. 首页组件 (`src/app/[locale]/page.tsx`)
首页组件整合了多个子组件，包括轮播图、服务介绍、按摩师团队等。

### 2. 轮播图组件 (`src/components/Hero.tsx`)
展示精美的按摩服务图片，支持自动轮播和手动切换。

### 3. 服务组件 (`src/components/Services.tsx`)
展示各种按摩服务、详细描述和价格信息。

### 4. 按摩师团队组件 (`src/components/Therapists.tsx`)
展示专业按摩师的信息、专长和经验。

### 5. 预约系统 (`src/app/[locale]/book/page.tsx`)
多步骤预约表单，包括服务选择、时间选择和个人信息填写。

### 6. 语言切换组件 (`src/components/LanguageSwitcher.tsx`)
允许用户在英文、中文、泰语和韩语之间切换网站语言。

## 国际化实现

本项目使用`next-intl`实现多语言支持，主要特点包括：

### 1. 支持的语言
- 英文 (en) - 默认语言
- 中文 (zh)
- 泰语 (th)
- 韩语 (ko)

### 2. 实现方式
- 使用Next.js的动态路由`[locale]`参数实现多语言路由
- 通过中间件自动检测用户浏览器语言设置
- 提供直观的语言切换功能
- 使用JSON格式存储各语言的翻译文本
- 为不同语言版本提供适当的SEO元数据

### 3. 翻译文件结构
翻译文件按功能区域组织，存储在`src/i18n/messages/`目录下：
```json
{
  "common": {
    "navigation": { ... },
    "buttons": { ... }
  },
  "home": { ... },
  "services": { ... },
  "about": { ... },
  "contact": { ... },
  "therapists": { ... },
  "booking": { ... }
}
```

## 实用脚本工具

项目包含几个实用的脚本工具，用于管理图片资源和项目维护：

### 1. 检查图片引用 (`scripts/check-image-references.js`)

这个脚本用于检查项目中的图片引用情况，帮助识别未使用的图片和缺失的图片。

```bash
node scripts/check-image-references.js
```

功能：
- 扫描源代码中的所有图片引用
- 检查引用的图片是否存在
- 识别未使用的图片资源
- 为缺失的图片创建占位图

### 2. 备份未使用的图片 (`scripts/backup-unused-images.js`)

这个脚本用于将未使用的图片移动到备份目录，减少项目体积的同时保留这些资源以备将来使用。

```bash
node scripts/backup-unused-images.js
```

功能：
- 识别未被代码引用的图片
- 将这些图片移动到 `public/images_backup` 目录
- 保留原始文件名，便于将来恢复

### 3. 下载图片资源 (`scripts/download-images.js`)

这个脚本用于从网络下载项目所需的图片资源。

```bash
node scripts/download-images.js
```

功能：
- 从预定义的URL列表下载图片
- 自动保存到 `public/images` 目录
- 跳过已存在的图片，避免重复下载

### 4. 提取翻译文本 (`scripts/extract-translations.js`)

这个脚本用于从源代码中提取需要翻译的文本，并生成翻译模板。

```bash
node scripts/extract-translations.js
```

功能：
- 扫描源代码中的所有需要翻译的文本
- 生成翻译模板文件
- 识别缺失的翻译

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
- **多语言SEO**：
  - 为每种语言提供适当的元数据
  - 使用hreflang标签指示语言关系
- **图片优化**：
  - 使用Next.js的Image组件自动优化图片
  - 添加适当的alt文本
- **响应式设计**：确保在所有设备上都有良好的用户体验
- **结构化数据**：添加JSON-LD结构化数据，提高搜索结果展示效果

## 自定义和扩展

您可以通过修改以下文件来自定义网站：

- `tailwind.config.js` - 自定义颜色、字体和其他设计变量
- `src/app/globals.css` - 添加自定义全局样式
- `src/app/[locale]/layout.tsx` - 修改网站的元数据和布局
- `public/images/` - 替换图片资源
- `src/i18n/messages/` - 修改或添加翻译文本

### 添加新服务

1. 在`src/components/Services.tsx`中添加新的服务项目
2. 在`public/images/`目录中添加相应的图片
3. 在翻译文件中添加相应的翻译文本
4. 如果需要，更新预约表单中的服务选项

### 添加新按摩师

1. 在`src/components/Therapists.tsx`文件中的`therapists`数组中添加新的按摩师信息
2. 在翻译文件中添加相应的翻译文本

### 添加新语言

1. 在`src/i18n/config.ts`中的`locales`数组中添加新的语言代码
2. 在`src/i18n/messages/`目录下创建新的语言翻译文件
3. 确保所有需要翻译的文本都有对应的翻译

## 性能优化

- 使用Next.js的图片优化功能
- 组件懒加载
- 代码分割
- 静态生成和增量静态再生成
- 自定义Tailwind CSS组件，减少重复样式类
- 代码优化检查工具，帮助识别和修复代码问题
- 翻译文件动态导入，减少初始加载时间

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

4. **国际化问题**
   - 检查翻译文件是否完整
   - 确保所有组件都正确使用翻译API
   - 检查中间件配置是否正确

## 贡献

欢迎提交问题和拉取请求。对于重大更改，请先打开一个问题讨论您想要更改的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
