const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 定义要扫描的目录
const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const PAGES_DIR = path.join(__dirname, '../src/app');
const OUTPUT_FILE = path.join(__dirname, '../src/i18n/messages/extracted.json');

// 正则表达式，用于匹配可能需要翻译的文本
const TEXT_REGEX = /"([^"]+)"|'([^']+)'/g;
const JSX_TEXT_REGEX = />([^<]+)</g;

// 忽略的文本
const IGNORED_TEXTS = [
  'use client',
  'container',
  'relative',
  'absolute',
  'flex',
  'items-center',
  'justify-between',
  'space-x-4',
  'hidden',
  'md:block',
  'hover:text-primary',
  'transition-colors',
  'text-primary',
  'md:hidden',
  'bg-dark',
  'bg-opacity-95',
  'py-4',
  'flex-col',
  'space-y-4',
  'antialiased',
  'section-container',
  'section-cream',
  'title-lg',
  'text-3xl',
  'md:text-4xl',
  'text-center',
  'text-black',
  'w-24',
  'h-1',
  'bg-primary',
  'mx-auto',
  'mb-8',
  'italic',
  'text-lg',
  'md:text-xl',
  'mb-12',
  'max-w-3xl',
  'flex-col',
  'md:flex-row',
  'gap-8',
  'md:gap-16',
  'md:w-1/2',
  'order-2',
  'md:order-1',
  'bg-cream',
  'border-l-4',
  'border-primary',
  'pl-6',
  'py-2',
  'mb-6',
  'title-md',
  'md:text-2xl',
  'card',
  'p-8',
  'leading-relaxed',
  'order-1',
  'md:order-2',
  'mb-8',
  'md:mb-0',
  'rounded-lg',
  'overflow-hidden',
  'shadow-xl',
  'w-full',
  'h-auto',
  'object-cover',
  'pt-20',
  'py-12',
  'px-4',
  'text-3xl',
  'font-bold',
  'mb-8',
  'mb-4',
];

// 存储提取的文本
const extractedTexts = {
  common: {
    navigation: {},
    buttons: {},
  },
  home: {
    hero: {},
    services: {},
    introduction: {},
    testimonials: {},
  },
  about: {},
  services: {},
  therapists: {},
  contact: {},
  booking: {},
};

// 扫描文件并提取文本
function extractTextsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const texts = [];

  // 提取引号中的文本
  let match;
  while ((match = TEXT_REGEX.exec(content)) !== null) {
    const text = match[1] || match[2];
    if (
      text.length > 2 && 
      !text.startsWith('/') && 
      !text.startsWith('@') && 
      !text.startsWith('http') &&
      !text.includes('${') &&
      !IGNORED_TEXTS.includes(text)
    ) {
      texts.push(text);
    }
  }

  // 提取JSX标签之间的文本
  while ((match = JSX_TEXT_REGEX.exec(content)) !== null) {
    const text = match[1].trim();
    if (
      text.length > 2 && 
      !text.startsWith('/') && 
      !text.startsWith('@') && 
      !text.includes('${') &&
      !IGNORED_TEXTS.includes(text)
    ) {
      texts.push(text);
    }
  }

  // 根据文件名分类文本
  if (fileName === 'Header.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.common.navigation[text]) {
        extractedTexts.common.navigation[text] = text;
      }
    });
  } else if (fileName === 'Footer.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.common[text]) {
        extractedTexts.common[text] = text;
      }
    });
  } else if (fileName === 'Hero.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.home.hero[text]) {
        extractedTexts.home.hero[text] = text;
      }
    });
  } else if (fileName === 'Services.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.services[text]) {
        extractedTexts.services[text] = text;
      }
    });
  } else if (fileName === 'Introduction.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.home.introduction[text]) {
        extractedTexts.home.introduction[text] = text;
      }
    });
  } else if (fileName === 'Testimonials.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.home.testimonials[text]) {
        extractedTexts.home.testimonials[text] = text;
      }
    });
  } else if (fileName === 'About.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.about[text]) {
        extractedTexts.about[text] = text;
      }
    });
  } else if (fileName === 'Therapists.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.therapists[text]) {
        extractedTexts.therapists[text] = text;
      }
    });
  } else if (fileName === 'Contact.tsx') {
    texts.forEach(text => {
      if (!extractedTexts.contact[text]) {
        extractedTexts.contact[text] = text;
      }
    });
  } else {
    texts.forEach(text => {
      if (!extractedTexts.common[text]) {
        extractedTexts.common[text] = text;
      }
    });
  }

  return texts;
}

// 扫描目录中的所有文件
function scanDirectory(dir) {
  const files = glob.sync(`${dir}/**/*.{tsx,jsx}`);
  files.forEach(file => {
    console.log(`Scanning ${file}...`);
    extractTextsFromFile(file);
  });
}

// 执行扫描
console.log('Extracting texts from components...');
scanDirectory(COMPONENTS_DIR);
console.log('Extracting texts from pages...');
scanDirectory(PAGES_DIR);

// 将提取的文本写入文件
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(extractedTexts, null, 2));
console.log(`Extracted texts saved to ${OUTPUT_FILE}`); 