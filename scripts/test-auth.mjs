// 测试认证API的脚本
import fetch from 'node-fetch';

// 基础URL
const BASE_URL = 'http://localhost:3000';

// 测试用户数据 - 尝试不同的管理员账户
const TEST_USER = {
  name: '测试管理员',
  email: 'admin@example.com', // 尝试使用其他可能存在的管理员邮箱
  password: 'password123',
};

// 测试管理员设置API
async function testAdminSetup() {
  console.log('🔍 测试管理员设置API');
  
  try {
    // 检查管理员是否已存在
    console.log('正在测试: 检查管理员是否存在');
    const checkResponse = await fetch(`${BASE_URL}/api/admin/setup`);
    
    // 如果返回的不是JSON，则可能是服务器错误
    let checkData;
    try {
      const contentType = checkResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        checkData = await checkResponse.json();
      } else {
        const text = await checkResponse.text();
        console.log(`   返回非JSON响应: ${text.substring(0, 100)}...`);
        throw new Error('服务器错误，请稍后再试');
      }
    } catch (e) {
      throw new Error(`解析响应失败: ${e.message}`);
    }
    
    if (checkData.adminExists) {
      console.log('   管理员已存在，跳过创建测试');
      console.log('✅ 测试通过: 检查管理员是否存在');
      return true;
    }
    
    // 创建管理员账户
    console.log('正在测试: 创建管理员账户');
    const setupResponse = await fetch(`${BASE_URL}/api/admin/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER),
    });
    
    // 如果返回的不是JSON，则可能是服务器错误
    let setupData;
    try {
      const contentType = setupResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        setupData = await setupResponse.json();
      } else {
        const text = await setupResponse.text();
        console.log(`   返回非JSON响应: ${text.substring(0, 100)}...`);
        throw new Error('服务器错误，请稍后再试');
      }
    } catch (e) {
      throw new Error(`解析响应失败: ${e.message}`);
    }
    
    if (!setupResponse.ok) {
      throw new Error(`创建管理员失败: ${setupData.error?.message || '未知错误'}`);
    }
    
    console.log(`   创建的管理员ID: ${setupData.data?.id || 'unknown'}`);
    console.log('✅ 测试通过: 创建管理员账户');
    return true;
  } catch (error) {
    console.error(`❌ 测试失败: ${error.message}`);
    return false;
  }
}

// 测试登录API
async function testLogin() {
  console.log('\n🔍 测试登录API');
  
  try {
    console.log('正在测试: 管理员登录');
    
    // 使用管理员登录API端点
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      }),
    });
    
    // 如果返回的不是JSON，则可能是服务器错误
    let loginData;
    try {
      const contentType = loginResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        loginData = await loginResponse.json();
      } else {
        const text = await loginResponse.text();
        console.log(`   返回非JSON响应: ${text.substring(0, 100)}...`);
        throw new Error('服务器错误，请稍后再试');
      }
    } catch (e) {
      throw new Error(`解析响应失败: ${e.message}`);
    }
    
    if (!loginResponse.ok) {
      // 当登录失败时，详细打印错误信息
      console.log(`   登录响应状态码: ${loginResponse.status}`);
      console.log(`   响应数据: ${JSON.stringify(loginData, null, 2)}`);
      
      if (loginData.error) {
        throw new Error(`登录失败: ${loginData.error.message || JSON.stringify(loginData.error)}`);
      } else {
        throw new Error(`登录失败: ${JSON.stringify(loginData)}`);
      }
    }
    
    console.log(`   登录成功: ${JSON.stringify(loginData)}`);
    console.log('✅ 测试通过: 管理员登录');
    return loginData;
  } catch (error) {
    console.error(`❌ 测试失败: ${error.message}`);
    return null;
  }
}

// 测试受保护的API
async function testProtectedApi(sessionData) {
  console.log('\n🔍 测试受保护的API');
  
  if (!sessionData) {
    console.log('   没有会话数据，跳过测试');
    return;
  }
  
  try {
    console.log('正在测试: 访问受保护的API');
    
    // 尝试访问管理员仪表盘（受保护的路由）
    const response = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: {
        'Cookie': `admin_session=${sessionData.data.id}`,
      },
    });
    
    // 显示详细的响应信息以便于调试
    console.log(`   响应状态码: ${response.status}`);
    let responseText;
    try {
      responseText = await response.text();
      console.log(`   响应内容: ${responseText.substring(0, 100)}...`);
      
      // 尝试解析JSON
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = JSON.parse(responseText);
        if (!response.ok) {
          throw new Error(`访问受保护的API失败: ${data.error?.message || JSON.stringify(data.error) || '未知错误'}`);
        }
        
        console.log(`   成功访问管理员仪表盘: ${JSON.stringify(data)}`);
        console.log('✅ 测试通过: 访问受保护的API');
      } else {
        // 非JSON响应
        if (response.ok) {
          console.log('   成功访问受保护的API（非JSON响应）');
          console.log('✅ 测试通过: 访问受保护的API');
        } else {
          throw new Error(`访问受保护的API失败: HTTP ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`   响应解析错误: ${error.message}`);
      throw new Error(`访问受保护的API失败: ${error.message}`);
    }
  } catch (error) {
    console.error(`❌ 测试失败: ${error.message}`);
  }
}

// 运行所有测试
async function runTests() {
  console.log('开始认证API测试...');
  console.log('===========================================');
  
  // 测试管理员设置
  const setupSuccess = await testAdminSetup();
  
  // 测试登录
  const sessionData = await testLogin();
  
  // 测试受保护的API
  await testProtectedApi(sessionData);
  
  console.log('===========================================');
  console.log('测试完成!');
}

// 执行测试
runTests().catch(console.error);
