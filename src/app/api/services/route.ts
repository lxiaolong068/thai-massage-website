import { NextRequest, NextResponse } from 'next/server';

// 获取所有服务 - 使用模拟数据，简化版本
export async function GET(request: NextRequest) {
  // 获取locale参数
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';
  
  // 模拟服务数据 - 支持中文、英文和韩文
  const mockServices = [
    {
      id: '1',
      price: 1200,
      duration: 60,
      imageUrl: '/images/traditional-thai-new.jpg',
      name: locale === 'zh' ? '传统泰式按摩' : locale === 'ko' ? '전통 태국 마사지' : 'Traditional Thai Massage',
      description: locale === 'zh' ? '使用正宗技术的古老按摩方法，缓解身体紧张。' : 
                  locale === 'ko' ? '정통 기법을 사용한 고대 마사지 방법으로 신체 긴장을 풀어줍니다.' : 
                  'Ancient massage method using authentic techniques to relieve body tension.',
      slug: 'traditional-thai-massage',
    },
    {
      id: '2',
      price: 1500,
      duration: 90,
      imageUrl: '/images/oil-massage-new.jpg',
      name: locale === 'zh' ? '精油按摩' : locale === 'ko' ? '오일 마사지' : 'Oil Massage',
      description: locale === 'zh' ? '使用芳香精油的放松按摩，舒缓您的身心。' : 
                  locale === 'ko' ? '향기로운 오일을 사용하는 편안한 마사지로 신체와 마음을 위로합니다.' : 
                  'Relaxing massage using aromatic oils to soothe your body and mind.',
      slug: 'oil-massage',
    },
    {
      id: '3',
      price: 1800,
      duration: 120,
      imageUrl: '/images/aromatherapy-massage.jpg',
      name: locale === 'zh' ? '芳香疗法按摩' : locale === 'ko' ? '아로마테라피 마사지' : 'Aromatherapy Massage',
      description: locale === 'zh' ? '使用精油的治疗按摩，带来深度放松。' : 
                  locale === 'ko' ? '딥 릴랙스에 위한 에센셜 오일을 사용한 치료 마사지입니다.' : 
                  'Therapeutic massage using essential oils for deep relaxation.',
      slug: 'aromatherapy-massage',
    },
    {
      id: '4',
      price: 1000,
      duration: 45,
      imageUrl: '/images/foot-massage.jpg',
      name: locale === 'zh' ? '足部按摩' : locale === 'ko' ? '발 마사지' : 'Foot Massage',
      description: locale === 'zh' ? '反射区按摩技术，为您的双脚和身体注入活力。' : 
                  locale === 'ko' ? '발과 신체를 활기차게 하는 반사구학 기법입니다.' : 
                  'Reflexology techniques to energize your feet and body.',
      slug: 'foot-massage',
    },
  ];

  // 直接返回成功响应
  return NextResponse.json({
    success: true,
    data: mockServices,
  });
}

// 创建新服务 - 模拟实现
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, duration, imageUrl, translations } = body;
    const locale = request.headers.get('Accept-Language') || 'en';

    // 验证必填字段
    if (!price || !duration || !imageUrl || !translations || !Array.isArray(translations)) {
      // 国际化错误消息
      const errorMessage = getLocalizedText(locale, {
        en: 'Missing required fields',
        zh: '缺少必填字段',
        ko: '필수 필드가 누락되었습니다'
      });
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: errorMessage,
          },
        },
        { status: 400 }
      );
    }

    // 模拟创建服务
    const mockService = {
      id: Math.floor(Math.random() * 1000).toString(),
      price,
      duration,
      imageUrl,
      translations: translations.map((translation: any) => ({
        id: Math.floor(Math.random() * 1000).toString(),
        locale: translation.locale,
        name: translation.name,
        description: translation.description,
        slug: translation.slug,
      })),
    };

    // 根据语言返回成功消息
    const successMessage = getLocalizedText(locale, {
      en: 'Service created successfully',
      zh: '服务创建成功',
      ko: '서비스가 성공적으로 생성되었습니다'
    });
    
    return NextResponse.json({
      success: true,
      data: mockService,
      message: successMessage,
    });
  } catch (error) {
    console.error('Error creating service:', error);
    const locale = request.headers.get('Accept-Language') || 'en';
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: getLocalizedErrorMessage(request, locale, 'create')
        },
      },
      { status: 500 }
    );
  }
}

// 根据语言获取本地化文本
function getLocalizedText(locale: string, texts: {en: string; zh?: string; ko?: string; [key: string]: string | undefined}): string {
  return (locale in texts && texts[locale]) ? texts[locale]! : texts.en; // 默认英文
}

// 根据语言获取本地化错误消息
function getLocalizedErrorMessage(request: NextRequest, locale: string, type: 'fetch' | 'create'): string {
  interface ErrorMessages {
    [key: string]: {
      en: string;
      zh: string;
      ko: string;
    }
  }
  
  const errorMessages: ErrorMessages = {
    fetch: {
      en: 'Failed to fetch services',
      zh: '获取服务失败',
      ko: '서비스를 가져오지 못했습니다'
    },
    create: {
      en: 'Failed to create service',
      zh: '创建服务失败',
      ko: '서비스 생성 실패'
    }
  };
  
  // 使用安全的类型检查和访问
  const messages = errorMessages[type];
  if (locale === 'zh') return messages.zh;
  if (locale === 'ko') return messages.ko;
  return messages.en;
}