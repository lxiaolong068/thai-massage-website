// 测试 API 脚本
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTherapistAPI() {
  try {
    // 直接使用 Prisma 客户端测试
    console.log('测试获取所有按摩师...');
    const therapists = await prisma.therapist.findMany({
      include: {
        translations: true,
      },
    });
    
    if (therapists.length === 0) {
      console.log('没有找到按摩师，创建测试数据...');
      // 创建测试按摩师
      const newTherapist = await prisma.therapist.create({
        data: {
          imageUrl: 'https://example.com/test-image.jpg',
          specialties: ['Swedish', 'Deep Tissue'],
          experienceYears: 5,
          workStatus: 'AVAILABLE',
          translations: {
            create: [
              {
                locale: 'en',
                name: 'Test Therapist',
                bio: 'This is a test therapist bio in English',
                specialtiesTranslation: ['Swedish Massage', 'Deep Tissue Massage'],
              },
              {
                locale: 'zh',
                name: '测试按摩师',
                bio: '这是一个测试按摩师的中文简介',
                specialtiesTranslation: ['瑞典按摩', '深层组织按摩'],
              },
              {
                locale: 'ko',
                name: '테스트 마사지사',
                bio: '이것은 한국어로 된 테스트 마사지사 소개입니다',
                specialtiesTranslation: ['스웨디시 마사지', '딥 티슈 마사지'],
              },
            ],
          },
        },
        include: {
          translations: true,
        },
      });
      
      console.log('创建的测试按摩师:', JSON.stringify(newTherapist, null, 2));
      
      // 测试获取单个按摩师
      console.log(`\n测试获取单个按摩师 (ID: ${newTherapist.id})...`);
      const singleTherapist = await prisma.therapist.findUnique({
        where: { id: newTherapist.id },
        include: {
          translations: true,
        },
      });
      
      console.log('获取的单个按摩师:', JSON.stringify(singleTherapist, null, 2));
      
      // 测试更新按摩师
      console.log(`\n测试更新按摩师 (ID: ${newTherapist.id})...`);
      const updatedTherapist = await prisma.therapist.update({
        where: { id: newTherapist.id },
        data: {
          experienceYears: 6,
          translations: {
            updateMany: [
              {
                where: { locale: 'en' },
                data: { 
                  name: 'Updated Test Therapist',
                  bio: 'This is an updated test therapist bio in English',
                },
              },
            ],
          },
        },
        include: {
          translations: true,
        },
      });
      
      console.log('更新后的按摩师:', JSON.stringify(updatedTherapist, null, 2));
      
      // 测试删除按摩师
      console.log(`\n测试删除按摩师 (ID: ${newTherapist.id})...`);
      const deletedTherapist = await prisma.therapist.delete({
        where: { id: newTherapist.id },
        include: {
          translations: true,
        },
      });
      
      console.log('已删除的按摩师:', JSON.stringify(deletedTherapist, null, 2));
    } else {
      console.log(`找到 ${therapists.length} 个按摩师:`);
      therapists.forEach((therapist, index) => {
        console.log(`\n按摩师 ${index + 1}:`);
        console.log(`ID: ${therapist.id}`);
        console.log(`经验年限: ${therapist.experienceYears}`);
        console.log(`工作状态: ${therapist.workStatus}`);
        console.log('翻译:');
        therapist.translations.forEach(translation => {
          console.log(`  ${translation.locale}: ${translation.name}`);
        });
      });
      
      if (therapists.length > 0) {
        // 测试获取单个按摩师
        const testId = therapists[0].id;
        console.log(`\n测试获取单个按摩师 (ID: ${testId})...`);
        const singleTherapist = await prisma.therapist.findUnique({
          where: { id: testId },
          include: {
            translations: true,
          },
        });
        
        console.log('获取的单个按摩师:');
        console.log(`ID: ${singleTherapist.id}`);
        console.log(`经验年限: ${singleTherapist.experienceYears}`);
        console.log(`工作状态: ${singleTherapist.workStatus}`);
        console.log('翻译:');
        singleTherapist.translations.forEach(translation => {
          console.log(`  ${translation.locale}: ${translation.name} - ${translation.bio.substring(0, 30)}...`);
        });
      }
    }
  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行测试
testTherapistAPI();
