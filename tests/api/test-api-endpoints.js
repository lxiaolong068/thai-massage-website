// 测试 API 端点脚本
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

// 创建测试 JWT 令牌
function createTestToken() {
  const payload = {
    id: 'test-admin-id',
    email: 'admin@example.com',
    name: 'Test Admin',
    role: 'ADMIN',
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

// 测试 API 端点
async function testApiEndpoints() {
  try {
    // 创建认证 cookie 和令牌
    const testToken = createTestToken();
    const testCookieHeader = createTestCookie();
    
    // 测试 POST /api/therapists 端点创建按摩师
    console.log('\n测试 POST /api/therapists 端点...');
    let testTherapistId;
    try {
      const createData = {
        imageUrl: 'https://example.com/api-test-image.jpg',
        specialties: ['Thai', 'Aromatherapy'],
        experienceYears: 3,
        workStatus: 'AVAILABLE',
        translations: [
          {
            locale: 'en',
            name: 'API Test Therapist',
            bio: 'This is an API test therapist bio in English',
            specialtiesTranslation: ['Thai Massage', 'Aromatherapy Massage'],
          },
          {
            locale: 'zh',
            name: 'API测试按摩师',
            bio: '这是一个API测试按摩师的中文简介',
            specialtiesTranslation: ['泰式按摩', '芳香疗法按摩'],
          },
          {
            locale: 'ko',
            name: 'API 테스트 마사지사',
            bio: '이것은 API 테스트 마사지사의 한국어 소개입니다',
            specialtiesTranslation: ['태국식 마사지', '아로마테라피 마사지'],
          },
        ],
      };
      
      const postResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'POST',
        headers: {
          'Cookie': testCookieHeader,
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'zh',
        },
        body: JSON.stringify(createData),
      });
      
      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log('POST 响应状态:', postResponse.status);
        console.log('创建成功消息:', postData.message);
        console.log('创建的按摩师:', {
          id: postData.data.id,
          experienceYears: postData.data.experienceYears,
          specialties: postData.data.specialties,
        });
        testTherapistId = postData.data.id;
      } else {
        const errorData = await postResponse.json();
        console.log('POST 请求失败:', postResponse.status, errorData);
      }
    } catch (error) {
      console.error('POST 请求出错:', error.message);
    }
    
    if (!testTherapistId) {
      console.log('无法创建测试按摩师，跳过后续测试');
      return;
    }
    
    // 测试 GET /api/therapists 端点
    console.log('\n测试 GET /api/therapists 端点...');
    try {
      const getResponse = await fetch('http://localhost:3000/api/therapists?locale=zh', {
        method: 'GET',
        headers: {
          'Cookie': testCookieHeader,
          'Authorization': `Bearer ${testToken}`,
        },
      });
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        console.log('GET 响应状态:', getResponse.status);
        console.log(`获取到 ${data.data.length} 个按摩师`);
        if (data.data.length > 0) {
          console.log('第一个按摩师:', {
            id: data.data[0].id,
            name: data.data[0].name,
            experienceYears: data.data[0].experienceYears,
          });
        }
      } else {
        const errorData = await getResponse.json();
        console.log('GET 请求失败:', getResponse.status, errorData);
      }
    } catch (error) {
      console.error('GET 请求出错:', error.message);
    }
    
    // 测试 GET /api/therapists/[id] 端点
    console.log(`\n测试 GET /api/therapists/${testTherapistId} 端点...`);
    try {
      const getDetailResponse = await fetch(`http://localhost:3000/api/therapists/${testTherapistId}?locale=zh`, {
        method: 'GET',
        headers: {
          'Cookie': testCookieHeader,
          'Authorization': `Bearer ${testToken}`,
        },
      });
      
      if (getDetailResponse.ok) {
        const detailData = await getDetailResponse.json();
        console.log('GET 详情响应状态:', getDetailResponse.status);
        console.log('按摩师详情:', {
          id: detailData.data.id,
          name: detailData.data.name,
          bio: detailData.data.bio,
          specialties: detailData.data.specialties,
        });
      } else {
        const errorData = await getDetailResponse.json();
        console.log('GET 详情请求失败:', getDetailResponse.status, errorData);
      }
    } catch (error) {
      console.error('GET 详情请求出错:', error.message);
    }
    
    // 测试 PUT /api/therapists/[id] 端点
    console.log(`\n测试 PUT /api/therapists/${testTherapistId} 端点...`);
    try {
      const updateData = {
        imageUrl: 'https://example.com/updated-api-test-image.jpg',
        specialties: ['Thai', 'Aromatherapy', 'Hot Stone'],
        experienceYears: 4,
        workStatus: 'AVAILABLE',
        translations: [
          {
            locale: 'en',
            name: 'Updated API Test Therapist',
            bio: 'This is an updated API test therapist bio in English',
            specialtiesTranslation: ['Thai Massage', 'Aromatherapy Massage', 'Hot Stone Massage'],
          },
          {
            locale: 'zh',
            name: '更新的API测试按摩师',
            bio: '这是一个更新的API测试按摩师的中文简介',
            specialtiesTranslation: ['泰式按摩', '芳香疗法按摩', '热石按摩'],
          },
          {
            locale: 'ko',
            name: '업데이트된 API 테스트 마사지사',
            bio: '이것은 업데이트된 API 테스트 마사지사의 한국어 소개입니다',
            specialtiesTranslation: ['태국식 마사지', '아로마테라피 마사지', '핫 스톤 마사지'],
          },
        ],
      };
      
      const putResponse = await fetch(`http://localhost:3000/api/therapists/${testTherapistId}`, {
        method: 'PUT',
        headers: {
          'Cookie': testCookieHeader,
          'Authorization': `Bearer ${testToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'zh',
        },
        body: JSON.stringify(updateData),
      });
      
      if (putResponse.ok) {
        const putData = await putResponse.json();
        console.log('PUT 响应状态:', putResponse.status);
        console.log('更新成功消息:', putData.message);
        console.log('更新后的按摩师:', {
          id: putData.data.id,
          experienceYears: putData.data.experienceYears,
          specialties: putData.data.specialties,
        });
      } else {
        const errorData = await putResponse.json();
        console.log('PUT 请求失败:', putResponse.status, errorData);
      }
    } catch (error) {
      console.error('PUT 请求出错:', error.message);
    }
    
    // 测试 DELETE /api/therapists/[id] 端点
    console.log(`\n测试 DELETE /api/therapists/${testTherapistId} 端点...`);
    try {
      const deleteResponse = await fetch(`http://localhost:3000/api/therapists/${testTherapistId}`, {
        method: 'DELETE',
        headers: {
          'Cookie': testCookieHeader,
          'Authorization': `Bearer ${testToken}`,
          'Accept-Language': 'zh',
        },
      });
      
      if (deleteResponse.ok) {
        const deleteData = await deleteResponse.json();
        console.log('DELETE 响应状态:', deleteResponse.status);
        console.log('删除成功消息:', deleteData.message);
      } else {
        const errorData = await deleteResponse.json();
        console.log('DELETE 请求失败:', deleteResponse.status, errorData);
      }
    } catch (error) {
      console.error('DELETE 请求出错:', error.message);
    }
    
    console.log('\n测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testApiEndpoints();
