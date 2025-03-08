const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const rootDir = path.join(__dirname, '..');
// 图片目录
const imagesDir = path.join(rootDir, 'public/images');
// 备份目录
const backupDir = path.join(rootDir, 'public/images_backup');
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
    // 使用grep命令查找所有图片引用，包括在数组中定义的引用
    const grepCommand = `grep -r "/images/" --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" ${srcDir}`;
    const grepResult = execSync(grepCommand, { encoding: 'utf8' });
    
    // 提取图片路径 - 匹配src="/images/xxx"格式
    const srcRegex = /src="\/images\/([^"]+)"/g;
    const references = [];
    let match;
    
    while ((match = srcRegex.exec(grepResult)) !== null) {
      references.push(match[1].toLowerCase()); // 转为小写以便比较
    }
    
    // 提取图片路径 - 匹配'/images/xxx'或"/images/xxx"格式（用于数组中的定义）
    const arrayRegex = /['"]\/images\/([^'"]+)['"]/g;
    while ((match = arrayRegex.exec(grepResult)) !== null) {
      // 避免重复添加已经匹配到的src属性中的图片
      if (!references.includes(match[1].toLowerCase())) {
        references.push(match[1].toLowerCase()); // 转为小写以便比较
      }
    }
    
    // 提取图片路径 - 匹配image: '/images/xxx'或image: "/images/xxx"格式（用于对象属性）
    const propRegex = /image:\s*['"]\/images\/([^'"]+)['"]/g;
    while ((match = propRegex.exec(grepResult)) !== null) {
      // 避免重复添加已经匹配到的图片
      if (!references.includes(match[1].toLowerCase())) {
        references.push(match[1].toLowerCase()); // 转为小写以便比较
      }
    }
    
    return references;
  } catch (error) {
    console.error(`Error extracting image references: ${error.message}`);
    return [];
  }
};

// 主函数
const main = () => {
  console.log('Checking for unused images...');
  
  // 获取所有图片文件
  const imageFiles = getImageFiles();
  console.log(`Found ${imageFiles.length} image files in public/images directory`);
  
  // 提取图片引用
  const imageReferences = extractImageReferences();
  console.log(`Found ${imageReferences.length} image references in source code`);
  
  // 检查未使用的图片
  const unusedImages = imageFiles.filter(file => !imageReferences.includes(file));
  
  if (unusedImages.length > 0) {
    console.log(`\nFound ${unusedImages.length} unused images:`);
    unusedImages.forEach(img => console.log(`- ${img}`));
    
    // 创建备份目录
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`\nCreated backup directory: ${backupDir}`);
    }
    
    // 移动未使用的图片到备份目录
    console.log('\nMoving unused images to backup directory...');
    let movedCount = 0;
    
    unusedImages.forEach(img => {
      const srcPath = path.join(imagesDir, img);
      const destPath = path.join(backupDir, img);
      
      try {
        fs.copyFileSync(srcPath, destPath);
        fs.unlinkSync(srcPath);
        console.log(`Moved ${img} to backup directory`);
        movedCount++;
      } catch (error) {
        console.error(`Error moving ${img}: ${error.message}`);
      }
    });
    
    console.log(`\nSuccessfully moved ${movedCount} unused images to backup directory.`);
    console.log(`You can find them in: ${backupDir}`);
    console.log('\nIf you need these images in the future, you can restore them from the backup directory.');
  } else {
    console.log('\nAll images are referenced in the code!');
  }
};

// 执行主函数
main(); 