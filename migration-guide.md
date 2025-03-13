# API迁移指南

本指南旨在帮助开发团队将现有应用程序从旧的API结构迁移到新的API结构。

## 目录

1. [迁移概述](#迁移概述)
2. [API路径变更](#api路径变更)
3. [响应格式变更](#响应格式变更)
4. [认证机制变更](#认证机制变更)
5. [前端组件更新](#前端组件更新)
6. [迁移步骤](#迁移步骤)
7. [常见问题](#常见问题)

## 迁移概述

我们对API结构进行了全面升级，主要变更包括：

1. 引入API版本控制
2. 统一API响应格式
3. 按照功能分类API（公共、客户端、管理员）
4. 增强错误处理机制
5. 改进认证与授权流程

这些变更旨在提高API的可维护性、安全性和可扩展性。

## API路径变更

### 旧路径到新路径的映射

| 旧API路径 | 新API路径 | 说明 |
|---------|----------|-----|
| `/api/public/services` | `/api/v1/public/services` | 获取服务列表 |
| `/api/public/therapists` | `/api/v1/public/therapists` | 获取按摩师列表 |
| `/api/bookings/create` | `/api/v1/public/bookings` (POST) | 创建预约 |
| `/api/bookings/available-times` | `/api/v1/public/bookings?date=xxx` (GET) | 获取可用时间段 |
| `/api/client/bookings` | `/api/v1/client/bookings` | 获取客户预约列表 |
| `/api/client/bookings/cancel` | `/api/v1/client/bookings` (POST) | 取消预约 |
| `/api/client/profile` | `/api/v1/client/profile` | 获取/更新个人资料 |
| `/api/admin/services` | `/api/v1/admin/services` | 管理服务 |
| `/api/admin/therapists` | `/api/v1/admin/therapists` | 管理按摩师 |
| `/api/admin/bookings` | `/api/v1/admin/bookings` | 管理预约 |
| `/api/admin/users` | `/api/v1/admin/users` | 管理用户 |
| `/api/admin/dashboard` | `/api/v1/admin/stats` | 获取仪表盘数据 |
| `/api/admin/settings` | `/api/v1/admin/settings` | 管理系统设置 |

## 响应格式变更

### 旧响应格式

旧API的响应格式不统一，可能是以下几种形式之一：

```json
// 成功响应示例1
{
  "data": [...],
  "status": "success"
}

// 成功响应示例2
{
  "result": {...},
  "ok": true
}

// 错误响应示例1
{
  "error": "错误信息",
  "status": "error"
}

// 错误响应示例2
{
  "message": "错误信息",
  "success": false
}
```

### 新响应格式

新API采用统一的响应格式：

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

## 认证机制变更

### 旧认证机制

旧API使用多种认证方式：

- 部分API使用URL查询参数传递令牌：`?token=xxx`
- 部分API使用请求头传递令牌：`Authorization: Bearer xxx`
- 部分API使用Cookie传递令牌，但Cookie名称不统一

### 新认证机制

新API统一使用Cookie进行认证：

- 客户端API：使用`client_token` Cookie
- 管理员API：使用`admin_session` Cookie

所有认证令牌都有过期时间，过期后需要重新登录获取新的令牌。

## 前端组件更新

### API请求工具更新

需要更新前端API请求工具，以适应新的API路径和响应格式：

```typescript
// 旧的API请求工具
async function fetchAPI(path, options = {}) {
  const response = await fetch(`/api/${path}`, options);
  const data = await response.json();
  
  if (data.status === 'error' || data.success === false) {
    throw new Error(data.error || data.message);
  }
  
  return data.data || data.result;
}

// 新的API请求工具
async function fetchAPI(path, options = {}) {
  const response = await fetch(`/api/v1/${path}`, options);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error.message);
  }
  
  return data.data;
}
```

### 组件更新示例

以预约表单组件为例：

```typescript
// 旧的预约表单提交
async function submitBooking(bookingData) {
  try {
    const result = await fetchAPI('bookings/create', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    
    return result;
  } catch (error) {
    console.error('预约失败:', error);
    throw error;
  }
}

// 新的预约表单提交
async function submitBooking(bookingData) {
  try {
    const result = await fetchAPI('public/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    
    return result;
  } catch (error) {
    console.error('预约失败:', error);
    throw error;
  }
}
```

## 迁移步骤

1. **更新API请求工具**
   - 修改API请求工具，适应新的路径和响应格式
   - 添加错误处理逻辑，处理新的错误响应格式

2. **逐步迁移前端组件**
   - 从公共API开始，逐步更新前端组件
   - 优先更新核心功能，如预约流程
   - 确保每个组件都能正确处理新的响应格式

3. **更新认证逻辑**
   - 修改登录和认证相关代码，使用新的Cookie机制
   - 确保认证状态管理与新API兼容

4. **测试与验证**
   - 对每个迁移的组件进行全面测试
   - 验证错误处理和边缘情况
   - 确保用户体验不受影响

5. **完全切换**
   - 当所有组件都已迁移并测试通过后，完全切换到新API
   - 移除旧API相关代码

## 常见问题

### 如何处理迁移期间的兼容性问题？

在迁移期间，我们将保持旧API和新API同时可用，以确保平滑过渡。前端可以逐步迁移，而不必一次性完成所有更改。

### 如何处理缓存问题？

新API使用不同的路径，因此不会与旧API的缓存冲突。但是，如果您的应用程序使用了客户端缓存，可能需要清除缓存或更新缓存键。

### 如何监控迁移进度？

我们建议使用以下方法监控迁移进度：

1. 添加日志记录，跟踪新旧API的使用情况
2. 设置监控仪表盘，显示新旧API的请求量
3. 定期检查错误日志，及时发现并解决问题

### 迁移失败如何回滚？

如果迁移过程中发现严重问题，可以通过以下步骤回滚：

1. 将前端代码回滚到使用旧API的版本
2. 确保旧API仍然可用
3. 解决问题后再次尝试迁移

## 支持与帮助

如果您在迁移过程中遇到任何问题，请联系API开发团队获取支持：

- 邮箱：api-support@thaimassage.example.com
- 内部聊天群组：#api-migration-support 