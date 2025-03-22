-- 检查TherapistTranslation表中的泰语记录
SELECT COUNT(*) AS therapist_thai_count FROM "therapist_translations" WHERE locale = 'th';

-- 检查ServiceTranslation表中的泰语记录
SELECT COUNT(*) AS service_thai_count FROM "service_translations" WHERE locale = 'th';

-- 检查ShopSettingTranslation表中的泰语记录
SELECT COUNT(*) AS setting_thai_count FROM "shop_settings_translations" WHERE locale = 'th';

-- 检查所有表中的语言分布
SELECT 'therapist_translations' AS table_name, locale, COUNT(*) AS count 
FROM "therapist_translations" 
GROUP BY locale
UNION ALL
SELECT 'service_translations' AS table_name, locale, COUNT(*) AS count 
FROM "service_translations" 
GROUP BY locale
UNION ALL
SELECT 'shop_settings_translations' AS table_name, locale, COUNT(*) AS count 
FROM "shop_settings_translations" 
GROUP BY locale
ORDER BY table_name, locale; 