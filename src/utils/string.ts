/**
 * 生成URL友好的slug
 * @param text 要转换的文本
 * @returns 转换后的slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')        // 将空格和下划线替换为连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, '') // 只保留字母、数字、中文和连字符
    .replace(/--+/g, '-')           // 将多个连字符替换为单个
    .replace(/^-+|-+$/g, '');       // 删除开头和结尾的连字符
}

/**
 * 截断文本到指定长度，并添加省略号
 * @param text 要截断的文本
 * @param length 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * 将文本的首字母大写
 * @param text 要转换的文本
 * @returns 转换后的文本
 */
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 将驼峰命名转换为连字符命名
 * @param text 要转换的文本
 * @returns 转换后的文本
 */
export function camelToKebab(text: string): string {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * 将连字符命名转换为驼峰命名
 * @param text 要转换的文本
 * @returns 转换后的文本
 */
export function kebabToCamel(text: string): string {
  return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 将连字符命名转换为帕斯卡命名
 * @param text 要转换的文本
 * @returns 转换后的文本
 */
export function kebabToPascal(text: string): string {
  return capitalizeFirstLetter(kebabToCamel(text));
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
} 