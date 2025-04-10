# 泰式按摩网站 (Thai Massage Website)

*中文版本 | [English Version](README.en.md)*

这是一个使用Next.js 14和Tailwind CSS构建的泰式按摩服务网站。该网站设计精美，响应式布局，并针对SEO进行了优化，适合用于展示泰式按摩服务和在线预约。

## 功能特点

- **响应式设计**：完美适配手机、平板和桌面设备
- **现代化UI设计**：精美的界面和流畅的用户体验
- **多语言支持**：支持英文、中文、韩语界面
- **丰富的组件**：
  - 动态轮播图展示
  - 服务项目和价格列表
  - 专业按摩师团队介绍
  - 客户评价展示
  - 联系表单和地图集成
- **多步骤预约系统**：用户友好的预约流程
- **表单验证**：确保用户输入的数据有效
- **SEO优化**：针对搜索引擎优化的元数据和结构
- **RESTful API**：提供完整的后端API支持

## 技术栈

- [Next.js 14](https://nextjs.org/) - React框架，支持服务端渲染和静态生成
- [React 18](https://reactjs.org/) - 用于构建用户界面的JavaScript库
- [TypeScript](https://www.typescriptlang.org/) - 提供类型安全的JavaScript超集
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架，用于快速构建自定义设计
- [next-intl](https://next-intl-docs.vercel.app/) - Next.js的国际化解决方案
- [Prisma](https://www.prisma.io/) - 下一代ORM，用于数据库访问
- [PostgreSQL](https://www.postgresql.org/) - 强大的开源关系型数据库
- [Jest](https://jestjs.io/) - JavaScript测试框架
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
允许用户在英文、中文和韩语之间切换网站语言。

## 国际化实现

本项目使用`next-intl`实现多语言支持，主要特点包括：

### 1. 支持的语言
- 英文 (en) - 默认语言
- 中文 (zh)
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

## 环境配置

本项目使用不同的环境配置文件来区分开发环境和生产环境。

### 环境变量文件

- `.env` - 默认环境配置，包含开发环境基础设置（**重要：此文件包含敏感信息，已在`.gitignore`中配置忽略，请勿提交到版本控制**）
- `.env.development` - 开发环境特定配置（通常不含敏感信息，可提交）
- `.env.production` - 生产环境特定配置模板（**重要：此文件可能包含敏感信息占位符或真实值，已在`.gitignore`中配置忽略，请勿提交到版本控制。生产环境的实际变量必须在部署平台设置**）
- `.env.example` - 环境变量示例文件（不含敏感信息，必须提交）

### 设置本地开发环境

1. 复制环境变量模板创建本地环境配置：

```bash
cp .env.example .env
```

2. 编辑`.env`文件，填入实际的数据库连接信息和其他必要配置。

### 必要的环境变量

以下是项目运行所需的关键环境变量：

#### 数据库连接（必需）

```
POSTGRES_URL=postgres://username:password@host:port/database?sslmode=require
POSTGRES_PRISMA_URL=postgres://username:password@host:port/database?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://username:password@host:port/database?sslmode=require
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_HOST=host
POSTGRES_DATABASE=database
```

#### 应用配置（必需）

```
NODE_ENV=development|production
NEXT_PUBLIC_API_URL=http://localhost:3000/api|https://your-production-domain.com/api
```

#### NextAuth配置（必需）

```
NEXTAUTH_URL=http://localhost:3000|https://your-production-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

## Vercel部署说明

Vercel是部署Next.js应用的最佳平台，提供了无缝集成和自动部署功能。

### 部署步骤

1. **创建Vercel账户**
   - 访问[Vercel](https://vercel.com/)并注册账户
   - 将GitHub仓库连接到Vercel

2. **配置项目**
   - 选择导入你的Thai Massage项目仓库
   - 配置构建设置（通常Vercel会自动检测Next.js项目）
   - 设置环境变量（见下文）

3. **设置环境变量**
   - 在Vercel项目设置中，添加以下环境变量。**注意：这些是生产环境的实际敏感值，绝不能存储在 `.env.production` 文件中并提交到 Git。`.env.production` 文件仅供参考或本地生产构建模拟，且必须被 `.gitignore` 忽略。**

   ```
   # 数据库连接（必需 - 请使用真实的生产环境值）
   POSTGRES_URL=postgres://username:password@host:port/database?sslmode=require
   POSTGRES_PRISMA_URL=postgres://username:password@host:port/database?sslmode=require
   POSTGRES_URL_NON_POOLING=postgres://username:password@host:port/database?sslmode=require
   POSTGRES_USER=username
   POSTGRES_PASSWORD=password
   POSTGRES_HOST=host
   POSTGRES_DATABASE=database
   
   # 应用配置（必需）
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app/api
   
   # NextAuth配置（必需）
   NEXTAUTH_URL=https://your-vercel-domain.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret
   
   # 如果使用Supabase（可选）
   SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_JWT_SECRET=your-jwt-secret
   SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **部署项目**
   - 点击"Deploy"按钮开始部署
   - Vercel会自动构建和部署你的项目

### 注意事项

1. **数据库连接**
   - 确保生产环境的数据库可以从Vercel的服务器访问
   - 建议使用支持SSL连接的数据库服务，如Supabase、Neon或AWS RDS

2. **Prisma配置**
   - 项目已配置`postinstall`脚本自动生成Prisma客户端
   - 确保Vercel环境中的Prisma版本与本地开发环境一致

3. **环境变量安全**
   - 不要在代码中硬编码敏感信息
   - 使用Vercel的环境变量功能存储敏感信息
   - 定期轮换数据库密码和API密钥

4. **域名配置**
   - 如果使用自定义域名，在Vercel中配置并更新`NEXT_PUBLIC_API_URL`

5. **监控和日志**
   - 使用Vercel的监控功能跟踪应用性能
   - 定期检查日志以识别潜在问题

### 故障排除

如果部署过程中遇到问题，请检查以下几点：

1. **构建错误**
   - 检查Vercel构建日志中的错误信息
   - 确保所有必要的环境变量都已正确设置
   - 验证`package.json`中的构建脚本是否正确

2. **Prisma相关错误**
   - 如果遇到Prisma客户端错误，尝试在本地运行`prisma generate`并重新部署
   - 确保`.vercelignore`文件正确配置，忽略不必要的Prisma文件

3. **数据库连接问题**
   - 验证数据库连接字符串是否正确
   - 确保数据库服务器允许来自Vercel的连接
   - 检查数据库用户权限是否足够

4. **API路由错误**
   - 确保`NEXT_PUBLIC_API_URL`设置正确
   - 检查API路由是否正确实现

### 生产环境优化

1. **启用缓存**
   - 配置适当的缓存策略以提高性能
   - 使用Vercel Edge Network加速内容分发

2. **监控性能**
   - 使用Vercel Analytics监控应用性能
   - 定期检查并优化慢查询

3. **自动扩展**
   - Vercel会自动处理流量增加时的扩展需求
   - 监控数据库负载，必要时升级数据库计划

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

## API文档

本项目提供了完整的RESTful API，用于管理服务、按摩师和预约。

### 服务API

#### 获取所有服务
```
GET /api/services?locale=en
```

#### 获取单个服务
```
GET /api/services/:id?locale=en
```

#### 创建新服务
```
POST /api/services
```

#### 更新服务
```
PUT /api/services/:id
```

#### 删除服务
```
DELETE /api/services/:id
```

### 按摩师API

#### 获取所有按摩师
```
GET /api/therapists?locale=en
```

#### 获取单个按摩师
```
GET /api/therapists/:id?locale=en
```

#### 创建新按摩师
```
POST /api/therapists
```

#### 更新按摩师
```
PUT /api/therapists/:id
```

#### 删除按摩师
```
DELETE /api/therapists/:id
```

### 预约API

#### 获取所有预约
```
GET /api/bookings
```

#### 获取单个预约
```
GET /api/bookings/:id
```

#### 创建新预约
```
POST /api/bookings
```

#### 更新预约
```
PUT /api/bookings/:id
```

#### 删除预约
```
DELETE /api/bookings/:id
```

## 测试

本项目使用Jest和Supertest进行API测试。

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行API测试
pnpm test:api

# 监视模式运行测试
pnpm test:watch
```

### 测试覆盖范围

- **服务API测试**：测试服务的CRUD操作
- **按摩师API测试**：测试按摩师的CRUD操作
- **预约API测试**：测试预约的CRUD操作
- **错误处理测试**：测试API的错误处理机制
- **数据验证测试**：测试API的数据验证功能

# 泰式按摩预约系统 API 重构

## 项目概述

本项目对泰式按摩预约系统的API进行了全面重构，旨在提高API的可维护性、安全性和可扩展性。主要工作包括：

1. 引入API版本控制机制
2. 统一API响应格式
3. 按照功能分类API（公共、客户端、管理员）
4. 增强错误处理机制
5. 改进认证与授权流程

## 目录结构

```
src/app/api/
├── v1/                         # API版本1
│   ├── middleware.ts           # API中间件（版本控制、认证）
│   ├── public/                 # 公共API（无需授权）
│   │   ├── services/           # 服务相关API
│   │   ├── therapists/         # 按摩师相关API
│   │   └── bookings/           # 预约相关API
│   ├── client/                 # 客户端API（需要客户授权）
│   │   ├── bookings/           # 客户预约管理API
│   │   └── profile/            # 客户个人资料API
│   └── admin/                  # 管理员API（需要管理员授权）
│       ├── services/           # 服务管理API
│       ├── therapists/         # 按摩师管理API
│       ├── bookings/           # 预约管理API
│       ├── users/              # 用户管理API
│       ├── stats/              # 统计数据API
│       └── settings/           # 系统设置API
└── utils/                      # 工具函数
    └── api/                    # API相关工具
        └── response.ts         # 统一响应格式工具
```

## 文档

- [API文档](api-docs.md)：详细说明API的使用方法、请求参数和响应格式
- [迁移指南](migration-guide.md)：帮助开发团队从旧API结构迁移到新API结构

## 主要特性

### API版本控制

API使用路径前缀进行版本控制，当前版本为`v1`：

```
/api/v1/[api-type]/[resource]
```

也可以通过请求头`API-Version`指定API版本。

### 统一响应格式

所有API响应均使用统一的格式：

```json
// 成功响应
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误信息"
  }
}
```

### API分类

API按照功能和授权需求分为三类：

- **公共API**：无需授权，可直接访问的API
- **客户端API**：需要客户授权的API
- **管理员API**：需要管理员授权的API

### 认证机制

API使用Cookie进行认证：

- 客户端API：使用`client_token` Cookie
- 管理员API：使用`admin_session` Cookie

## 实施进度

| 阶段 | 状态 | 完成日期 |
|------|------|---------|
| API版本控制中间件 | ✅ 已完成 | 2023-11-15 |
| 统一响应格式 | ✅ 已完成 | 2023-11-15 |
| 公共API迁移 | ✅ 已完成 | 2023-11-15 |
| 客户端API迁移 | ✅ 已完成 | 2023-11-15 |
| 管理员API迁移 | ✅ 已完成 | 2023-11-15 |
| 前端组件更新 | 🟡 进行中 | - |
| 测试与调试 | 🟡 进行中 | - |
| 文档更新 | ✅ 已完成 | 2023-11-15 |

## 下一步计划

1. **完成前端组件更新**
   - 更新API请求工具
   - 逐步迁移前端组件
   - 更新认证逻辑

2. **全面测试**
   - 对所有API端点进行单元测试
   - 进行集成测试
   - 进行性能测试

3. **部署与监控**
   - 部署新API到生产环境
   - 设置监控和告警
   - 收集用户反馈

## 贡献者

- 开发团队
- API设计团队
- 前端团队
- 测试团队

## 许可证

本项目采用私有许可证，仅供内部使用。
