import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// 创建Prisma客户端
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// 占位图片路径
const PLACEHOLDER_IMAGE = '/images/placeholder-therapist.jpg';
// 上传目录路径
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'therapists');

/**
 * 检查图片文件是否存在
 * @param imagePath 图片路径
 * @returns 文件是否存在
 */
function checkImageExists(imagePath: string): boolean {
  // 如果路径为空或是占位图片，则返回true
  if (!imagePath || imagePath === PLACEHOLDER_IMAGE) {
    return true;
  }

  // 清理路径 - 确保以 / 开头
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // 完整的文件路径
  const fullPath = path.join(process.cwd(), 'public', cleanPath);

  console.log(`检查图片文件: ${fullPath}`);
  const exists = fs.existsSync(fullPath);
  console.log(`文件${exists ? '存在' : '不存在'}: ${fullPath}`);
  return exists;
}

/**
 * 修复按摩师图片路径
 */
async function fixTherapistImages() {
  console.log('开始修复按摩师图片路径...');
  console.log('工作目录:', process.cwd());
  console.log('上传目录:', UPLOADS_DIR);

  try {
    // 检查上传目录是否存在
    if (!fs.existsSync(UPLOADS_DIR)) {
      console.log(`上传目录 ${UPLOADS_DIR} 不存在，创建目录`);
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // 获取所有按摩师
    const therapists = await prisma.therapist.findMany();
    console.log(`找到 ${therapists.length} 个按摩师:`);
    
    therapists.forEach(t => {
      console.log(`- ID: ${t.id}, 图片: ${t.imageUrl}`);
    });

    // 检查上传目录中的所有文件
    const availableImages = fs.existsSync(UPLOADS_DIR) 
      ? fs.readdirSync(UPLOADS_DIR)
      : [];
    console.log(`上传目录中有 ${availableImages.length} 个文件:`);
    availableImages.forEach(file => {
      console.log(`- ${file}`);
    });

    // 统计需要修复的数量
    let fixCount = 0;

    // 遍历所有按摩师
    for (const therapist of therapists) {
      const imagePath = therapist.imageUrl;
      console.log(`\n检查按摩师 ${therapist.id} 的图片: ${imagePath}`);
      
      // 检查图片是否存在
      const imageExists = checkImageExists(imagePath);
      
      if (!imageExists) {
        console.log(`按摩师 ${therapist.id} 的图片 ${imagePath} 不存在，修复为占位图片`);
        
        try {
          // 更新为占位图片
          const updated = await prisma.therapist.update({
            where: { id: therapist.id },
            data: { imageUrl: PLACEHOLDER_IMAGE }
          });
          console.log(`已更新按摩师 ${therapist.id} 的图片路径为 ${PLACEHOLDER_IMAGE}`);
          fixCount++;
        } catch (updateError) {
          console.error(`更新按摩师 ${therapist.id} 失败:`, updateError);
        }
      } else {
        console.log(`按摩师 ${therapist.id} 的图片 ${imagePath} 正常`);
      }
    }

    console.log(`\n修复完成，共修复 ${fixCount} 个按摩师的图片路径`);
  } catch (error) {
    console.error('修复过程出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行修复
fixTherapistImages().then(() => {
  console.log('脚本执行完毕');
}).catch(err => {
  console.error('脚本执行失败:', err);
  process.exit(1);
}); 