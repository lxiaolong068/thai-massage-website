-- 添加用户数据
INSERT INTO "users" (id, email, password_hash, name, role, created_at, updated_at)
VALUES 
('clu1', 'admin@example.com', '$2a$10$GQT/hZzHXBSGmKfNvNhRzeeGt1POYt3088cKYJBQFQoU5iYO5RA1C', 'Admin User', 'ADMIN', NOW(), NOW());

-- 添加服务数据
INSERT INTO "services" (id, price, duration, image_url, created_at, updated_at)
VALUES 
('cls1', 1500, 60, 'https://example.com/thai-massage.jpg', NOW(), NOW()),
('cls2', 2000, 90, 'https://example.com/oil-massage.jpg', NOW(), NOW());

-- 添加服务翻译数据
INSERT INTO "service_translations" (id, service_id, locale, name, description, slug)
VALUES 
('clst1', 'cls1', 'en', 'Thai Massage', 'Traditional Thai massage therapy', 'thai-massage'),
('clst2', 'cls1', 'zh', '泰式按摩', '传统泰式按摩疗法', 'thai-massage-zh'),
('clst3', 'cls2', 'en', 'Oil Massage', 'Relaxing oil massage therapy', 'oil-massage'),
('clst4', 'cls2', 'zh', '精油按摩', '放松精油按摩疗法', 'oil-massage-zh');

-- 添加按摩师数据
INSERT INTO "therapists" (id, image_url, specialties, experience_years, created_at, updated_at)
VALUES 
('clt1', 'https://example.com/therapist1.jpg', ARRAY['Thai Massage', 'Oil Massage'], 5, NOW(), NOW()),
('clt2', 'https://example.com/therapist2.jpg', ARRAY['Foot Massage', 'Thai Massage'], 3, NOW(), NOW());

-- 添加按摩师翻译数据
INSERT INTO "therapist_translations" (id, therapist_id, locale, name, bio, specialties_translation)
VALUES 
('cltt1', 'clt1', 'en', 'Somchai', 'Experienced massage therapist from Chiang Mai', ARRAY['Thai Massage', 'Oil Massage']),
('cltt2', 'clt1', 'zh', '宋猜', '来自清迈的经验丰富的按摩师', ARRAY['泰式按摩', '精油按摩']),
('cltt3', 'clt2', 'en', 'Malee', 'Professional therapist with 3 years of experience', ARRAY['Foot Massage', 'Thai Massage']),
('cltt4', 'clt2', 'zh', '玛丽', '拥有3年经验的专业治疗师', ARRAY['足部按摩', '泰式按摩']);

-- 添加店铺设置数据
INSERT INTO "shop_settings" (id, key, type, created_at, updated_at)
VALUES 
('clss1', 'shop_name', 'string', NOW(), NOW()),
('clss2', 'shop_address', 'string', NOW(), NOW()),
('clss3', 'shop_phone', 'string', NOW(), NOW());

-- 添加店铺设置翻译数据
INSERT INTO "shop_settings_translations" (id, setting_id, locale, value)
VALUES 
('clsst1', 'clss1', 'en', 'Victoria\'s Thai Massage'),
('clsst2', 'clss1', 'zh', '维多利亚泰式按摩'),
('clsst3', 'clss2', 'en', '123 Bangkok Street, Thailand'),
('clsst4', 'clss2', 'zh', '泰国曼谷街123号'),
('clsst5', 'clss3', 'en', '+66 123 456 789'),
('clsst6', 'clss3', 'zh', '+66 123 456 789'); 