# CopilotKit AI预约助手设置指南

本项目已集成CopilotKit AI预约助手，让用户可以通过自然语言对话来预约按摩服务，无需手动填写复杂的表单。

## 功能特性

- 🤖 **智能对话预约**：用户可以用自然语言描述需求，AI助手会引导完成预约
- 📅 **实时时间查询**：自动查询可用时间段和按摩师排班
- ✅ **数据验证**：自动验证预约信息的完整性和有效性
- 🎯 **智能推荐**：根据用户需求推荐合适的服务和按摩师
- 📱 **响应式界面**：支持桌面和移动设备

## 安装配置

### 1. 环境变量配置

复制 `.env.example` 文件为 `.env.local`：

```bash
cp .env.example .env.local
```

在 `.env.local` 文件中配置Google Gemini API密钥：

```env
# CopilotKit配置
GOOGLE_API_KEY="your-google-api-key-here"
```

### 2. 获取Google Gemini API密钥

1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录或注册账户
3. 进入 API Keys 页面
4. 创建新的API密钥
5. 将密钥复制到 `.env.local` 文件中

### 3. 依赖包安装

CopilotKit相关依赖已经安装，包括：

- `@copilotkit/react-core` - 核心功能
- `@copilotkit/react-ui` - UI组件
- `@copilotkit/runtime-client-gql` - 运行时客户端

如需重新安装：

```bash
pnpm add @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime-client-gql -w
```

## 使用方法

### 用户端使用

1. 访问网站首页
2. 点击右下角的AI助手图标
3. 开始与AI助手对话，例如：
   - "我想预约一个泰式按摩"
   - "明天下午有空的按摩师吗？"
   - "帮我预约周五晚上的深层组织按摩"

### AI助手功能

AI助手可以帮助用户：

1. **选择服务**：根据用户描述推荐合适的按摩服务
2. **选择按摩师**：根据专长和可用性推荐按摩师
3. **选择时间**：查询并推荐可用的时间段
4. **填写信息**：收集客户联系信息
5. **确认预约**：验证信息并提交预约

## 技术实现

### 核心组件

- **BookingAssistant** (`/src/components/BookingAssistant.tsx`)
  - 主要的AI助手组件
  - 集成CopilotKit的聊天界面和动作处理
  - 管理预约状态和数据流

- **CopilotKit API路由** (`/src/app/api/copilotkit/route.ts`)
  - 处理AI助手的后端逻辑
  - 定义可用的动作和数据验证
  - 与Google Gemini API集成

### 可用动作

1. **getAvailableTimeSlots** - 获取可用时间段
2. **checkServiceAvailability** - 检查服务可用性
3. **getTherapistSchedule** - 获取按摩师排班
4. **validateBookingData** - 验证预约数据

### 数据流

```
用户输入 → AI理解 → 调用相应动作 → 获取数据 → 更新状态 → 响应用户
```

## 自定义配置

### 修改AI助手指令

在 `BookingAssistant.tsx` 中修改 `instructions` 属性：

```typescript
const instructions = `
你是一个专业的泰式按摩预约助手...
// 在这里自定义AI助手的行为和回复风格
`;
```

### 添加新的动作

在 `/src/app/api/copilotkit/route.ts` 中的 `actions` 数组中添加新动作：

```typescript
{
  name: "yourNewAction",
  description: "动作描述",
  parameters: [...],
  handler: async (params) => {
    // 处理逻辑
  }
}
```

### 样式自定义

CopilotKit组件支持CSS自定义，可以通过以下方式修改样式：

```css
/* 自定义聊天窗口样式 */
.copilot-sidebar {
  /* 你的样式 */
}

/* 自定义消息样式 */
.copilot-message {
  /* 你的样式 */
}
```

## 故障排除

### 常见问题

1. **AI助手不响应**
   - 检查Google Gemini API密钥是否正确配置
   - 确认API密钥有足够的额度
   - 查看浏览器控制台是否有错误信息

2. **预约提交失败**
   - 检查后端API是否正常运行
   - 确认数据库连接是否正常
   - 查看服务器日志获取详细错误信息

3. **样式显示异常**
   - 确认CSS文件正确加载
   - 检查是否有样式冲突
   - 清除浏览器缓存

### 调试模式

在开发环境中，可以在浏览器控制台查看详细的调试信息：

```javascript
// 启用CopilotKit调试模式
localStorage.setItem('copilotkit-debug', 'true');
```

## 更新和维护

### 更新CopilotKit

```bash
pnpm update @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime-client-gql
```

### 监控使用情况

建议监控以下指标：
- Google Gemini API使用量和成本
- 预约成功率
- 用户满意度
- 系统响应时间

## 支持和文档

- [CopilotKit官方文档](https://docs.copilotkit.ai/)
- [Google Gemini API文档](https://ai.google.dev/docs)
- [项目GitHub仓库](https://github.com/your-repo)

## 许可证

本项目遵循MIT许可证。CopilotKit的使用需要遵循其相应的许可证条款。