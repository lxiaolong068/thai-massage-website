-- 创建 extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
