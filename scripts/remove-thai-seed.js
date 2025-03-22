// 移除种子文件中的泰语翻译数据
const fs = require('fs');
const path = require('path');

const seedFilePath = path.join(process.cwd(), 'prisma/seed/index.ts');
let content = fs.readFileSync(seedFilePath, 'utf8');

// 统计原始泰语翻译条目数量
const thMatches = content.match(/locale:\s*['"]th['"]/g) || [];
console.log(`种子文件中找到 ${thMatches.length} 条泰语翻译`);

// 使用行处理的方式移除泰语翻译对象
const lines = content.split('\n');
const result = [];
let inThBlock = false;
let skipBraces = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // 如果发现泰语标记行，开始跳过
  if (line.includes("locale: 'th'") || line.includes('locale: "th"')) {
    inThBlock = true;
    skipBraces = 0;
    continue;
  }

  // 如果在泰语块中，检查花括号
  if (inThBlock) {
    // 计算当前行的花括号
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    skipBraces += openBraces - closeBraces;

    // 如果找到泰语块的结束（右花括号），结束跳过
    if (skipBraces <= 0 && line.trim().startsWith('}')) {
      inThBlock = false;
      // 如果这一行只有一个右花括号加上逗号，处理逗号
      if (line.trim() === '},') {
        // 验证前一行是否是一个对象结束，如果是，需要保留逗号
        if (result.length > 0 && result[result.length - 1].trim().endsWith('},')) {
          // 前面对象结束有逗号，所以这里不保留
        } else {
          // 加入只有逗号的行，确保数组语法正确
          result.push('          },'); 
        }
      }
      continue;
    }
    
    // 跳过泰语块中的所有行
    continue;
  }

  // 不在泰语块中的行保留
  result.push(line);
}

// 将结果写回文件
const newContent = result.join('\n');
fs.writeFileSync(seedFilePath, newContent);

// 确认移除
const newThMatches = newContent.match(/locale:\s*['"]th['"]/g) || [];
console.log(`处理后的种子文件中还有 ${newThMatches.length} 条泰语翻译`);

if (newThMatches.length > 0) {
  console.log('请检查以下行:');
  const lines = newContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("locale: 'th'") || lines[i].includes('locale: "th"')) {
      console.log(`行 ${i + 1}: ${lines[i].trim()}`);
    }
  }
}

console.log('已完成泰语数据处理'); 