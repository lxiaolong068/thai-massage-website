import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * 上传图片到本地存储
 * @param file 图片文件
 * @param folder 存储文件夹
 * @returns 图片URL
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成唯一文件名
    const fileName = `${uuidv4()}-${file.name}`;
    const relativePath = `/uploads/${folder}/${fileName}`;
    const fullPath = join(process.cwd(), 'public', relativePath);

    // 确保目录存在
    await createDirectoryIfNotExists(join(process.cwd(), 'public', 'uploads', folder));

    // 写入文件
    await writeFile(fullPath, buffer);

    // 返回相对路径作为URL
    return relativePath;
  } catch (error) {
    console.error('上传图片出错:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * 确保目录存在，如果不存在则创建
 * @param directory 目录路径
 */
async function createDirectoryIfNotExists(directory: string) {
  const { mkdir } = require('fs/promises');
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
} 