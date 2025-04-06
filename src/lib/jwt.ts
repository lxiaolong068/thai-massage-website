import * as jose from 'jose';

// 定义Token载荷类型
export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: unknown; // 允许其他属性
}

// 获取JWT密钥，确保存在
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('严重错误: JWT_SECRET环境变量未设置');
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
  }
  return secret;
};

// 生成JWT令牌
export async function signToken(payload: TokenPayload): Promise<string> {
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const alg = 'HS256';
    
    const jwt = await new jose.SignJWT({ ...payload })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
    
    return jwt;
  } catch (error) {
    console.error('JWT签名错误:', error);
    if (error instanceof Error) {
      console.error(`错误类型: ${error.name}, 消息: ${error.message}`);
    }
    throw new Error('无法生成令牌');
  }
}

// 验证JWT令牌
export async function verifyToken(token: string): Promise<TokenPayload> {
  if (!token) {
    console.error('JWT验证错误: 令牌为空');
    throw new Error('令牌不能为空');
  }
  
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jose.jwtVerify(token, secret);
    
    // 验证必需的字段
    const { id, email, name, role } = payload as any;
    if (!id || !email || !name || !role) {
      throw new Error('令牌缺少必需的字段');
    }
    
    return payload as TokenPayload;
  } catch (error) {
    console.error('JWT验证错误:', error);
    if (error instanceof jose.errors.JWTExpired) {
      console.error('JWT令牌已过期');
    } else if (error instanceof jose.errors.JWTInvalid) {
      console.error('JWT令牌无效');
    } else if (error instanceof Error) {
      console.error(`错误类型: ${error.name}, 消息: ${error.message}`);
    }
    throw new Error('无效的令牌');
  }
}

// 解码JWT令牌(不验证签名)
export function decodeToken(token: string): TokenPayload | null {
  if (!token) {
    console.error('JWT解码错误: 令牌为空');
    return null;
  }
  
  try {
    const decoded = jose.decodeJwt(token);
    
    // 验证必需的字段
    const { id, email, name, role } = decoded as any;
    if (!id || !email || !name || !role) {
      return null;
    }
    
    return decoded as TokenPayload;
  } catch (error) {
    console.error('JWT解码错误:', error);
    if (error instanceof Error) {
      console.error(`错误类型: ${error.name}, 消息: ${error.message}`);
    }
    return null;
  }
}

// 用于生成兼容性的函数，向前兼容
export const generateToken = signToken; 