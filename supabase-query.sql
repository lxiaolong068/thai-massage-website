-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 检查服务表中的数据
SELECT COUNT(*) FROM "services";

-- 检查按摩师表中的数据
SELECT COUNT(*) FROM "therapists";

-- 检查用户表中的数据
SELECT COUNT(*) FROM "users";

-- 检查预约表中的数据
SELECT COUNT(*) FROM "bookings";

-- 检查留言表中的数据
SELECT COUNT(*) FROM "messages";

-- 检查店铺设置表中的数据
SELECT COUNT(*) FROM "shop_settings";

-- 获取服务表中的示例数据
SELECT * FROM "services" LIMIT 2;

-- 获取服务翻译表中的示例数据
SELECT * FROM "service_translations" LIMIT 2; 