import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

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