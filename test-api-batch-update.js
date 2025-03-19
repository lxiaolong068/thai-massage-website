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
  
  const therapistData = {
    imageUrl: `https://example.com/api-test-image-batch-update-${index}.jpg`,
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
  
  const response = await fetch(`${API_BASE_URL}/therapists`, {
    method: 'POST',
    headers,
    body: JSON.stringify(therapistData)
  });
  
  if (response.status === 200) {
    const data = await response.json();
    console.log(`创建测试按摩师 ${index}，ID: ${data.data.id}`);
    return data.data.id;
  } else {
    console.error(`创建测试按摩师 ${index} 失败，状态码: ${response.status}`);
    const errorText = await response.text();
    console.error(`错误信息: ${errorText}`);
    return null;
  }
}

// 测试批量更新
async function testBatchUpdate(ids, updateData) {
  const headers = createHeaders();
  console.log(`尝试更新按摩师 IDs: ${ids.join(', ')}...`);
  console.log(`更新数据: ${JSON.stringify(updateData)}`);
  
  const response = await fetch(`${API_BASE_URL}/therapists`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ ids, data: updateData })
  });
  
  console.log(`响应状态码: ${response.status}`);
  const responseData = await response.json();
  console.log('响应数据:', JSON.stringify(responseData, null, 2));
  
  return response.status === 200;
}

// 清理测试数据
async function cleanupTestData(ids) {
  if (ids.length === 0) return;
  
  console.log(`清理测试数据...`);
  const headers = createHeaders();
  
  const response = await fetch(`${API_BASE_URL}/therapists`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ ids })
  });
  
  if (response.status === 200) {
    console.log(`清理成功，删除了 ${ids.length} 个测试按摩师`);
  } else {
    console.error(`清理失败，状态码: ${response.status}`);
    const errorText = await response.text();
    console.error(`错误信息: ${errorText}`);
  }
}

// 主测试函数
async function runTests() {
  console.log('=== 批量更新操作测试 ===\n');
  
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
  
  console.log('\n测试 1: 更新存在的按摩师...');
  await testBatchUpdate(therapistIds, { experienceYears: 5, workStatus: 'AVAILABLE' });
  
  console.log('\n测试 2: 更新不存在的按摩师...');
  await testBatchUpdate(['non-existent-id-1', 'non-existent-id-2'], { experienceYears: 5 });
  
  console.log('\n测试 3: 更新混合存在和不存在的按摩师...');
  await testBatchUpdate([...therapistIds, 'non-existent-id-3'], { experienceYears: 7 });
  
  console.log('\n测试 4: 使用无效的 workStatus 值...');
  await testBatchUpdate(therapistIds, { workStatus: 'INVALID_STATUS' });
  
  // 清理测试数据
  await cleanupTestData(therapistIds);
  
  console.log('\n测试完成！');
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中出错:', error);
});
