const fs = require('fs');
const path = require('path');

// 创建images目录
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 需要创建的图片文件
const missingImages = [
  'line-icon.png',
  'whatsapp-icon.png',
  'instagram-icon.png',
  'facebook-icon.png',
  'wechat-icon.png',
  'wechat-qr.png',
  'line-qr-2.png'
];

// 创建1x1像素的PNG文件
const createEmptyPNG = (filename) => {
  const filePath = path.join(imagesDir, filename);
  
  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    console.log(`${filename} 已存在，跳过创建`);
    return;
  }
  
  console.log(`正在创建 ${filename}...`);
  
  // 创建一个1x1像素的PNG文件
  const buffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  try {
    fs.writeFileSync(filePath, buffer);
    console.log(`已创建 ${filename}`);
  } catch (error) {
    console.error(`创建 ${filename} 失败: ${error.message}`);
  }
};

// 创建所有缺失的图片文件
missingImages.forEach(filename => {
  createEmptyPNG(filename);
});

console.log('所有缺失的图片文件创建完成！'); 