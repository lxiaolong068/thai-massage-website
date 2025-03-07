const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const rootDir = path.join(__dirname, '..');
// 图片目录
const imagesDir = path.join(rootDir, 'public/images');
// 源代码目录
const srcDir = path.join(rootDir, 'src');

// 获取所有图片文件
const getImageFiles = () => {
  try {
    return fs.readdirSync(imagesDir)
      .filter(file => !file.startsWith('.')) // 排除隐藏文件
      .map(file => file.toLowerCase()); // 转为小写以便比较
  } catch (error) {
    console.error(`Error reading images directory: ${error.message}`);
    return [];
  }
};

// 从源代码中提取图片引用
const extractImageReferences = () => {
  try {
    // 使用grep命令查找所有图片引用
    const grepCommand = `grep -r "src=\\"/images/" --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" ${srcDir}`;
    const grepResult = execSync(grepCommand, { encoding: 'utf8' });
    
    // 提取图片路径
    const imageRegex = /src="\/images\/([^"]+)"/g;
    const references = [];
    let match;
    
    while ((match = imageRegex.exec(grepResult)) !== null) {
      references.push(match[1].toLowerCase()); // 转为小写以便比较
    }
    
    return references;
  } catch (error) {
    console.error(`Error extracting image references: ${error.message}`);
    return [];
  }
};

// 主函数
const main = () => {
  console.log('Checking image references...');
  
  // 获取所有图片文件
  const imageFiles = getImageFiles();
  console.log(`Found ${imageFiles.length} image files in public/images directory`);
  
  // 提取图片引用
  const imageReferences = extractImageReferences();
  console.log(`Found ${imageReferences.length} image references in source code`);
  
  // 检查引用的图片是否存在
  const missingImages = imageReferences.filter(ref => !imageFiles.includes(ref));
  
  if (missingImages.length > 0) {
    console.log('\nMissing images:');
    missingImages.forEach(img => console.log(`- ${img}`));
    
    // 创建缺失的图片
    console.log('\nCreating placeholder images for missing references...');
    missingImages.forEach(img => {
      const imgPath = path.join(imagesDir, img);
      console.log(`Creating ${img}...`);
      
      try {
        // 创建一个1x1像素的PNG文件
        const buffer = Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
          0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
          0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
          0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
          0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        fs.writeFileSync(imgPath, buffer);
        console.log(`Created placeholder for ${img}`);
      } catch (error) {
        console.error(`Error creating placeholder for ${img}: ${error.message}`);
      }
    });
  } else {
    console.log('\nAll image references are valid!');
  }
  
  // 检查未使用的图片
  const unusedImages = imageFiles.filter(file => !imageReferences.includes(file));
  
  if (unusedImages.length > 0) {
    console.log('\nUnused images:');
    unusedImages.forEach(img => console.log(`- ${img}`));
  } else {
    console.log('\nAll images are referenced in the code!');
  }
};

// 执行主函数
main(); 