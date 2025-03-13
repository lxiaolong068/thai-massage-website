// API测试脚本
const fetch = require('node-fetch');

// 基础URL
const BASE_URL = 'http://localhost:3000/api';

// 测试结果记录
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// 测试辅助函数
async function runTest(name, testFn) {
  testResults.total++;
  console.log(`\n正在测试: ${name}`);
  try {
    await testFn();
    testResults.passed++;
    testResults.details.push({ name, status: '通过', error: null });
    console.log(`✅ 测试通过: ${name}`);
  } catch (error) {
    testResults.failed++;
    testResults.details.push({ name, status: '失败', error: error.message });
    console.error(`❌ 测试失败: ${name}`);
    console.error(`   错误信息: ${error.message}`);
  }
}

// 服务API测试
async function testServicesAPI() {
  // 测试获取所有服务
  await runTest('获取所有服务', async () => {
    const response = await fetch(`${BASE_URL}/services?locale=en`);
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (!Array.isArray(data.data)) throw new Error('返回数据不是数组');
    console.log(`   获取到 ${data.data.length} 个服务`);
  });

  // 测试创建服务
  let createdServiceId;
  await runTest('创建新服务', async () => {
    const serviceData = {
      price: 1200,
      duration: 60,
      imageUrl: 'https://example.com/test-service.jpg',
      translations: [
        {
          locale: 'en',
          name: 'Test Service',
          description: 'This is a test service',
          slug: 'test-service'
        },
        {
          locale: 'zh',
          name: '测试服务',
          description: '这是一个测试服务',
          slug: 'test-service'
        }
      ]
    };

    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (!data.data.id) throw new Error('返回数据没有ID');
    
    createdServiceId = data.data.id;
    console.log(`   创建的服务ID: ${createdServiceId}`);
  });

  // 测试获取单个服务
  await runTest('获取单个服务', async () => {
    if (!createdServiceId) throw new Error('没有可测试的服务ID');
    
    const response = await fetch(`${BASE_URL}/services/${createdServiceId}?locale=en`);
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (data.data.id !== createdServiceId) throw new Error('返回的ID与创建的ID不匹配');
    console.log(`   服务名称: ${data.data.name}`);
  });

  // 测试更新服务
  await runTest('更新服务', async () => {
    if (!createdServiceId) throw new Error('没有可测试的服务ID');
    
    const updateData = {
      price: 1500,
      translations: [
        {
          locale: 'en',
          name: 'Updated Test Service',
          description: 'This is an updated test service'
        }
      ]
    };

    const response = await fetch(`${BASE_URL}/services/${createdServiceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    console.log(`   服务已更新`);
  });

  // 测试删除服务
  await runTest('删除服务', async () => {
    if (!createdServiceId) throw new Error('没有可测试的服务ID');
    
    const response = await fetch(`${BASE_URL}/services/${createdServiceId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    console.log(`   服务已删除`);
  });
}

// 按摩师API测试
async function testTherapistsAPI() {
  // 测试获取所有按摩师
  await runTest('获取所有按摩师', async () => {
    const response = await fetch(`${BASE_URL}/therapists?locale=en`);
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (!Array.isArray(data.data)) throw new Error('返回数据不是数组');
    console.log(`   获取到 ${data.data.length} 个按摩师`);
  });

  // 测试创建按摩师
  let createdTherapistId;
  await runTest('创建新按摩师', async () => {
    const therapistData = {
      imageUrl: 'https://example.com/test-therapist.jpg',
      specialties: ['Swedish', 'Deep Tissue'],
      experienceYears: 5,
      translations: [
        {
          locale: 'en',
          name: 'Test Therapist',
          bio: 'This is a test therapist',
          specialtiesTranslation: ['Swedish Massage', 'Deep Tissue Massage']
        },
        {
          locale: 'zh',
          name: '测试按摩师',
          bio: '这是一个测试按摩师',
          specialtiesTranslation: ['瑞典按摩', '深层组织按摩']
        }
      ]
    };

    const response = await fetch(`${BASE_URL}/therapists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(therapistData)
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (!data.data.id) throw new Error('返回数据没有ID');
    
    createdTherapistId = data.data.id;
    console.log(`   创建的按摩师ID: ${createdTherapistId}`);
  });

  // 测试获取单个按摩师
  await runTest('获取单个按摩师', async () => {
    if (!createdTherapistId) throw new Error('没有可测试的按摩师ID');
    
    const response = await fetch(`${BASE_URL}/therapists/${createdTherapistId}?locale=en`);
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (data.data.id !== createdTherapistId) throw new Error('返回的ID与创建的ID不匹配');
    console.log(`   按摩师名称: ${data.data.name}`);
  });

  // 测试更新按摩师
  await runTest('更新按摩师', async () => {
    if (!createdTherapistId) throw new Error('没有可测试的按摩师ID');
    
    const updateData = {
      experienceYears: 6,
      translations: [
        {
          locale: 'en',
          name: 'Updated Test Therapist',
          bio: 'This is an updated test therapist'
        }
      ]
    };

    const response = await fetch(`${BASE_URL}/therapists/${createdTherapistId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    console.log(`   按摩师已更新`);
  });

  // 保留按摩师ID用于预约测试
  return createdTherapistId;
}

// 预约API测试
async function testBookingsAPI(therapistId, serviceId) {
  // 测试获取所有预约
  await runTest('获取所有预约', async () => {
    const response = await fetch(`${BASE_URL}/bookings?locale=en`);
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (!Array.isArray(data.data)) throw new Error('返回数据不是数组');
    console.log(`   获取到 ${data.data.length} 个预约`);
  });

  // 测试创建预约
  let createdBookingId;
  await runTest('创建新预约', async () => {
    if (!therapistId || !serviceId) throw new Error('缺少按摩师ID或服务ID');
    
    const bookingData = {
      serviceId,
      therapistId,
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '1234567890'
    };

    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (!data.data.id) throw new Error('返回数据没有ID');
    
    createdBookingId = data.data.id;
    console.log(`   创建的预约ID: ${createdBookingId}`);
  });

  // 测试获取单个预约
  await runTest('获取单个预约', async () => {
    if (!createdBookingId) throw new Error('没有可测试的预约ID');
    
    const response = await fetch(`${BASE_URL}/bookings/${createdBookingId}?locale=en`);
    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    if (data.data.id !== createdBookingId) throw new Error('返回的ID与创建的ID不匹配');
    console.log(`   客户名称: ${data.data.customerName}`);
  });

  // 测试更新预约
  await runTest('更新预约', async () => {
    if (!createdBookingId) throw new Error('没有可测试的预约ID');
    
    const updateData = {
      customerName: 'Updated Customer',
      status: 'CONFIRMED'
    };

    const response = await fetch(`${BASE_URL}/bookings/${createdBookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    console.log(`   预约已更新`);
  });

  // 测试删除预约
  await runTest('删除预约', async () => {
    if (!createdBookingId) throw new Error('没有可测试的预约ID');
    
    const response = await fetch(`${BASE_URL}/bookings/${createdBookingId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    console.log(`   预约已删除`);
  });

  // 测试完成后删除测试按摩师
  await runTest('清理测试按摩师', async () => {
    if (!therapistId) throw new Error('没有可清理的按摩师ID');
    
    const response = await fetch(`${BASE_URL}/therapists/${therapistId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API返回失败状态');
    console.log(`   按摩师已删除`);
  });
}

// 主测试函数
async function runAllTests() {
  console.log('开始API测试...');
  console.log('===========================================');
  
  // 测试服务API
  console.log('\n🔍 测试服务API');
  await testServicesAPI();
  
  // 测试按摩师API
  console.log('\n🔍 测试按摩师API');
  const therapistId = await testTherapistsAPI();
  
  // 创建一个服务用于预约测试
  let serviceId;
  await runTest('创建测试服务用于预约测试', async () => {
    const serviceData = {
      price: 1000,
      duration: 30,
      imageUrl: 'https://example.com/booking-test.jpg',
      translations: [
        {
          locale: 'en',
          name: 'Booking Test Service',
          description: 'Service for booking test',
          slug: 'booking-test'
        }
      ]
    };

    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const data = await response.json();
    serviceId = data.data.id;
    console.log(`   创建的服务ID: ${serviceId}`);
  });
  
  // 测试预约API
  console.log('\n🔍 测试预约API');
  await testBookingsAPI(therapistId, serviceId);
  
  // 清理测试服务
  await runTest('清理测试服务', async () => {
    if (!serviceId) throw new Error('没有可清理的服务ID');
    
    const response = await fetch(`${BASE_URL}/services/${serviceId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
  });
  
  // 输出测试结果
  console.log('\n===========================================');
  console.log('测试完成!');
  console.log(`总测试数: ${testResults.total}`);
  console.log(`通过: ${testResults.passed}`);
  console.log(`失败: ${testResults.failed}`);
  
  if (testResults.failed > 0) {
    console.log('\n失败的测试:');
    testResults.details.filter(test => test.status === '失败').forEach(test => {
      console.log(`- ${test.name}: ${test.error}`);
    });
    process.exit(1);
  } else {
    console.log('\n🎉 所有测试通过!');
    process.exit(0);
  }
}

// 运行测试
runAllTests().catch(error => {
  console.error('测试过程中发生错误:', error);
  process.exit(1);
});
