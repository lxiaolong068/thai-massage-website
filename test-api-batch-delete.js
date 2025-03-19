const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

// 配置
const API_BASE_URL = 'http://localhost:3000/api';
const JWT_SECRET = 'your-jwt-secret'; // 替换为实际的 JWT 密钥

// 创建管理员 JWT
function createAdminJWT() {
  const payload = {
    id: 'test-admin-id',
    email: 'admin@example.com',
    name: 'Test Admin',
    role: 'ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET || JWT_SECRET);
}

// 创建请求头
function createHeaders(lang = 'zh') {
  const adminCookie = cookie.serialize('admin_session', 'test-session-value', {
    maxAge: 3600,
    path: '/',
    httpOnly: true
  });
  const token = createAdminJWT();
  return {
    'Cookie': adminCookie,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept-Language': lang
  };
}

// 创建测试按摩师
async function createTestTherapist(index) {
  const headers = createHeaders();
  console.log(`尝试创建测试按摩师 ${index}...`);
  console.log('Headers:', JSON.stringify(headers, null, 2));
  
  const therapistData = {
    imageUrl: `https://example.com/api-test-image-batch-delete-${index}.jpg`,
    specialties: ['Thai', 'Aromatherapy'],
    experienceYears: 3,
    workStatus: 'AVAILABLE',
    translations: [
      {
        locale: 'en',
        name: `API Test Therapist ${index}`,
        bio: `This is an API test therapist bio ${index}`,
        specialtiesTranslation: ['Traditional Thai', 'Aromatherapy']
      },
      {
        locale: 'zh',
        name: `API测试按摩师 ${index}`,
        bio: `这是一个API测试按摩师的中文简介 ${index}`,
        specialtiesTranslation: ['传统泰式按摩', '芳香疗法']
      },
      {
        locale: 'ko',
        name: `API 테스트 마사지사 ${index}`,
        bio: `이것은 API 테스트 마사지사의 한국어 소개입니다 ${index}`,
        specialtiesTranslation: ['전통 태국 마사지', '아로마테라피']
      }
    ]
  };
  
  const body = JSON.stringify(therapistData);
  console.log('Body:', body.substring(0, 200) + '...');
  
  const response = await fetch(`${API_BASE_URL}/therapists`, {
    method: 'POST',
    headers,
    body
  });
  
  const responseText = await response.text();
  console.log(`响应状态码: ${response.status}`);
  console.log(`响应文本: ${responseText.substring(0, 200)}...`);
  
  if (response.status === 200) {
    const data = JSON.parse(responseText);
    console.log(`创建测试按摩师 ${index}，ID: ${data.data.id}`);
    return data.data.id;
  } else {
    console.error(`创建测试按摩师 ${index} 失败`);
    return null;
  }
}

// 主测试函数
async function runTests() {
  console.log('=== 批量删除操作测试 ===\n');
  
  // 创建测试按摩师
  console.log('创建多个测试按摩师...');
  const therapistIds = [];
  for (let i = 1; i <= 3; i++) {
    const id = await createTestTherapist(i);
    if (id) therapistIds.push(id);
  }
  
  if (therapistIds.length === 0) {
    console.error('无法创建测试按摩师，测试中止');
    return;
  }
  
  console.log('\n测试 1: 删除存在的按摩师...');
  await testBatchDelete(therapistIds);
  
  console.log('\n测试 2: 删除不存在的按摩师...');
  await testBatchDelete(['non-existent-id-1', 'non-existent-id-2']);
  
  console.log('\n测试 3: 删除混合存在和不存在的按摩师...');
  // 创建一个新的测试按摩师
  const newId = await createTestTherapist('mixed');
  if (newId) {
    await testBatchDelete([newId, 'non-existent-id-3']);
    
    // 确认新创建的按摩师已被删除
    console.log('\n确认新创建的按摩师已被删除...');
    const checkResponse = await fetch(`${API_BASE_URL}/therapists/${newId}`, {
      method: 'GET',
      headers: createHeaders()
    });
    console.log(`检查响应状态: ${checkResponse.status}`);
    if (checkResponse.status === 404) {
      console.log('确认: 按摩师已成功删除');
    } else {
      console.log('警告: 按摩师可能未被删除');
      const responseText = await checkResponse.text();
      console.log(`响应: ${responseText.substring(0, 200)}`);
    }
  }
  
  console.log('\n测试完成！');
}

// 测试批量删除
async function testBatchDelete(ids) {
  const headers = createHeaders();
  console.log(`尝试删除按摩师 IDs: ${ids.join(', ')}...`);
  
  const response = await fetch(`${API_BASE_URL}/therapists`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ ids })
  });
  
  console.log(`响应状态码: ${response.status}`);
  const responseData = await response.json();
  console.log('响应数据:', JSON.stringify(responseData, null, 2));
  
  return response.status === 200;
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中出错:', error);
});
