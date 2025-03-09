const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 获取所有 CSS 文件
const cssFiles = glob.sync(path.join(__dirname, '../src/**/*.css'));

// 解析 CSS 文件中的类名
function extractClassNames(cssContent) {
  const classRegex = /\.([\w-]+)\s*{/g;
  const classes = [];
  let match;
  
  while ((match = classRegex.exec(cssContent)) !== null) {
    classes.push(match[1]);
  }
  
  return classes;
}

// 检查重复的类名
const allClasses = {};
const duplicateClasses = {};

cssFiles.forEach(cssFile => {
  const content = fs.readFileSync(cssFile, 'utf8');
  const classes = extractClassNames(content);
  
  classes.forEach(className => {
    if (allClasses[className]) {
      if (!duplicateClasses[className]) {
        duplicateClasses[className] = [allClasses[className]];
      }
      duplicateClasses[className].push(cssFile);
    } else {
      allClasses[className] = cssFile;
    }
  });
});

console.log('重复的 CSS 类名:');
Object.keys(duplicateClasses).forEach(className => {
  console.log(`类名 "${className}" 在以下文件中重复定义:`);
  duplicateClasses[className].forEach(file => {
    console.log(`  - ${path.relative(path.join(__dirname, '..'), file)}`);
  });
});
console.log(`共发现 ${Object.keys(duplicateClasses).length} 个重复的类名`); 