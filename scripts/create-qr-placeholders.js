const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 创建images目录
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 需要创建的二维码图片
const qrCodes = [
  {
    filename: 'wechat-qr.png',
    description: 'WeChat QR Code'
  },
  {
    filename: 'line-qr-2.png',
    description: 'Line QR Code 2'
  }
];

// 创建二维码占位图片
const createQRPlaceholder = (filename, description) => {
  const filePath = path.join(imagesDir, filename);
  
  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    console.log(`${description} 已存在，跳过创建`);
    return;
  }
  
  console.log(`正在创建 ${description}...`);
  
  try {
    // 使用ImageMagick创建一个简单的二维码占位图
    execSync(`convert -size 200x200 xc:white -fill black -draw "rectangle 10,10 190,190" -draw "rectangle 40,40 160,160" -draw "rectangle 70,70 130,130" ${filePath}`);
    console.log(`${description} 创建完成`);
  } catch (error) {
    console.error(`创建失败: ${error.message}`);
    
    // 如果ImageMagick不可用，复制一个已有的二维码图片
    try {
      // 检查是否有可用的二维码图片
      const existingQRs = ['line-qr-1.png', 'tg-qr.jpg', 'wechat-qr.jpg', 'whatsapp-qr.png'];
      let sourceFile = null;
      
      for (const qr of existingQRs) {
        const qrPath = path.join(imagesDir, qr);
        if (fs.existsSync(qrPath)) {
          sourceFile = qrPath;
          break;
        }
      }
      
      if (sourceFile) {
        fs.copyFileSync(sourceFile, filePath);
        console.log(`已复制 ${path.basename(sourceFile)} 到 ${filename}`);
      } else {
        // 如果没有可用的二维码图片，创建一个1x1像素的PNG文件
        const buffer = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
          0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
          0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
          0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
          0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        fs.writeFileSync(filePath, buffer);
        console.log(`已创建1x1像素占位图片: ${filename}`);
      }
    } catch (copyError) {
      console.error(`复制失败: ${copyError.message}`);
    }
  }
};

// 创建所有二维码占位图片
qrCodes.forEach(qr => {
  createQRPlaceholder(qr.filename, qr.description);
});

console.log('所有二维码占位图片创建完成！'); 