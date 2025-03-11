import { PrismaClient, BookingStatus, UserRole, MessageStatus } from '@prisma/client/index';

const prisma = new PrismaClient();

async function main() {
  console.log('开始添加示例数据...');

  try {
    // 动态导入bcrypt
    const bcrypt = await import('bcrypt');
    
    // 清理现有数据
    console.log('正在清理现有数据...');
    await prisma.booking.deleteMany({});
    await prisma.serviceTranslation.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.therapistTranslation.deleteMany({});
    await prisma.therapist.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.shopSettingTranslation.deleteMany({});
    await prisma.shopSetting.deleteMany({});
    await prisma.message.deleteMany({});

    console.log('已清理现有数据');

    // 创建管理员用户
    console.log('正在创建管理员用户...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: adminPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
      },
    });

    console.log('已创建管理员用户:', admin.email);

    // 创建服务
    console.log('正在创建服务示例数据...');
    const services = [
      {
        price: 800,
        duration: 60,
        imageUrl: '/images/traditional-thai-new.jpg',
        translations: [
          {
            locale: 'en',
            name: 'Traditional Thai Massage',
            description: 'Ancient techniques to relieve tension with authentic techniques.',
            slug: 'traditional-thai-massage',
          },
          {
            locale: 'zh',
            name: '传统泰式按摩',
            description: '使用正宗技术的古老按摩方法，缓解身体紧张。',
            slug: 'traditional-thai-massage',
          },
          {
            locale: 'th',
            name: 'นวดแผนไทยโบราณ',
            description: 'เทคนิคโบราณเพื่อบรรเทาความตึงเครียดด้วยเทคนิคดั้งเดิม',
            slug: 'traditional-thai-massage',
          },
          {
            locale: 'ko',
            name: '전통 태국 마사지',
            description: '정통 기법으로 긴장을 완화하는 고대 기술.',
            slug: 'traditional-thai-massage',
          },
        ],
      },
      {
        price: 800,
        duration: 60,
        imageUrl: '/images/neck-shoulder-new.jpg',
        translations: [
          {
            locale: 'en',
            name: 'Neck & Shoulder Massage',
            description: 'Focused massage to relieve tension in your neck and shoulders.',
            slug: 'neck-shoulder-massage',
          },
          {
            locale: 'zh',
            name: '颈肩按摩',
            description: '专注于缓解颈部和肩部紧张的按摩。',
            slug: 'neck-shoulder-massage',
          },
          {
            locale: 'th',
            name: 'นวดคอและไหล่',
            description: 'การนวดที่มุ่งเน้นเพื่อบรรเทาความตึงเครียดในคอและไหล่ของคุณ',
            slug: 'neck-shoulder-massage',
          },
          {
            locale: 'ko',
            name: '목과 어깨 마사지',
            description: '목과 어깨의 긴장을 완화하는 집중 마사지.',
            slug: 'neck-shoulder-massage',
          },
        ],
      },
      {
        price: 800,
        duration: 60,
        imageUrl: '/images/oil-massage-new.jpg',
        translations: [
          {
            locale: 'en',
            name: 'Oil Massage',
            description: 'Relaxing massage with aromatic oils to soothe your body and mind.',
            slug: 'oil-massage',
          },
          {
            locale: 'zh',
            name: '精油按摩',
            description: '使用芳香精油的放松按摩，舒缓您的身心。',
            slug: 'oil-massage',
          },
          {
            locale: 'th',
            name: 'นวดน้ำมัน',
            description: 'การนวดผ่อนคลายด้วยน้ำมันหอมระเหยเพื่อบรรเทาร่างกายและจิตใจของคุณ',
            slug: 'oil-massage',
          },
          {
            locale: 'ko',
            name: '오일 마사지',
            description: '아로마 오일로 몸과 마음을 진정시키는 편안한 마사지.',
            slug: 'oil-massage',
          },
        ],
      },
      {
        price: 800,
        duration: 60,
        imageUrl: '/images/aromatherapy-massage.jpg',
        translations: [
          {
            locale: 'en',
            name: 'Aromatherapy Massage',
            description: 'Therapeutic massage with essential oils for deep relaxation.',
            slug: 'aromatherapy-massage',
          },
          {
            locale: 'zh',
            name: '芳香疗法按摩',
            description: '使用精油的治疗按摩，带来深度放松。',
            slug: 'aromatherapy-massage',
          },
          {
            locale: 'th',
            name: 'นวดอโรมาเธอราพี',
            description: 'การนวดบำบัดด้วยน้ำมันหอมระเหยเพื่อการผ่อนคลายอย่างลึกซึ้ง',
            slug: 'aromatherapy-massage',
          },
          {
            locale: 'ko',
            name: '아로마테라피 마사지',
            description: '에센셜 오일을 사용한 치료 마사지로 깊은 휴식을 제공합니다.',
            slug: 'aromatherapy-massage',
          },
        ],
      },
      {
        price: 800,
        duration: 60,
        imageUrl: '/images/deep-tissue-new.jpg',
        translations: [
          {
            locale: 'en',
            name: 'Deep Tissue Massage',
            description: 'Intense massage targeting deep muscle layers for pain relief.',
            slug: 'deep-tissue-massage',
          },
          {
            locale: 'zh',
            name: '深层组织按摩',
            description: '针对深层肌肉的强力按摩，缓解疼痛。',
            slug: 'deep-tissue-massage',
          },
          {
            locale: 'th',
            name: 'นวดเนื้อเยื่อลึก',
            description: 'การนวดอย่างเข้มข้นที่มุ่งเป้าไปที่ชั้นกล้ามเนื้อลึกเพื่อบรรเทาอาการปวด',
            slug: 'deep-tissue-massage',
          },
          {
            locale: 'ko',
            name: '딥 티슈 마사지',
            description: '통증 완화를 위해 깊은 근육층을 대상으로 하는 강렬한 마사지.',
            slug: 'deep-tissue-massage',
          },
        ],
      },
      {
        price: 800,
        duration: 60,
        imageUrl: '/images/foot-massage.jpg',
        translations: [
          {
            locale: 'en',
            name: 'Foot Massage',
            description: 'Reflexology techniques to revitalize your feet and body.',
            slug: 'foot-massage',
          },
          {
            locale: 'zh',
            name: '足部按摩',
            description: '反射区按摩技术，为您的双脚和身体注入活力。',
            slug: 'foot-massage',
          },
          {
            locale: 'th',
            name: 'นวดเท้า',
            description: 'เทคนิคการนวดกดจุดเพื่อฟื้นฟูเท้าและร่างกายของคุณ',
            slug: 'foot-massage',
          },
          {
            locale: 'ko',
            name: '발 마사지',
            description: '발과 신체에 활력을 불어넣는 반사 요법 기술.',
            slug: 'foot-massage',
          },
        ],
      },
    ];

    for (const serviceData of services) {
      const { translations, ...serviceInfo } = serviceData;
      await prisma.service.create({
        data: {
          ...serviceInfo,
          translations: {
            create: translations,
          },
        },
      });
    }

    console.log('已创建服务示例数据');

    // 创建按摩师
    console.log('正在创建按摩师示例数据...');
    const therapists = [
      {
        imageUrl: '/images/therapist-1.jpg',
        specialties: ['Traditional Thai Massage', 'Oil Massage'],
        experienceYears: 8,
        translations: [
          {
            locale: 'en',
            name: 'Somying',
            bio: 'Somying is a certified massage therapist with 8 years of experience. She specializes in traditional Thai massage and oil massage.',
            specialtiesTranslation: ['Traditional Thai Massage', 'Oil Massage'],
          },
          {
            locale: 'zh',
            name: '索明',
            bio: '索明是一位拥有8年经验的认证按摩师。她专长于传统泰式按摩和精油按摩。',
            specialtiesTranslation: ['传统泰式按摩', '精油按摩'],
          },
          {
            locale: 'th',
            name: 'สมหญิง',
            bio: 'สมหญิงเป็นนักนวดที่ได้รับการรับรองด้วยประสบการณ์ 8 ปี เธอเชี่ยวชาญในการนวดแผนไทยโบราณและนวดน้ำมัน',
            specialtiesTranslation: ['นวดแผนไทยโบราณ', 'นวดน้ำมัน'],
          },
          {
            locale: 'ko',
            name: '솜잉',
            bio: '솜잉은 8년의 경험을 가진 인증된 마사지 치료사입니다. 그녀는 전통 태국 마사지와 오일 마사지를 전문으로 합니다.',
            specialtiesTranslation: ['전통 태국 마사지', '오일 마사지'],
          },
        ],
      },
      {
        imageUrl: '/images/therapist-2.jpg',
        specialties: ['Aromatherapy Massage', 'Deep Tissue Massage'],
        experienceYears: 10,
        translations: [
          {
            locale: 'en',
            name: 'Nattaya',
            bio: 'Nattaya has 10 years of experience in aromatherapy and deep tissue massage. She is known for her strong hands and attention to detail.',
            specialtiesTranslation: ['Aromatherapy Massage', 'Deep Tissue Massage'],
          },
          {
            locale: 'zh',
            name: '娜塔雅',
            bio: '娜塔雅在芳香疗法和深层组织按摩方面拥有10年经验。她以手法强劲和注重细节而闻名。',
            specialtiesTranslation: ['芳香疗法按摩', '深层组织按摩'],
          },
          {
            locale: 'th',
            name: 'ณัฐญา',
            bio: 'ณัฐญามีประสบการณ์ 10 ปีในการนวดอโรมาเธอราพีและนวดเนื้อเยื่อลึก เธอเป็นที่รู้จักในด้านมือที่แข็งแรงและความใส่ใจในรายละเอียด',
            specialtiesTranslation: ['นวดอโรมาเธอราพี', 'นวดเนื้อเยื่อลึก'],
          },
          {
            locale: 'ko',
            name: '나타야',
            bio: '나타야는 아로마테라피와 딥 티슈 마사지 분야에서 10년의 경험을 가지고 있습니다. 그녀는 강한 손과 세심한 주의력으로 유명합니다.',
            specialtiesTranslation: ['아로마테라피 마사지', '딥 티슈 마사지'],
          },
        ],
      },
      {
        imageUrl: '/images/therapist-3.jpg',
        specialties: ['Foot Massage', 'Neck & Shoulder Massage'],
        experienceYears: 7,
        translations: [
          {
            locale: 'en',
            name: 'Pranee',
            bio: 'Pranee specializes in foot massage and neck & shoulder massage. With 7 years of experience, she knows how to relieve tension in the most stressed areas.',
            specialtiesTranslation: ['Foot Massage', 'Neck & Shoulder Massage'],
          },
          {
            locale: 'zh',
            name: '帕尼',
            bio: '帕尼专长于足部按摩和颈肩按摩。凭借7年的经验，她知道如何缓解最紧张区域的压力。',
            specialtiesTranslation: ['足部按摩', '颈肩按摩'],
          },
          {
            locale: 'th',
            name: 'ปราณี',
            bio: 'ปราณีเชี่ยวชาญในการนวดเท้าและนวดคอและไหล่ ด้วยประสบการณ์ 7 ปี เธอรู้วิธีบรรเทาความตึงเครียดในพื้นที่ที่เครียดมากที่สุด',
            specialtiesTranslation: ['นวดเท้า', 'นวดคอและไหล่'],
          },
          {
            locale: 'ko',
            name: '프라니',
            bio: '프라니는 발 마사지와 목과 어깨 마사지를 전문으로 합니다. 7년의 경험으로 가장 스트레스가 많은 부위의 긴장을 완화하는 방법을 알고 있습니다.',
            specialtiesTranslation: ['발 마사지', '목과 어깨 마사지'],
          },
        ],
      },
      {
        imageUrl: '/images/therapist-4.jpg',
        specialties: ['Traditional Thai Massage', 'Deep Tissue Massage'],
        experienceYears: 9,
        translations: [
          {
            locale: 'en',
            name: 'Malai',
            bio: 'Malai has 9 years of experience in traditional Thai massage and deep tissue massage. Her strong technique helps relieve chronic pain and tension.',
            specialtiesTranslation: ['Traditional Thai Massage', 'Deep Tissue Massage'],
          },
          {
            locale: 'zh',
            name: '玛莱',
            bio: '玛莱在传统泰式按摩和深层组织按摩方面拥有9年经验。她的强劲技术有助于缓解慢性疼痛和紧张。',
            specialtiesTranslation: ['传统泰式按摩', '深层组织按摩'],
          },
          {
            locale: 'th',
            name: 'มาลัย',
            bio: 'มาลัยมีประสบการณ์ 9 ปีในการนวดแผนไทยโบราณและนวดเนื้อเยื่อลึก เทคนิคที่แข็งแกร่งของเธอช่วยบรรเทาอาการปวดเรื้อรังและความตึงเครียด',
            specialtiesTranslation: ['นวดแผนไทยโบราณ', 'นวดเนื้อเยื่อลึก'],
          },
          {
            locale: 'ko',
            name: '말라이',
            bio: '말라이는 전통 태국 마사지와 딥 티슈 마사지 분야에서 9년의 경험을 가지고 있습니다. 그녀의 강한 기술은 만성 통증과 긴장을 완화하는 데 도움이 됩니다.',
            specialtiesTranslation: ['전통 태국 마사지', '딥 티슈 마사지'],
          },
        ],
      },
    ];

    for (const therapistData of therapists) {
      const { translations, ...therapistInfo } = therapistData;
      await prisma.therapist.create({
        data: {
          ...therapistInfo,
          translations: {
            create: translations,
          },
        },
      });
    }

    console.log('已创建按摩师示例数据');

    // 创建店铺设置
    console.log('正在创建店铺设置示例数据...');
    const shopSettings = [
      {
        key: 'shop_name',
        type: 'text',
        translations: [
          {
            locale: 'en',
            value: "Top Secret Outcall Massage",
          },
          {
            locale: 'zh',
            value: '维多利亚上门按摩',
          },
          {
            locale: 'th',
            value: 'นวดนอกสถานที่วิคตอเรีย',
          },
          {
            locale: 'ko',
            value: '빅토리아 출장 마사지',
          },
        ],
      },
      {
        key: 'shop_address',
        type: 'text',
        translations: [
          {
            locale: 'en',
            value: 'Sukhumvit Soi 13, Klongtoey Nua, Watthana, Bangkok, 10110',
          },
          {
            locale: 'zh',
            value: '曼谷市瓦塔纳区克隆托伊努阿素坤逸13巷，邮编10110',
          },
          {
            locale: 'th',
            value: 'สุขุมวิท ซอย 13, คลองเตยเหนือ, วัฒนา, กรุงเทพฯ, 10110',
          },
          {
            locale: 'ko',
            value: '수쿰빗 소이 13, 클롱토이 누아, 왓타나, 방콕, 10110',
          },
        ],
      },
      {
        key: 'shop_phone',
        type: 'text',
        translations: [
          {
            locale: 'en',
            value: '+66 XX XXX XXXX',
          },
          {
            locale: 'zh',
            value: '+66 XX XXX XXXX',
          },
          {
            locale: 'th',
            value: '+66 XX XXX XXXX',
          },
          {
            locale: 'ko',
            value: '+66 XX XXX XXXX',
          },
        ],
      },
      {
        key: 'shop_email',
        type: 'text',
        translations: [
          {
            locale: 'en',
            value: 'info@victorias-bangkok.com',
          },
          {
            locale: 'zh',
            value: 'info@victorias-bangkok.com',
          },
          {
            locale: 'th',
            value: 'info@victorias-bangkok.com',
          },
          {
            locale: 'ko',
            value: 'info@victorias-bangkok.com',
          },
        ],
      },
      {
        key: 'shop_working_hours',
        type: 'text',
        translations: [
          {
            locale: 'en',
            value: 'Available 24/7',
          },
          {
            locale: 'zh',
            value: '24/7全天候服务',
          },
          {
            locale: 'th',
            value: 'ให้บริการตลอด 24 ชั่วโมงทุกวัน',
          },
          {
            locale: 'ko',
            value: '24시간 연중무휴 이용 가능',
          },
        ],
      },
    ];

    for (const settingData of shopSettings) {
      const { translations, ...settingInfo } = settingData;
      await prisma.shopSetting.create({
        data: {
          ...settingInfo,
          translations: {
            create: translations,
          },
        },
      });
    }

    console.log('已创建店铺设置示例数据');

    // 创建示例预约
    console.log('正在创建预约示例数据...');
    const services1 = await prisma.service.findMany({
      take: 2,
    });
    
    const therapists1 = await prisma.therapist.findMany({
      take: 2,
    });
    
    if (services1.length > 0 && therapists1.length > 0) {
      const bookings = [
        {
          serviceId: services1[0].id,
          therapistId: therapists1[0].id,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
          time: '14:00',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+1 234 567 8901',
          status: BookingStatus.CONFIRMED,
        },
        {
          serviceId: services1[1].id,
          therapistId: therapists1[1].id,
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 后天
          time: '16:30',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '+1 987 654 3210',
          status: BookingStatus.PENDING,
        },
      ];
      
      for (const bookingData of bookings) {
        await prisma.booking.create({
          data: bookingData,
        });
      }
      
      console.log('已创建预约示例数据');
    }

    // 创建示例留言
    console.log('正在创建留言示例数据...');
    const messages = [
      {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        phone: '+1 123 456 7890',
        subject: 'Question about services',
        message: 'I would like to know more about your aromatherapy massage. What essential oils do you use?',
        status: MessageStatus.UNREAD,
      },
      {
        name: 'Lisa Wong',
        email: 'lisa@example.com',
        phone: '+1 234 567 8901',
        subject: 'Feedback',
        message: 'I had a wonderful experience with Nattaya. Her deep tissue massage was exactly what I needed for my back pain.',
        status: MessageStatus.READ,
        reply: 'Thank you for your feedback, Lisa! We are glad to hear that you enjoyed your massage with Nattaya. We look forward to serving you again soon.',
      },
    ];
    
    for (const messageData of messages) {
      await prisma.message.create({
        data: messageData,
      });
    }
    
    console.log('已创建留言示例数据');

    console.log('示例数据添加完成！');
  } catch (error) {
    console.error('添加示例数据时出错:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('添加示例数据时出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 