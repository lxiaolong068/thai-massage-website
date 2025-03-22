// 全面测试 API 端点脚本
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

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

// 创建测试按摩师数据
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
        specialtiesTranslation: ['泰式按摩', '芳香疗法按摩'],
      },
      {
        locale: 'ko',
        name: `API 테스트 마사지사 ${suffix}`,
        bio: `이것은 API 테스트 마사지사의 한국어 소개입니다 ${suffix}`,
        specialtiesTranslation: ['태국식 마사지', '아로마테라피 마사지'],
      },
    ],
  };
}

// 测试 API 端点
async function testApiEndpoints() {
  try {
    // 创建认证 cookie 和令牌
    const testToken = createTestToken();
    const testCookieHeader = createTestCookie();
    const headers = createAuthHeaders(testToken, testCookieHeader);
    
    console.log('=== 基本 CRUD 操作测试 ===');
    
    // 测试 POST /api/therapists 端点创建按摩师
    console.log('\n测试 POST /api/therapists 端点...');
    let testTherapistId;
    try {
      const createData = createTherapistData();
      
      const postResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'POST',
        headers,
        body: JSON.stringify(createData),
      });
      
      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log('POST 响应状态:', postResponse.status);
        console.log('创建成功消息:', postData.message);
        console.log('创建的按摩师:', {
          id: postData.data.id,
          name: postData.data.name,
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
        headers,
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
        headers,
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
        headers,
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
    
    console.log('\n=== 批量操作测试 ===');
    
    // 创建多个测试按摩师用于批量操作
    console.log('\n创建多个测试按摩师...');
    const batchTherapistIds = [];
    for (let i = 1; i <= 3; i++) {
      try {
        const createData = createTherapistData(`-batch-${i}`);
        
        const postResponse = await fetch('http://localhost:3000/api/therapists', {
          method: 'POST',
          headers,
          body: JSON.stringify(createData),
        });
        
        if (postResponse.ok) {
          const postData = await postResponse.json();
          batchTherapistIds.push(postData.data.id);
          console.log(`创建测试按摩师 ${i}，ID: ${postData.data.id}`);
        }
      } catch (error) {
        console.error(`创建测试按摩师 ${i} 出错:`, error.message);
      }
    }
    
    if (batchTherapistIds.length > 0) {
      // 测试批量更新
      console.log('\n测试 PATCH /api/therapists 批量更新端点...');
      try {
        const batchUpdateData = {
          ids: batchTherapistIds,
          data: {
            workStatus: 'AVAILABLE',
          },
        };
        
        const patchResponse = await fetch('http://localhost:3000/api/therapists', {
          method: 'PATCH',
          headers,
          body: JSON.stringify(batchUpdateData),
        });
        
        if (patchResponse.ok) {
          const patchData = await patchResponse.json();
          console.log('PATCH 响应状态:', patchResponse.status);
          console.log('批量更新成功消息:', patchData.message);
          console.log(`更新了 ${patchData.data.count} 个按摩师`);
        } else {
          const errorData = await patchResponse.json();
          console.log('PATCH 请求失败:', patchResponse.status, JSON.stringify(errorData, null, 2));
          console.log('请求数据:', JSON.stringify(batchUpdateData, null, 2));
        }
      } catch (error) {
        console.error('PATCH 请求出错:', error.message);
      }
      
      // 测试批量删除
      console.log('\n测试 DELETE /api/therapists 批量删除端点...');
      try {
        const batchDeleteData = {
          ids: batchTherapistIds,
        };
        
        const deleteResponse = await fetch('http://localhost:3000/api/therapists', {
          method: 'DELETE',
          headers,
          body: JSON.stringify(batchDeleteData),
        });
        
        if (deleteResponse.ok) {
          const deleteData = await deleteResponse.json();
          console.log('DELETE 批量响应状态:', deleteResponse.status);
          console.log('批量删除成功消息:', deleteData.message);
          console.log(`删除了 ${deleteData.data.count} 个按摩师`);
        } else {
          const errorData = await deleteResponse.json();
          console.log('DELETE 批量请求失败:', deleteResponse.status, errorData);
        }
      } catch (error) {
        console.error('DELETE 批量请求出错:', error.message);
      }
    }
    
    console.log('\n=== 错误处理测试 ===');
    
    // 测试未授权访问
    console.log('\n测试未授权访问...');
    try {
      const noAuthResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'GET',
      });
      
      const errorData = await noAuthResponse.json();
      console.log('未授权访问响应状态:', noAuthResponse.status);
      console.log('错误消息:', errorData.error?.message);
    } catch (error) {
      console.error('未授权访问请求出错:', error.message);
    }
    
    // 测试无效 ID
    console.log('\n测试无效 ID...');
    try {
      const invalidIdResponse = await fetch('http://localhost:3000/api/therapists/invalid-id', {
        method: 'GET',
        headers,
      });
      
      const errorData = await invalidIdResponse.json();
      console.log('无效 ID 响应状态:', invalidIdResponse.status);
      console.log('错误消息:', errorData.error?.message);
    } catch (error) {
      console.error('无效 ID 请求出错:', error.message);
    }
    
    // 测试非管理员角色访问
    console.log('\n测试非管理员角色访问...');
    try {
      const userToken = createTestToken('USER');
      const userHeaders = createAuthHeaders(userToken, testCookieHeader);
      
      const noAdminResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'POST',
        headers: userHeaders,
        body: JSON.stringify(createTherapistData('-no-admin')),
      });
      
      const errorData = await noAdminResponse.json();
      console.log('非管理员访问响应状态:', noAdminResponse.status);
      console.log('错误消息:', errorData.error?.message);
    } catch (error) {
      console.error('非管理员访问请求出错:', error.message);
    }
    
    // 最后删除测试按摩师
    console.log(`\n删除测试按摩师 ${testTherapistId}...`);
    try {
      const deleteResponse = await fetch(`http://localhost:3000/api/therapists/${testTherapistId}`, {
        method: 'DELETE',
        headers,
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
    
    console.log('\n=== 多语言支持测试 ===');
    
    // 创建一个测试按摩师用于多语言测试
    console.log('\n创建测试按摩师用于多语言测试...');
    let langTestId;
    try {
      const createData = createTherapistData('-lang-test');
      
      const postResponse = await fetch('http://localhost:3000/api/therapists', {
        method: 'POST',
        headers,
        body: JSON.stringify(createData),
      });
      
      if (postResponse.ok) {
        const postData = await postResponse.json();
        langTestId = postData.data.id;
        console.log(`创建测试按摩师，ID: ${langTestId}`);
      }
    } catch (error) {
      console.error('创建测试按摩师出错:', error.message);
    }
    
    if (langTestId) {
      // 测试英文
      console.log('\n测试英文 (en) 响应...');
      try {
        const enHeaders = createAuthHeaders(testToken, testCookieHeader, 'en');
        const enResponse = await fetch(`http://localhost:3000/api/therapists/${langTestId}?locale=en`, {
          method: 'GET',
          headers: enHeaders,
        });
        
        if (enResponse.ok) {
          const enData = await enResponse.json();
          console.log('英文响应状态:', enResponse.status);
          console.log('英文按摩师详情:', {
            id: enData.data.id,
            name: enData.data.name,
            bio: enData.data.bio,
          });
        }
      } catch (error) {
        console.error('英文请求出错:', error.message);
      }
      
      // 测试中文
      console.log('\n测试中文 (zh) 响应...');
      try {
        const zhHeaders = createAuthHeaders(testToken, testCookieHeader, 'zh');
        const zhResponse = await fetch(`http://localhost:3000/api/therapists/${langTestId}?locale=zh`, {
          method: 'GET',
          headers: zhHeaders,
        });
        
        if (zhResponse.ok) {
          const zhData = await zhResponse.json();
          console.log('中文响应状态:', zhResponse.status);
          console.log('中文按摩师详情:', {
            id: zhData.data.id,
            name: zhData.data.name,
            bio: zhData.data.bio,
          });
        }
      } catch (error) {
        console.error('中文请求出错:', error.message);
      }
      
      // 测试韩文
      console.log('\n测试韩文 (ko) 响应...');
      try {
        const koHeaders = createAuthHeaders(testToken, testCookieHeader, 'ko');
        const koResponse = await fetch(`http://localhost:3000/api/therapists/${langTestId}?locale=ko`, {
          method: 'GET',
          headers: koHeaders,
        });
        
        if (koResponse.ok) {
          const koData = await koResponse.json();
          console.log('韩文响应状态:', koResponse.status);
          console.log('韩文按摩师详情:', {
            id: koData.data.id,
            name: koData.data.name,
            bio: koData.data.bio,
          });
        }
      } catch (error) {
        console.error('韩文请求出错:', error.message);
      }
      
      // 删除多语言测试按摩师
      console.log(`\n删除多语言测试按摩师 ${langTestId}...`);
      try {
        const deleteResponse = await fetch(`http://localhost:3000/api/therapists/${langTestId}`, {
          method: 'DELETE',
          headers,
        });
        
        if (deleteResponse.ok) {
          console.log('删除成功');
        }
      } catch (error) {
        console.error('删除请求出错:', error.message);
      }
    }
    
    console.log('\n测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testApiEndpoints();
