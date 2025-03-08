const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const rootDir = path.join(__dirname, '..');
// 源代码目录
const srcDir = path.join(rootDir, 'src');
// 组件目录
const componentsDir = path.join(srcDir, 'components');

// 检查未使用的导入
const checkUnusedImports = () => {
  console.log('\n检查未使用的导入...');
  try {
    // 使用ESLint检查未使用的导入
    const eslintCommand = `npx eslint "${srcDir}/**/*.{ts,tsx}" --rule "no-unused-vars: error" --quiet`;
    execSync(eslintCommand, { stdio: 'inherit' });
    console.log('未使用的导入检查完成。');
  } catch (error) {
    console.error('检查未使用的导入时出错，这可能表示存在未使用的导入。');
  }
};

// 检查重复的代码
const checkDuplicateCode = () => {
  console.log('\n检查重复的代码...');
  
  // 获取所有组件文件
  const componentFiles = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
  
  // 提取每个组件中的样式类
  const styleClasses = {};
  let duplicateFound = false;
  
  componentFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 提取className属性中的类名
    const classRegex = /className="([^"]+)"/g;
    let match;
    const classes = [];
    
    while ((match = classRegex.exec(content)) !== null) {
      const classNames = match[1].split(' ').filter(c => c.trim() !== '');
      classes.push(...classNames);
    }
    
    // 记录每个文件中的类名
    styleClasses[file] = classes;
  });
  
  // 检查重复的样式类组合
  const combinations = {};
  
  Object.entries(styleClasses).forEach(([file, classes]) => {
    // 查找连续出现的3个或更多类名的组合
    for (let i = 0; i < classes.length - 2; i++) {
      const combination = `${classes[i]} ${classes[i+1]} ${classes[i+2]}`;
      
      if (!combinations[combination]) {
        combinations[combination] = [];
      }
      
      if (!combinations[combination].includes(file)) {
        combinations[combination].push(file);
      }
    }
  });
  
  // 输出重复的样式类组合
  Object.entries(combinations).forEach(([combination, files]) => {
    if (files.length > 1) {
      console.log(`\n发现重复的样式类组合: "${combination}"`);
      console.log('出现在以下文件中:');
      files.forEach(file => console.log(`- ${file}`));
      duplicateFound = true;
    }
  });
  
  if (!duplicateFound) {
    console.log('未发现重复的样式类组合。');
  } else {
    console.log('\n建议: 考虑将重复的样式类组合提取为Tailwind CSS组件或自定义类。');
  }
};

// 检查大型组件
const checkLargeComponents = () => {
  console.log('\n检查大型组件...');
  
  // 获取所有组件文件
  const componentFiles = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
  
  // 检查每个组件的大小
  const largeComponents = [];
  
  componentFiles.forEach(file => {
    const filePath = path.join(componentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    
    if (lines > 100) {
      largeComponents.push({ file, lines });
    }
  });
  
  // 按行数排序
  largeComponents.sort((a, b) => b.lines - a.lines);
  
  if (largeComponents.length > 0) {
    console.log('发现以下大型组件:');
    largeComponents.forEach(({ file, lines }) => {
      console.log(`- ${file}: ${lines} 行`);
    });
    
    console.log('\n建议: 考虑将大型组件拆分为更小的子组件，以提高可维护性。');
  } else {
    console.log('未发现大型组件。');
  }
};

// 检查未使用的组件
const checkUnusedComponents = () => {
  console.log('\n检查未使用的组件...');
  
  // 获取所有组件文件
  const componentFiles = fs.readdirSync(componentsDir)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
    .map(file => path.basename(file, path.extname(file)));
  
  // 在源代码中搜索每个组件的引用
  const unusedComponents = [];
  
  componentFiles.forEach(component => {
    try {
      // 使用grep命令搜索组件引用
      const grepCommand = `grep -r "from ['\\\"].*/${component}['\\\"]" --include="*.tsx" --include="*.ts" ${srcDir} | grep -v "${component}.tsx"`;
      execSync(grepCommand, { stdio: 'pipe' });
    } catch (error) {
      // 如果grep命令没有找到匹配项，则认为组件未被使用
      unusedComponents.push(component);
    }
  });
  
  if (unusedComponents.length > 0) {
    console.log('发现以下未使用的组件:');
    unusedComponents.forEach(component => {
      console.log(`- ${component}`);
    });
    
    console.log('\n建议: 考虑删除未使用的组件，或者在项目中使用它们。');
  } else {
    console.log('未发现未使用的组件。');
  }
};

// 主函数
const main = () => {
  console.log('开始代码优化检查...');
  
  // 检查未使用的导入
  checkUnusedImports();
  
  // 检查重复的代码
  checkDuplicateCode();
  
  // 检查大型组件
  checkLargeComponents();
  
  // 检查未使用的组件
  checkUnusedComponents();
  
  console.log('\n代码优化检查完成。');
};

// 执行主函数
main(); 