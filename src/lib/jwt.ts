import jwt from 'jsonwebtoken';

// 定义Token载荷类型
export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// 获取JWT密钥，确保存在
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
  }
  return secret;
};

// 生成JWT令牌
export function signToken(payload: TokenPayload): string {
  try {
    return jwt.sign(payload, getJwtSecret(), {
      expiresIn: '24h', // 令牌24小时后过期
    });
  } catch (error) {
    console.error('JWT签名错误:', error);
    throw new Error('无法生成令牌');
  }
}

// 验证JWT令牌
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch (error) {
    console.error('JWT验证错误:', error);
    throw new Error('无效的令牌');
  }
}

// 解码JWT令牌(不验证签名)
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    console.error('JWT解码错误:', error);
    return null;
  }
}

// 用于生成兼容性的函数，向前兼容
export const generateToken = signToken; 