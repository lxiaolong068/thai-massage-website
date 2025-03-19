-- 创建TherapistStatus枚举类型
CREATE TYPE "TherapistStatus" AS ENUM ('WORKING', 'AVAILABLE');

-- 添加work_status字段到therapists表
ALTER TABLE "therapists" ADD COLUMN "work_status" "TherapistStatus" NOT NULL DEFAULT 'AVAILABLE';
