const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

// 测试配置
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-jwt-secret';
const TEST_USER_ID = 'test-admin-user-id';

// 创建测试 JWT 令牌
function createTestToken(role = 'ADMIN') {
  const payload = {
    id: 'test-admin-id',
    email: 'admin@example.com',
    name: 'Test Admin',
    role: role,
  };
  
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET || 'test-secret', { expiresIn: '1h' });
}

// 创建测试 cookie
function createTestCookie() {
  return cookie.serialize('admin_session', 'test-session-value', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
}

// 创建认证头
function createAuthHeaders(token, cookie, locale = 'zh') {
  return {
    'Cookie': cookie,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept-Language': locale,
  };
}

// 创建认证 cookie 和令牌
const testToken = createTestToken();
const testCookieHeader = createTestCookie();
const headers = createAuthHeaders(testToken, testCookieHeader);

// 创建按摩师数据
function createTherapistData(suffix = '') {
  return {
    imageUrl: `https://example.com/api-test-image${suffix}.jpg`,
    specialties: ['Thai', 'Aromatherapy'],
    experienceYears: 3,
    workStatus: 'AVAILABLE',
    translations: [
      {
        locale: 'en',
        name: `API Test Therapist ${suffix}`,
        bio: `This is an API test therapist bio in English ${suffix}`,
        specialtiesTranslation: ['Thai Massage', 'Aromatherapy Massage'],
      },
      {
        locale: 'zh',
        name: `API测试按摩师 ${suffix}`,
        bio: `这是一个API测试按摩师的中文简介 ${suffix}`,
        specialtiesTranslation: ['泰式按摩', '香薰按摩'],
      },
      {
        locale: 'ko',
        name: `API 테스트 마사지사 ${suffix}`,
        bio: `이것은 API 테스트 마사지사의 한국어 소개입니다 ${suffix}`,
        specialtiesTranslation: ['태국 마사지', '아로마 테라피 마사지'],
      },
    ],
  };
}

// 主测试函数
async function runTests() {
  console.log('=== 批量操作错误处理测试 ===\n');
  
  // 创建多个测试按摩师用于批量操作
  console.log('创建多个测试按摩师...');
  const batchTherapistIds = [];
  for (let i = 1; i <= 3; i++) {
    try {
      const createData = createTherapistData(`-batch-error-${i}`);
      
      console.log(`尝试创建测试按摩师 ${i}...`);
      console.log('Headers:', JSON.stringify(headers, null, 2));
      console.log('Body:', JSON.stringify(createData, null, 2).substring(0, 200) + '...');
      
      const postResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'POST',
        headers,
        body: JSON.stringify(createData),
      });
      
      console.log(`响应状态码: ${postResponse.status}`);
      const responseText = await postResponse.text();
      console.log(`响应文本: ${responseText.substring(0, 200)}...`);
      
      if (postResponse.ok) {
        try {
          const postData = JSON.parse(responseText);
          batchTherapistIds.push(postData.data.id);
          console.log(`创建测试按摩师 ${i}，ID: ${postData.data.id}`);
        } catch (parseError) {
          console.error(`解析响应数据出错:`, parseError);
        }
      }
    } catch (error) {
      console.error(`创建测试按摩师 ${i} 出错:`, error.message);
    }
  }
  
  if (batchTherapistIds.length > 0) {
    // 测试无效的批量更新数据
    console.log('\n测试无效的批量更新数据...');
    try {
      const invalidUpdateData = {
        ids: batchTherapistIds,
        data: {
          workStatus: 'INVALID_STATUS', // 无效的状态值
        },
      };
      
      const patchResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(invalidUpdateData),
      });
      
      const responseData = await patchResponse.json();
      console.log('无效数据响应状态:', patchResponse.status);
      console.log('响应数据:', JSON.stringify(responseData, null, 2));
    } catch (error) {
      console.error('PATCH 请求出错:', error.message);
    }
    
    // 测试空 IDs 数组
    console.log('\n测试空 IDs 数组...');
    try {
      const emptyIdsData = {
        ids: [],
        data: {
          workStatus: 'AVAILABLE',
        },
      };
      
      const patchResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'PATCH',
        headers,
        body: JSON.stringify(emptyIdsData),
      });
      
      const responseData = await patchResponse.json();
      console.log('空 IDs 数组响应状态:', patchResponse.status);
      console.log('响应数据:', JSON.stringify(responseData, null, 2));
    } catch (error) {
      console.error('PATCH 请求出错:', error.message);
    }
    
    // 测试无效的批量删除数据
    console.log('\n测试无效的批量删除数据...');
    try {
      const invalidDeleteData = {
        ids: ['invalid-id-1', 'invalid-id-2'],
      };
      
      const deleteResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'DELETE',
        headers,
        body: JSON.stringify(invalidDeleteData),
      });
      
      const responseData = await deleteResponse.json();
      console.log('无效删除数据响应状态:', deleteResponse.status);
      console.log('响应数据:', JSON.stringify(responseData, null, 2));
    } catch (error) {
      console.error('DELETE 请求出错:', error.message);
    }
    
    // 清理测试数据
    console.log('\n清理测试数据...');
    try {
      const deleteData = {
        ids: batchTherapistIds,
      };
      
      const deleteResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'DELETE',
        headers,
        body: JSON.stringify(deleteData),
      });
      
      if (deleteResponse.ok) {
        const deleteData = await deleteResponse.json();
        console.log('清理成功，删除了', deleteData.data.count, '个测试按摩师');
      } else {
        console.log('清理失败:', deleteResponse.status);
      }
    } catch (error) {
      console.error('清理出错:', error.message);
    }
  }
  
  console.log('\n测试完成！');
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中出错:', error);
});
