// 修复按摩师图片路径的简单脚本
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// 占位图片路径
const PLACEHOLDER_IMAGE = '/images/placeholder-therapist.jpg';
// 上传目录路径
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'therapists');

// 初始化Prisma客户端
const prisma = new PrismaClient();

async function fixTherapistImages() {
  console.log('开始修复按摩师图片路径...');
  console.log('当前目录:', process.cwd());
  console.log('检查目录:', path.join(process.cwd(), 'public'));

  try {
    // 1. 查询所有按摩师
    const therapists = await prisma.therapist.findMany();
    console.log(`找到 ${therapists.length} 个按摩师`);

    if (therapists.length === 0) {
      console.log('没有找到按摩师数据');
      return;
    }

    // 2. 获取uploads目录中的文件列表
    let existingFiles = [];
    try {
      if (fs.existsSync(UPLOADS_DIR)) {
        existingFiles = fs.readdirSync(UPLOADS_DIR);
        console.log(`上传目录存在，包含 ${existingFiles.length} 个文件`);
      } else {
        console.log(`上传目录不存在: ${UPLOADS_DIR}`);
      }
    } catch (err) {
      console.error('读取上传目录出错:', err);
    }

    // 3. 检查每个按摩师的图片是否存在
    let fixCount = 0;
    for (const therapist of therapists) {
      console.log(`\n检查按摩师 ID: ${therapist.id}`);
      console.log(`当前图片路径: ${therapist.imageUrl}`);

      // 如果是占位图片，跳过
      if (therapist.imageUrl === PLACEHOLDER_IMAGE) {
        console.log('使用的是占位图片，无需修复');
        continue;
      }

      // 获取文件名
      const fileName = path.basename(therapist.imageUrl);
      // 检查文件是否存在
      const filePath = path.join(process.cwd(), 'public', therapist.imageUrl);
      const fileExists = fs.existsSync(filePath);

      if (!fileExists) {
        console.log(`文件不存在: ${filePath}`);
        // 更新为占位图片
        try {
          await prisma.therapist.update({
            where: { id: therapist.id },
            data: { imageUrl: PLACEHOLDER_IMAGE }
          });
          console.log(`已将按摩师 ${therapist.id} 的图片路径更新为占位图片`);
          fixCount++;
        } catch (updateErr) {
          console.error('更新失败:', updateErr);
        }
      } else {
        console.log(`文件存在: ${filePath}`);
      }
    }

    console.log(`\n修复完成，共修复 ${fixCount} 个按摩师的图片路径`);
  } catch (error) {
    console.error('执行过程中出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行修复脚本
fixTherapistImages()
  .then(() => console.log('脚本执行完毕'))
  .catch(err => {
    console.error('脚本执行失败:', err);
    process.exit(1);
  }); 