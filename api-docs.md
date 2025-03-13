# 泰式按摩预约系统 API 文档

## 目录

1. [API 概述](#api-概述)
2. [API 版本控制](#api-版本控制)
3. [统一响应格式](#统一响应格式)
4. [公共 API](#公共-api)
5. [客户端 API](#客户端-api)
6. [管理员 API](#管理员-api)
7. [错误处理](#错误处理)
8. [认证与授权](#认证与授权)

## API 概述

泰式按摩预约系统 API 采用 RESTful 架构，支持以下三种类型的 API：

- **公共 API**：无需授权，可直接访问的 API
- **客户端 API**：需要客户授权的 API
- **管理员 API**：需要管理员授权的 API

所有 API 请求和响应均使用 JSON 格式。

## API 版本控制

API 使用路径前缀进行版本控制，当前版本为 `v1`。

```
/api/v1/[api-type]/[resource]
```

也可以通过请求头 `API-Version` 指定 API 版本：

```
API-Version: v1
```

## 统一响应格式

所有 API 响应均使用统一的格式：

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误信息"
  }
}
```

## 公共 API

公共 API 不需要授权，可直接访问。

### 服务 API

#### 获取所有服务

- **URL**: `/api/v1/public/services`
- **方法**: `GET`
- **参数**:
  - `locale` (可选): 语言代码，默认为 `en`，支持 `zh`、`en`、`ko`

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "price": 1200,
      "duration": 60,
      "imageUrl": "/images/traditional-thai-new.jpg",
      "name": "传统泰式按摩",
      "description": "使用正宗技术的古老按摩方法，缓解身体紧张。",
      "slug": "traditional-thai-massage"
    },
    // 更多服务...
  ]
}
```

### 按摩师 API

#### 获取所有按摩师

- **URL**: `/api/v1/public/therapists`
- **方法**: `GET`
- **参数**:
  - `locale` (可选): 语言代码，默认为 `en`，支持 `zh`、`en`、`ko`
  - `serviceId` (可选): 按服务 ID 过滤按摩师

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "莉莉",
      "imageUrl": "/images/therapist-1.jpg",
      "bio": "专业按摩师，拥有10年经验。擅长传统泰式按摩和精油按摩。",
      "specialties": ["traditional", "oil"],
      "experience": 10,
      "experienceYears": 10,
      "serviceIds": ["1", "2"]
    },
    // 更多按摩师...
  ]
}
```

### 预约 API

#### 创建预约

- **URL**: `/api/v1/public/bookings`
- **方法**: `POST`
- **请求体**:

```json
{
  "serviceId": "1",
  "therapistId": "1",
  "date": "2023-12-15",
  "time": "10:00",
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "notes": "请准备热毛巾"
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "serviceId": "1",
    "therapistId": "1",
    "date": "2023-12-15",
    "time": "10:00",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "notes": "请准备热毛巾",
    "status": "pending",
    "createdAt": "2023-11-01T10:30:00Z"
  },
  "message": "预约创建成功"
}
```

#### 获取可用时间段

- **URL**: `/api/v1/public/bookings`
- **方法**: `GET`
- **参数**:
  - `date` (必填): 日期，格式为 `YYYY-MM-DD`
  - `serviceId` (可选): 服务 ID
  - `therapistId` (可选): 按摩师 ID

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "time": "09:00",
      "available": true
    },
    {
      "time": "10:00",
      "available": false
    },
    // 更多时间段...
  ]
}
```

## 客户端 API

客户端 API 需要客户授权，通过 Cookie 中的 `client_token` 进行认证。

### 预约管理 API

#### 获取客户预约列表

- **URL**: `/api/v1/client/bookings`
- **方法**: `GET`
- **参数**:
  - `status` (可选): 按状态过滤预约，可选值为 `pending`、`confirmed`、`completed`、`cancelled`

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "serviceId": "1",
      "serviceName": "传统泰式按摩",
      "therapistId": "1",
      "therapistName": "莉莉",
      "date": "2023-11-15",
      "time": "10:00",
      "status": "confirmed",
      "createdAt": "2023-11-01T10:30:00Z"
    },
    // 更多预约...
  ]
}
```

#### 取消预约

- **URL**: `/api/v1/client/bookings`
- **方法**: `POST`
- **请求体**:

```json
{
  "bookingId": "1",
  "reason": "临时有事"
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "cancelled",
    "cancelReason": "临时有事",
    "cancelledAt": "2023-11-08T09:10:00Z"
  },
  "message": "预约已成功取消"
}
```

### 个人资料 API

#### 获取个人资料

- **URL**: `/api/v1/client/profile`
- **方法**: `GET`

**响应示例**:

```json
{
  "success": true,
  "data": {
    "id": "client-id",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "preferredLocale": "zh",
    "createdAt": "2023-01-15T08:30:00Z",
    "lastLogin": "2023-11-05T14:20:00Z"
  }
}
```

#### 更新个人资料

- **URL**: `/api/v1/client/profile`
- **方法**: `PUT`
- **请求体**:

```json
{
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "preferredLocale": "zh"
}
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "id": "client-id",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "preferredLocale": "zh",
    "updatedAt": "2023-11-10T15:30:00Z"
  },
  "message": "个人资料已更新"
}
```

## 管理员 API

管理员 API 需要管理员授权，通过 Cookie 中的 `admin_session` 进行认证。

### 服务管理 API

#### 获取所有服务

- **URL**: `/api/v1/admin/services`
- **方法**: `GET`
- **参数**:
  - `locale` (可选): 语言代码，默认为 `zh`

**响应示例**:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "price": 1200,
      "duration": 60,
      "imageUrl": "/images/traditional-thai-new.jpg",
      "translations": [
        { "locale": "zh", "name": "传统泰式按摩", "description": "使用正宗技术的古老按摩方法，缓解身体紧张。" },
        { "locale": "en", "name": "Traditional Thai Massage", "description": "Ancient massage method using authentic techniques to relieve body tension." },
        { "locale": "ko", "name": "전통 태국 마사지", "description": "정통 기법을 사용한 고대 마사지 방법으로 신체 긴장을 풀어줍니다." }
      ],
      "slug": "traditional-thai-massage",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-10-15T08:30:00Z"
    },
    // 更多服务...
  ]
}
```

#### 创建服务

- **URL**: `/api/v1/admin/services`
- **方法**: `POST`
- **请求体**:

```json
{
  "price": 1200,
  "duration": 60,
  "imageUrl": "/images/new-service.jpg",
  "translations": [
    { "locale": "zh", "name": "新服务", "description": "新服务描述" },
    { "locale": "en", "name": "New Service", "description": "New service description" }
  ],
  "slug": "new-service"
}
```

#### 更新服务

- **URL**: `/api/v1/admin/services`
- **方法**: `PUT`
- **请求体**:

```json
{
  "id": "1",
  "price": 1300,
  "duration": 75,
  "imageUrl": "/images/updated-service.jpg",
  "translations": [
    { "locale": "zh", "name": "更新的服务", "description": "更新的服务描述" }
  ],
  "isActive": true
}
```

#### 删除服务

- **URL**: `/api/v1/admin/services`
- **方法**: `DELETE`
- **请求体**:

```json
{
  "id": "1"
}
```

### 按摩师管理 API

#### 获取所有按摩师

- **URL**: `/api/v1/admin/therapists`
- **方法**: `GET`
- **参数**:
  - `locale` (可选): 语言代码，默认为 `zh`
  - `serviceId` (可选): 按服务 ID 过滤按摩师

#### 创建按摩师

- **URL**: `/api/v1/admin/therapists`
- **方法**: `POST`
- **请求体**:

```json
{
  "imageUrl": "/images/new-therapist.jpg",
  "translations": [
    { "locale": "zh", "name": "新按摩师", "bio": "按摩师简介" },
    { "locale": "en", "name": "New Therapist", "bio": "Therapist bio" }
  ],
  "specialties": ["traditional", "oil"],
  "experience": 5,
  "serviceIds": ["1", "2"]
}
```

#### 更新按摩师

- **URL**: `/api/v1/admin/therapists`
- **方法**: `PUT`
- **请求体**:

```json
{
  "id": "1",
  "imageUrl": "/images/updated-therapist.jpg",
  "translations": [
    { "locale": "zh", "name": "更新的按摩师", "bio": "更新的简介" }
  ],
  "specialties": ["traditional", "oil", "foot"],
  "experience": 6,
  "serviceIds": ["1", "2", "4"],
  "isActive": true
}
```

#### 删除按摩师

- **URL**: `/api/v1/admin/therapists`
- **方法**: `DELETE`
- **请求体**:

```json
{
  "id": "1"
}
```

### 预约管理 API

#### 获取所有预约

- **URL**: `/api/v1/admin/bookings`
- **方法**: `GET`
- **参数**:
  - `status` (可选): 按状态过滤预约
  - `date` (可选): 按日期过滤预约
  - `therapistId` (可选): 按按摩师 ID 过滤预约
  - `serviceId` (可选): 按服务 ID 过滤预约

#### 创建预约

- **URL**: `/api/v1/admin/bookings`
- **方法**: `POST`
- **请求体**:

```json
{
  "serviceId": "1",
  "therapistId": "1",
  "date": "2023-12-15",
  "time": "10:00",
  "name": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "notes": "请准备热毛巾"
}
```

#### 更新预约状态

- **URL**: `/api/v1/admin/bookings`
- **方法**: `PUT`
- **请求体**:

```json
{
  "id": "1",
  "status": "confirmed",
  "notes": "已电话确认"
}
```

#### 删除预约

- **URL**: `/api/v1/admin/bookings`
- **方法**: `DELETE`
- **请求体**:

```json
{
  "id": "1"
}
```

### 用户管理 API

#### 获取所有用户

- **URL**: `/api/v1/admin/users`
- **方法**: `GET`
- **参数**:
  - `role` (可选): 按角色过滤用户，可选值为 `admin`、`staff`、`client`
  - `status` (可选): 按状态过滤用户，可选值为 `active`、`inactive`
  - `page` (可选): 页码，默认为 1
  - `limit` (可选): 每页数量，默认为 10

#### 创建用户

- **URL**: `/api/v1/admin/users`
- **方法**: `POST`
- **请求体**:

```json
{
  "name": "新用户",
  "email": "newuser@example.com",
  "phone": "13800138000",
  "role": "staff",
  "password": "password123"
}
```

#### 更新用户

- **URL**: `/api/v1/admin/users`
- **方法**: `PUT`
- **请求体**:

```json
{
  "id": "1",
  "name": "更新的用户",
  "email": "updateduser@example.com",
  "phone": "13900139000",
  "role": "admin",
  "status": "active"
}
```

#### 删除用户

- **URL**: `/api/v1/admin/users`
- **方法**: `DELETE`
- **请求体**:

```json
{
  "id": "1"
}
```

#### 重置用户密码

- **URL**: `/api/v1/admin/users/resetPassword`
- **方法**: `POST`
- **请求体**:

```json
{
  "id": "1",
  "newPassword": "newpassword123"
}
```

### 统计数据 API

#### 获取仪表盘概览统计数据

- **URL**: `/api/v1/admin/stats`
- **方法**: `GET`
- **参数**:
  - `period` (可选): 时间段，可选值为 `day`、`week`、`month`、`year`，默认为 `week`

#### 获取预约趋势数据

- **URL**: `/api/v1/admin/stats/bookingTrends`
- **方法**: `GET`
- **参数**:
  - `period` (可选): 时间段，可选值为 `week`、`month`、`year`，默认为 `week`

#### 获取收入趋势数据

- **URL**: `/api/v1/admin/stats/revenueTrends`
- **方法**: `GET`
- **参数**:
  - `period` (可选): 时间段，可选值为 `week`、`month`、`year`，默认为 `month`

#### 获取服务分布数据

- **URL**: `/api/v1/admin/stats/serviceDistribution`
- **方法**: `GET`
- **参数**:
  - `period` (可选): 时间段，可选值为 `week`、`month`、`year`，默认为 `month`

### 系统设置 API

#### 获取所有系统设置

- **URL**: `/api/v1/admin/settings`
- **方法**: `GET`
- **参数**:
  - `category` (可选): 按类别过滤设置，可选值为 `general`、`localization`、`payment`、`booking`、`notification`

#### 更新系统设置

- **URL**: `/api/v1/admin/settings`
- **方法**: `PUT`
- **请求体**:

```json
{
  "settings": [
    {
      "key": "business_name",
      "value": "新的业务名称"
    },
    {
      "key": "business_address",
      "value": "新的业务地址"
    }
  ]
}
```

#### 重置系统设置

- **URL**: `/api/v1/admin/settings`
- **方法**: `POST`
- **请求体**:

```json
{
  "category": "general"
}
```

## 错误处理

API 可能返回以下错误代码：

- `VALIDATION_ERROR`: 请求参数验证失败
- `NOT_FOUND`: 请求的资源不存在
- `UNAUTHORIZED`: 未授权访问
- `FORBIDDEN`: 无权限访问
- `SERVER_ERROR`: 服务器内部错误

## 认证与授权

### 客户端认证

客户端 API 需要在 Cookie 中包含 `client_token`。

### 管理员认证

管理员 API 需要在 Cookie 中包含 `admin_session`。

### 注意事项

- 所有认证令牌都有过期时间，过期后需要重新登录获取新的令牌。
- 请确保在 HTTPS 环境下使用 API，以保证数据传输安全。
- 对于敏感操作，建议实施额外的安全措施，如二次验证。 