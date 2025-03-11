-- 删除TherapistTranslation表中的泰语记录
DELETE FROM "therapist_translations" WHERE locale = 'th';

-- 删除ServiceTranslation表中的泰语记录
DELETE FROM "service_translations" WHERE locale = 'th';

-- 删除ShopSettingTranslation表中的泰语记录
DELETE FROM "shop_settings_translations" WHERE locale = 'th'; 