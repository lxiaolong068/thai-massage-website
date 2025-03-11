-- 检查服务数据
SELECT COUNT(*) FROM services;
SELECT * FROM services LIMIT 2;

-- 检查服务翻译数据
SELECT COUNT(*) FROM service_translations;
SELECT * FROM service_translations LIMIT 2;

-- 检查按摩师数据
SELECT COUNT(*) FROM therapists;
SELECT * FROM therapists LIMIT 2;

-- 检查按摩师翻译数据
SELECT COUNT(*) FROM therapist_translations;
SELECT * FROM therapist_translations LIMIT 2;

-- 检查用户数据
SELECT COUNT(*) FROM users;
SELECT * FROM users LIMIT 2;

-- 检查店铺设置数据
SELECT COUNT(*) FROM shop_settings;
SELECT * FROM shop_settings LIMIT 2;

-- 检查店铺设置翻译数据
SELECT COUNT(*) FROM shop_settings_translations;
SELECT * FROM shop_settings_translations LIMIT 2; 