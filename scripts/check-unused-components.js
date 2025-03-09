const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 获取所有组件文件
const componentsDir = path.join(__dirname, '../src/components');
const componentFiles = glob.sync(`${componentsDir}/**/*.{jsx,tsx}`);

// 获取所有可能引用组件的文件
const srcDir = path.join(__dirname, '../src');
const referenceFiles = glob.sync(`${srcDir}/**/*.{js,jsx,ts,tsx}`).filter(file => !file.includes('node_modules'));

// 检查每个组件是否被引用
const unusedComponents = [];

componentFiles.forEach(componentPath => {
  const componentName = path.basename(componentPath, path.extname(componentPath));
  const relativePath = path.relative(path.join(__dirname, '..'), componentPath).replace(/\\/g, '/');
  
  let isUsed = false;
  
  for (const referenceFile of referenceFiles) {
    // 跳过组件自身
    if (referenceFile === componentPath) continue;
    
    const code = fs.readFileSync(referenceFile, 'utf8');
    // 检查是否有导入该组件的语句
    if (code.includes(`import ${componentName}`) || 
        code.includes(`import { ${componentName}`) || 
        code.includes(`from '${relativePath}'`) || 
        code.includes(`from "${relativePath}"`) ||
        code.includes(`<${componentName}`) ||
        code.includes(`<${componentName.toLowerCase()}`)) {
      isUsed = true;
      break;
    }
  }
  
  if (!isUsed) {
    unusedComponents.push({ name: componentName, path: relativePath });
  }
});

console.log('未使用的组件:');
unusedComponents.forEach(component => console.log(`${component.name} (${component.path})`));
console.log(`共发现 ${unusedComponents.length} 个未使用的组件`);

// 创建备份目录
if (unusedComponents.length > 0) {
  const backupDir = path.join(__dirname, '../src/components_backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // 移动未使用的组件到备份目录
  unusedComponents.forEach(component => {
    const sourcePath = path.join(__dirname, '..', component.path);
    const targetPath = path.join(backupDir, path.basename(sourcePath));
    fs.renameSync(sourcePath, targetPath);
    console.log(`已将 ${component.name} 移动到备份目录`);
  });
} 