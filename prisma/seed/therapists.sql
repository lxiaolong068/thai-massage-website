-- 插入 Nattaya 按摩师数据
INSERT INTO therapists (id, image_url, specialties, experience_years, work_status, created_at, updated_at)
VALUES (
  'th_nattaya_001',
  '/images/therapists/nattaya.jpg',
  ARRAY['Oil Massage', 'Aromatherapy Massage', 'Swedish Massage'],
  3,
  'AVAILABLE',
  NOW(),
  NOW()
);

-- Nattaya 的英语翻译
INSERT INTO therapist_translations (id, therapist_id, locale, name, bio, specialties_translation)
VALUES (
  'th_nattaya_001_en',
  'th_nattaya_001',
  'en',
  'Nattaya',
  'With 3 years of experience in therapeutic massage, Nattaya specializes in oil massage and aromatherapy. Her gentle yet effective techniques help relieve stress and muscle tension. She is particularly skilled in Swedish massage techniques and creating a relaxing atmosphere for her clients.',
  ARRAY['Oil Massage', 'Aromatherapy Massage', 'Swedish Massage']
);

-- Nattaya 的中文翻译
INSERT INTO therapist_translations (id, therapist_id, locale, name, bio, specialties_translation)
VALUES (
  'th_nattaya_001_zh',
  'th_nattaya_001',
  'zh',
  '娜塔雅',
  '娜塔雅拥有3年专业按摩经验，专精于油压按摩和芳香疗法。她温和而有效的按摩技术能帮助缓解压力和肌肉紧张。她特别擅长瑞典式按摩技术，善于为顾客营造轻松舒适的氛围。',
  ARRAY['油压按摩', '芳香疗法按摩', '瑞典式按摩']
);

-- Nattaya 的韩语翻译 (替换泰语)
INSERT INTO therapist_translations (id, therapist_id, locale, name, bio, specialties_translation)
VALUES (
  'th_nattaya_001_ko', -- 修改 ID
  'th_nattaya_001',
  'ko', -- 修改 locale
  '나타야', -- 韩语名字
  '3년 경력의 테라피 마사지 전문가인 나타야는 오일 마사지와 아로마테라피를 전문으로 합니다. 그녀의 부드러우면서도 효과적인 기술은 스트레스와 근육 긴장을 완화하는 데 도움이 됩니다. 특히 스웨디시 마사지 기술에 능숙하며 고객을 위한 편안한 분위기를 조성합니다.', -- 韩语简介
  ARRAY['오일 마사지', '아로마테라피 마사지', '스웨디시 마사지'] -- 韩语专长翻译
);

-- 插入 Somchai 按摩师数据
INSERT INTO therapists (id, image_url, specialties, experience_years, work_status, created_at, updated_at)
VALUES (
  'th_somchai_001',
  '/images/therapists/somchai.jpg',
  ARRAY['Traditional Thai Massage', 'Thai Herbal Compress Massage', 'Foot Massage'],
  5,
  'AVAILABLE',
  NOW(),
  NOW()
);

-- Somchai 的英语翻译
INSERT INTO therapist_translations (id, therapist_id, locale, name, bio, specialties_translation)
VALUES (
  'th_somchai_001_en',
  'th_somchai_001',
  'en',
  'Somchai',
  'Somchai brings 5 years of expertise in traditional Thai massage. His deep understanding of ancient Thai healing techniques, combined with modern therapeutic approaches, provides a unique and effective treatment experience. He is particularly known for his skillful application of Thai herbal compress massage and precise foot reflexology.',
  ARRAY['Traditional Thai Massage', 'Thai Herbal Compress Massage', 'Foot Massage']
);

-- Somchai 的中文翻译
INSERT INTO therapist_translations (id, therapist_id, locale, name, bio, specialties_translation)
VALUES (
  'th_somchai_001_zh',
  'th_somchai_001',
  'zh',
  '宋猜',
  '宋猜拥有5年传统泰式按摩专业经验。他深谙泰式古法疗愈技术，结合现代治疗方法，为顾客提供独特而有效的治疗体验。他以精湛的泰式草药热敷按摩和精准的足部反射疗法而闻名。',
  ARRAY['传统泰式按摩', '泰式草药热敷按摩', '足部按摩']
);

-- Somchai 的韩语翻译 (替换泰语)
INSERT INTO therapist_translations (id, therapist_id, locale, name, bio, specialties_translation)
VALUES (
  'th_somchai_001_ko', -- 修改 ID
  'th_somchai_001',
  'ko', -- 修改 locale
  '솜차이', -- 韩语名字
  '솜차이는 5년간 전통 타이 마사지 전문 지식을 쌓아왔습니다. 고대 타이 치유 기술에 대한 깊은 이해와 현대적인 치료 접근 방식을 결합하여 독특하고 효과적인 치료 경험을 제공합니다. 특히 타이 허브 찜질 마사지의 능숙한 적용과 정확한 발 반사 요법으로 유명합니다.', -- 韩语简介
  ARRAY['전통 타이 마사지', '타이 허브 찜질 마사지', '발 마사지'] -- 韩语专长翻译
); 