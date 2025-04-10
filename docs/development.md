# 开发文档：集成 Vercel Blob 文件上传

本指南旨在指导开发人员将项目中的文件上传功能从本地文件系统存储迁移到 Vercel Blob 云存储服务。这对于在 Vercel 等 Serverless 平台部署时至关重要，因为这些平台通常具有只读或临时文件系统。

## 目标

- 修改现有的文件上传逻辑，使用 Vercel Blob 进行存储。
- 确保本地开发环境和生产环境都能正确处理文件上传。
- 维护代码的可读性和可维护性。

## 前提条件

1.  **Vercel 账户**: 你需要一个有效的 Vercel 账户。
2.  **Vercel 项目**: 项目已经连接到 Vercel。
3.  **Vercel Blob Store**: 在 Vercel 项目的 Storage 选项卡中创建一个 Blob Store。
4.  **Blob Read/Write Token**: 为你的 Blob Store 创建一个具有读写权限的 API Token。**请务必在创建时复制并安全保存此 Token**。

## 步骤

### 1. 配置环境变量

环境变量是连接到 Vercel Blob 的关键。

-   **本地开发 (`.env` 文件)**:
    -   确保 `.env` 文件已被添加到 `.gitignore` 中，以防意外提交敏感信息。
    -   在 `.env` 文件中添加以下行，并将占位符替换为你获取的 Blob Token:
        ```dotenv
        # .env - DO NOT COMMIT TO GIT!
        # ... other variables ...
        BLOB_READ_WRITE_TOKEN=vercel_blob_rw_YOUR_COPIED_TOKEN
        ```
-   **生产环境 (Vercel Dashboard)**:
    -   登录 Vercel，进入项目设置 (Project Settings)。
    -   导航到 **Environment Variables**。
    -   添加一个名为 `BLOB_READ_WRITE_TOKEN` 的环境变量，其值设置为你生成的 **生产环境** Blob Token（可以与开发 Token 相同，但建议为不同环境创建不同的 Token 以提高安全性）。

### 2. 安装依赖

使用 pnpm 安装 Vercel Blob 的官方 SDK：

```bash
pnpm add @vercel/blob
```

### 3. 重构上传逻辑 (`src/lib/upload.ts`)

修改 `uploadImage` 函数，使其调用 Vercel Blob API 而不是写入本地文件系统。

```typescript
// src/lib/upload.ts
// import { writeFile } from 'fs/promises'; // 不再需要
// import { join } from 'path';             // 不再需要
// import { v4 as uuidv4 } from 'uuid';      // 可选，如果Blob需要唯一路径名
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid'; // 建议保留以生成唯一路径

/**
 * 上传图片到 Vercel Blob
 * @param file 图片文件
 * @param folder 存储路径前缀 (e.g., 'qr-codes', 'therapist-images')
 * @returns 图片在 Vercel Blob 中的访问 URL
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Vercel Blob Token (BLOB_READ_WRITE_TOKEN) is not configured.");
  }

  // 1. 生成唯一的文件路径/名称
  //    保留 UUID 以避免文件名冲突，并加上原始文件名以便识别
  const uniqueFilename = `${uuidv4()}-${file.name}`;
  const blobPath = `${folder}/${uniqueFilename}`; // 例如: 'qr-codes/uuid-abc.jpg'

  try {
    // 2. 上传文件到 Vercel Blob
    const blob = await put(
      blobPath, // 文件在 Blob 中的路径
      file,     // 要上传的文件对象
      {
        access: 'public', // 设置为公开可访问，以便直接用 URL 查看
        token: process.env.BLOB_READ_WRITE_TOKEN // 传递 Token
        // 可以添加其他选项，如缓存控制: cacheControlMaxAge: 60 * 60 * 24 * 365 // 1 year
      }
    );

    // 3. 返回 Blob 的公开访问 URL
    console.log(`File uploaded successfully to Vercel Blob: ${blob.url}`);
    return blob.url;

  } catch (error) {
    console.error('上传图片到 Vercel Blob 出错:', error);
    // 可以根据 error 类型提供更具体的错误信息
    if (error instanceof Error) {
        throw new Error(`Failed to upload image to Vercel Blob: ${error.message}`);
    } else {
        throw new Error('Failed to upload image to Vercel Blob due to an unknown error.');
    }
  }
}

// createDirectoryIfNotExists 函数不再需要，可以删除
/*
async function createDirectoryIfNotExists(directory: string) {
  // ... (删除此函数)
}
*/
```

**关键改动解释:**

-   移除了 `fs/promises`, `path` 的导入和相关本地文件操作。
-   导入了 `@vercel/blob` 的 `put` 函数。
-   在函数开始时检查 `BLOB_READ_WRITE_TOKEN` 是否存在。
-   使用 `uuidv4` 结合原始文件名生成一个唯一的路径 (`blobPath`)，存储在指定的 `folder` 下。
-   调用 `put(pathname, file, options)` 上传文件：
    -   `pathname`: 文件在 Blob 存储中的完整路径。
    -   `file`: 要上传的 `File` 对象。
    -   `options`:
        -   `access: 'public'`: 确保上传的文件可以通过其 URL 公开访问。
        -   `token`: 从环境变量读取的 Blob 读写 Token。
-   成功上传后，`put` 函数返回一个包含 `url` 属性的对象，这个 URL 就是图片在 Blob 中的公开访问地址。
-   返回 `blob.url`。
-   错误处理被更新以反映 Blob 上传失败。
-   不再需要 `createDirectoryIfNotExists` 函数。

### 4. 更新 API 路由 (示例: `src/app/api/v1/admin/contact-methods/upload/route.ts`)

调用 `uploadImage` 的 API 路由**通常不需要修改**，因为 `uploadImage` 函数的签名（参数和返回值类型）保持不变。它现在只是内部实现不同了，返回的仍然是一个字符串类型的 URL。

只需确保该 API 路由能正确处理 `uploadImage` 可能抛出的新错误类型即可（虽然基本的 `Error` 类型处理应该兼容）。

```typescript
// src/app/api/v1/admin/contact-methods/upload/route.ts
import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError } from '@/utils/api/response'; // 修正路径推测
import { withAdminApi } from '@/middleware'; // 修正路径推测
import prisma from '@/lib/prisma';
import { uploadImage } from '@/lib/upload'; // 从修改后的文件导入

async function uploadQRCode(request: NextRequest) {
  try {
    const formData = await request.formData();
    const qrCode = formData.get('qrCode') as File;
    const type = formData.get('type') as string;

    if (!qrCode || !type) {
      return apiValidationError('QR code and type are required');
    }

    // 调用已修改的 uploadImage 函数，它现在会上传到 Vercel Blob
    const qrCodeUrl = await uploadImage(qrCode, 'qr-codes'); // 返回的是 Blob URL

    // 将 Blob URL 存储到数据库
    const contactMethod = await prisma.contactMethod.upsert({
      where: { type },
      update: { qrCode: qrCodeUrl }, // 存储 Blob URL
      create: {
        type,
        qrCode: qrCodeUrl, // 存储 Blob URL
        isActive: true,
      },
    });

    return apiSuccess(contactMethod);
  } catch (error) {
    console.error('上传二维码处理出错:', error); // 错误来源可能是 uploadImage 或 prisma
    // 根据错误类型可以提供更具体的响应
    if (error instanceof Error && error.message.includes('Vercel Blob')) {
         return apiServerError(`Failed to upload QR code to storage: ${error.message}`);
    }
    return apiServerError('Failed to process QR code upload'); // 通用错误
  }
}

export const POST = withAdminApi(uploadQRCode);
```

### 5. 测试

-   **本地开发环境**:
    -   确保 `.env` 文件中有正确的 `BLOB_READ_WRITE_TOKEN`。
    -   启动开发服务器 (`pnpm dev`)。
    -   在应用中执行文件上传操作。
    -   检查 Vercel Blob Dashboard，确认文件是否已成功上传到对应的路径下。
    -   检查应用中显示图片的地方是否能正确加载来自 Vercel Blob 的 URL。
    -   检查数据库中存储的是否是 Vercel Blob 返回的 URL。
-   **生产环境 (Vercel 部署后)**:
    -   确保在 Vercel 项目设置中配置了正确的 `BLOB_READ_WRITE_TOKEN` 环境变量。
    -   部署项目。
    -   在生产环境中测试文件上传功能。
    -   验证文件是否上传到 Blob，并且应用能正确显示。

## 安全注意事项

-   **Token 安全**: `BLOB_READ_WRITE_TOKEN` 是敏感凭证，**绝对不能**硬编码在代码中或提交到版本控制系统。务必使用环境变量，并确保包含 Token 的 `.env` 文件被 `.gitignore` 忽略。
-   **环境隔离**: 建议为开发环境和生产环境使用不同的 Blob Token，以降低风险。
-   **权限管理**: 创建 Token 时，遵循最小权限原则。如果某个场景只需要读取，则创建只读 Token。

---

按照以上步骤操作，即可将项目的文件上传功能成功迁移到 Vercel Blob。
