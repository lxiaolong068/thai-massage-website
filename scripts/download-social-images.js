const fs = require('fs');
const path = require('path');
const https = require('https');

// 确保图片目录存在
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 社交媒体图标
const socialIcons = [
  {
    name: 'line-icon.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
  },
  {
    name: 'whatsapp-icon.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  },
  {
    name: 'instagram-icon.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
  },
  {
    name: 'facebook-icon.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
  },
  {
    name: 'wechat-icon.png',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/WeChat.svg',
  },
];

// 下载图片
function downloadImage(url, filename) {
  const filePath = path.join(imagesDir, filename);
  
  // 如果文件已存在，跳过下载
  if (fs.existsSync(filePath)) {
    console.log(`${filename} already exists, skipping...`);
    return;
  }
  
  console.log(`Downloading ${filename}...`);
  
  const file = fs.createWriteStream(filePath);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {}); // 删除不完整的文件
    console.error(`Error downloading ${filename}: ${err.message}`);
  });
}

// 下载所有图标
socialIcons.forEach((icon) => {
  downloadImage(icon.url, icon.name);
});

// 创建占位QR码图片
const qrCodes = [
  'line-qr-1.png',
  'line-qr-2.png',
  'wechat-qr.png',
  'whatsapp-qr.png'
];

// 为QR码创建占位图片
qrCodes.forEach((qrName) => {
  const qrPath = path.join(imagesDir, qrName);
  if (!fs.existsSync(qrPath)) {
    console.log(`Creating placeholder for ${qrName}...`);
    // 这里我们只是创建一个空白文件，实际项目中应该替换为真实的QR码图片
    fs.writeFileSync(qrPath, '');
  }
}); 