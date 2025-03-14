// 服务管理功能测试脚本

// 模拟服务数据
const mockServices = [
  {
    id: '1',
    name: '泰式传统按摩',
    price: 599,
    duration: 60,
    createdAt: '2025-03-13T00:00:00Z',
    updatedAt: '2025-03-13T00:00:00Z',
    translations: [
      {
        id: '101',
        language: 'zh',
        name: '泰式传统按摩',
        description: '这是泰式传统按摩的描述'
      },
      {
        id: '102',
        language: 'en',
        name: 'Traditional Thai Massage',
        description: 'This is a description for traditional Thai massage'
      }
    ]
  },
  {
    id: '2',
    name: '精油按摩',
    price: 699,
    duration: 90,
    createdAt: '2025-03-12T00:00:00Z',
    updatedAt: '2025-03-12T00:00:00Z',
    translations: [
      {
        id: '201',
        language: 'zh',
        name: '精油按摩',
        description: '这是精油按摩的描述'
      },
      {
        id: '202',
        language: 'en',
        name: 'Oil Massage',
        description: 'This is a description for oil massage'
      }
    ]
  },
  {
    id: '3',
    name: '足部按摩',
    price: 399,
    duration: 45,
    createdAt: '2025-03-11T00:00:00Z',
    updatedAt: '2025-03-11T00:00:00Z',
    translations: [
      {
        id: '301',
        language: 'zh',
        name: '足部按摩',
        description: '这是足部按摩的描述'
      },
      {
        id: '302',
        language: 'en',
        name: 'Foot Massage',
        description: 'This is a description for foot massage'
      }
    ]
  }
];

// 测试搜索功能
function testSearch() {
  console.log('===== 测试搜索功能 =====');
  const searchTerm = '足部';
  const filteredServices = mockServices.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.translations.some(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  console.log(`搜索关键词: "${searchTerm}"`);
  console.log(`搜索结果数量: ${filteredServices.length}`);
  console.log('搜索结果:');
  filteredServices.forEach(service => {
    console.log(`- ${service.name} (ID: ${service.id})`);
  });
  console.log('搜索功能测试完成\n');
}

// 测试批量删除功能
function testBatchDelete() {
  console.log('===== 测试批量删除功能 =====');
  // 模拟选择多个服务
  const selectedServices = ['1', '3'];
  console.log(`选择的服务ID: ${selectedServices.join(', ')}`);
  
  // 模拟批量删除操作
  const updatedServices = mockServices.filter(service => !selectedServices.includes(service.id));
  
  console.log(`删除前服务数量: ${mockServices.length}`);
  console.log(`删除后服务数量: ${updatedServices.length}`);
  console.log('剩余服务:');
  updatedServices.forEach(service => {
    console.log(`- ${service.name} (ID: ${service.id})`);
  });
  console.log('批量删除功能测试完成\n');
}

// 测试国际化支持
function testInternationalization() {
  console.log('===== 测试国际化支持 =====');
  const languages = ['en', 'zh'];
  
  mockServices.forEach(service => {
    console.log(`服务: ${service.name} (ID: ${service.id})`);
    languages.forEach(lang => {
      const translation = service.translations.find(t => t.language === lang);
      if (translation) {
        console.log(`- ${lang}: ${translation.name}`);
      } else {
        console.log(`- ${lang}: 未提供翻译`);
      }
    });
  });
  console.log('国际化支持测试完成\n');
}

// 测试价格格式化
function testPriceFormatting() {
  console.log('===== 测试价格格式化 =====');
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  mockServices.forEach(service => {
    console.log(`服务: ${service.name}`);
    console.log(`- 原始价格: ${service.price}`);
    console.log(`- 格式化价格: ${formatPrice(service.price)}`);
  });
  console.log('价格格式化测试完成\n');
}

// 执行所有测试
console.log('\n===== 服务管理功能测试开始 =====\n');
testSearch();
testBatchDelete();
testInternationalization();
testPriceFormatting();
console.log('===== 服务管理功能测试完成 =====');
