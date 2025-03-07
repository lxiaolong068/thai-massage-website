const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// 创建images目录
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 社交媒体图标URL列表
const icons = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg',
    filename: 'line-icon.png',
    description: 'Line Icon'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    filename: 'whatsapp-icon.png',
    description: 'WhatsApp Icon'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    filename: 'instagram-icon.png',
    description: 'Instagram Icon'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
    filename: 'facebook-icon.png',
    description: 'Facebook Icon'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/WeChat.svg',
    filename: 'wechat-icon.png',
    description: 'WeChat Icon'
  }
];

// 下载图片函数
const downloadImage = (url, filename, description) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    
    // 检查文件是否已存在
    if (fs.existsSync(filePath)) {
      console.log(`${description} 已存在，跳过下载`);
      resolve();
      return;
    }
    
    console.log(`正在下载 ${description}...`);
    
    // 对于SVG文件，我们需要将其转换为PNG
    if (url.endsWith('.svg')) {
      // 使用临时文件
      const tempFile = path.join(imagesDir, `temp_${filename}.svg`);
      
      const file = fs.createWriteStream(tempFile);
      https.get(url, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          
          try {
            // 使用ImageMagick将SVG转换为PNG
            // 注意：这需要安装ImageMagick
            console.log(`正在将SVG转换为PNG: ${filename}`);
            execSync(`convert -background none -size 200x200 ${tempFile} ${filePath}`);
            
            // 删除临时文件
            fs.unlinkSync(tempFile);
            
            console.log(`${description} 下载并转换完成`);
            resolve();
          } catch (error) {
            console.error(`转换失败: ${error.message}`);
            reject(error);
          }
        });
      }).on('error', (error) => {
        fs.unlinkSync(tempFile);
        console.error(`下载失败: ${error.message}`);
        reject(error);
      });
    } else {
      // 直接下载PNG/JPG文件
      const file = fs.createWriteStream(filePath);
      https.get(url, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`${description} 下载完成`);
          resolve();
        });
      }).on('error', (error) => {
        fs.unlinkSync(filePath);
        console.error(`下载失败: ${error.message}`);
        reject(error);
      });
    }
  });
};

// 顺序下载所有图标
const downloadAll = async () => {
  for (const icon of icons) {
    try {
      await downloadImage(icon.url, icon.filename, icon.description);
    } catch (error) {
      console.error(`下载 ${icon.description} 时出错: ${error.message}`);
      
      // 如果转换失败，创建一个简单的占位图标
      const filePath = path.join(imagesDir, icon.filename);
      console.log(`创建占位图标: ${icon.filename}`);
      
      // 创建一个简单的彩色方块作为占位图标
      const size = 200;
      const colors = ['#00B900', '#25D366', '#E4405F', '#1877F2', '#07C160'];
      const index = icons.findIndex(i => i.filename === icon.filename);
      const color = colors[index % colors.length];
      
      try {
        execSync(`convert -size ${size}x${size} xc:${color} ${filePath}`);
        console.log(`已创建占位图标: ${icon.filename}`);
      } catch (convError) {
        console.error(`创建占位图标失败: ${convError.message}`);
        
        // 如果ImageMagick不可用，创建一个1x1像素的PNG文件
        const buffer = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
          0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
          0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
          0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
          0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        fs.writeFileSync(filePath, buffer);
        console.log(`已创建1x1像素占位图标: ${icon.filename}`);
      }
    }
  }
  
  console.log('所有图标下载完成！');
};

downloadAll(); 