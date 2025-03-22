-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 检查服务表中的数据
SELECT COUNT(*) FROM "Service";

-- 检查按摩师表中的数据
SELECT COUNT(*) FROM "Therapist";

-- 检查用户表中的数据
SELECT COUNT(*) FROM "User";

-- 检查预约表中的数据
SELECT COUNT(*) FROM "Booking";

-- 检查留言表中的数据
SELECT COUNT(*) FROM "Message";

-- 检查店铺设置表中的数据
SELECT COUNT(*) FROM "ShopSetting";

-- 获取服务表中的示例数据
SELECT * FROM "Service" LIMIT 2;

-- 获取服务翻译表中的示例数据
SELECT * FROM "ServiceTranslation" LIMIT 2; 