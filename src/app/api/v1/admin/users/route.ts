import { NextRequest } from 'next/server';
import { apiSuccess, apiServerError, apiValidationError, apiNotFoundError } from '@/utils/api/response';
import { withAdminApi } from '../../middleware';

/**
 * 管理API - 获取所有用户
 * 此端点需要管理员授权
 */
async function getUsers(request: NextRequest) {
  try {
    // 获取查询参数
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // 模拟用户数据
    const mockUsers = [
      {
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        role: 'admin',
        status: 'active',
        lastLogin: '2023-11-10T08:30:00Z',
        createdAt: '2023-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: '李四',
        email: 'lisi@example.com',
        phone: '13900139000',
        role: 'staff',
        status: 'active',
        lastLogin: '2023-11-09T14:20:00Z',
        createdAt: '2023-02-20T09:15:00Z'
      },
      {
        id: '3',
        name: '王五',
        email: 'wangwu@example.com',
        phone: '13700137000',
        role: 'staff',
        status: 'inactive',
        lastLogin: '2023-10-25T11:45:00Z',
        createdAt: '2023-03-10T16:30:00Z'
      },
      {
        id: '4',
        name: '赵六',
        email: 'zhaoliu@example.com',
        phone: '13600136000',
        role: 'client',
        status: 'active',
        lastLogin: '2023-11-08T09:10:00Z',
        createdAt: '2023-04-05T13:45:00Z'
      },
      {
        id: '5',
        name: '钱七',
        email: 'qianqi@example.com',
        phone: '13500135000',
        role: 'client',
        status: 'active',
        lastLogin: '2023-11-07T16:20:00Z',
        createdAt: '2023-05-12T10:30:00Z'
      }
    ];
    
    // 根据查询参数过滤用户
    let filteredUsers = mockUsers;
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }
    
    // 计算分页
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    // 返回成功响应
    return apiSuccess({
      users: paginatedUsers,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('获取用户列表出错:', error);
    return apiServerError('获取用户列表失败');
  }
}

/**
 * 管理API - 创建用户
 * 此端点需要管理员授权
 */
async function createUser(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { name, email, phone, role, password } = body;
    
    // 验证必填字段
    if (!name || !email || !phone || !role || !password) {
      return apiValidationError('缺少必填字段');
    }
    
    // 验证电子邮件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiValidationError('电子邮件格式不正确');
    }
    
    // 验证电话号码格式
    const phoneRegex = /^[+\d\s-]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return apiValidationError('电话号码格式不正确');
    }
    
    // 验证角色
    const validRoles = ['admin', 'staff', 'client'];
    if (!validRoles.includes(role)) {
      return apiValidationError('无效的用户角色');
    }
    
    // 验证密码强度
    if (password.length < 8) {
      return apiValidationError('密码长度必须至少为8个字符');
    }
    
    // 模拟创建用户
    const newUser = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      email,
      phone,
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    // 返回成功响应
    return apiSuccess(newUser, '用户创建成功');
  } catch (error) {
    console.error('创建用户出错:', error);
    return apiServerError('创建用户失败');
  }
}

/**
 * 管理API - 更新用户
 * 此端点需要管理员授权
 */
async function updateUser(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id, name, email, phone, role, status } = body;
    
    // 验证必填字段
    if (!id) {
      return apiValidationError('用户ID不能为空');
    }
    
    // 验证电子邮件格式（如果提供）
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return apiValidationError('电子邮件格式不正确');
      }
    }
    
    // 验证电话号码格式（如果提供）
    if (phone) {
      const phoneRegex = /^[+\d\s-]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        return apiValidationError('电话号码格式不正确');
      }
    }
    
    // 验证角色（如果提供）
    if (role) {
      const validRoles = ['admin', 'staff', 'client'];
      if (!validRoles.includes(role)) {
        return apiValidationError('无效的用户角色');
      }
    }
    
    // 验证状态（如果提供）
    if (status) {
      const validStatuses = ['active', 'inactive'];
      if (!validStatuses.includes(status)) {
        return apiValidationError('无效的用户状态');
      }
    }
    
    // 模拟更新用户
    const updatedUser = {
      id,
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      role: role || undefined,
      status: status || undefined,
      updatedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(updatedUser, '用户更新成功');
  } catch (error) {
    console.error('更新用户出错:', error);
    return apiServerError('更新用户失败');
  }
}

/**
 * 管理API - 删除用户
 * 此端点需要管理员授权
 */
async function deleteUser(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id } = body;
    
    // 验证必填字段
    if (!id) {
      return apiValidationError('用户ID不能为空');
    }
    
    // 模拟删除用户
    const deletedUser = {
      id,
      deleted: true,
      deletedAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(deletedUser, '用户已删除');
  } catch (error) {
    console.error('删除用户出错:', error);
    return apiServerError('删除用户失败');
  }
}

/**
 * 管理API - 重置用户密码
 * 此端点需要管理员授权
 */
async function resetUserPassword(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { id, newPassword } = body;
    
    // 验证必填字段
    if (!id || !newPassword) {
      return apiValidationError('用户ID和新密码不能为空');
    }
    
    // 验证密码强度
    if (newPassword.length < 8) {
      return apiValidationError('密码长度必须至少为8个字符');
    }
    
    // 模拟重置密码
    const result = {
      id,
      passwordReset: true,
      resetAt: new Date().toISOString()
    };
    
    // 返回成功响应
    return apiSuccess(result, '用户密码已重置');
  } catch (error) {
    console.error('重置用户密码出错:', error);
    return apiServerError('重置用户密码失败');
  }
}

// 使用管理API中间件包装处理函数
export const GET = withAdminApi(getUsers);
export const POST = withAdminApi(createUser);
export const PUT = withAdminApi(updateUser);
export const DELETE = withAdminApi(deleteUser);
export const PATCH = withAdminApi(async (request: NextRequest) => {
  // 解析请求体以确定操作类型
  const body = await request.json();
  const { action } = body;
  
  if (action === 'resetPassword') {
    return resetUserPassword(request);
  }
  
  return apiValidationError('无效的操作类型');
}); 