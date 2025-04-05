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
    console.error('严重错误: JWT_SECRET环境变量未设置');
    throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
  }
  return secret;
};

// 生成JWT令牌
export function signToken(payload: TokenPayload): string {
  try {
    console.log(`正在为用户 ${payload.email} 生成JWT令牌`);
    const token = jwt.sign(payload, getJwtSecret(), {
      expiresIn: '24h', // 令牌24小时后过期
    });
    console.log(`令牌生成成功，长度: ${token.length}`);
    return token;
  } catch (error) {
    console.error('JWT签名错误:', error);
    if (error instanceof Error) {
      console.error(`错误类型: ${error.name}, 消息: ${error.message}`);
    }
    throw new Error('无法生成令牌');
  }
}

// 验证JWT令牌
export function verifyToken(token: string): TokenPayload {
  if (!token) {
    console.error('JWT验证错误: 令牌为空');
    throw new Error('令牌不能为空');
  }
  
  try {
    console.log(`正在验证JWT令牌, 长度: ${token.length}`);
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;
    console.log(`令牌验证成功，用户: ${decoded.email}, 角色: ${decoded.role}`);
    return decoded;
  } catch (error) {
    console.error('JWT验证错误:', error);
    
    // 详细记录错误类型和原因
    if (error instanceof jwt.JsonWebTokenError) {
      console.error(`JWT错误类型: ${error.name}, 原因: ${error.message}`);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error(`JWT令牌已过期, 过期时间: ${error.expiredAt}`);
    } else if (error instanceof jwt.NotBeforeError) {
      console.error(`JWT令牌尚未生效`);
    } else if (error instanceof Error) {
      console.error(`一般错误: ${error.name}, 消息: ${error.message}`);
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
    console.log(`正在解码JWT令牌, 长度: ${token.length}`);
    const decoded = jwt.decode(token) as TokenPayload;
    if (decoded) {
      console.log(`令牌解码成功，用户: ${decoded.email}`);
    } else {
      console.log(`令牌解码结果为空`);
    }
    return decoded;
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