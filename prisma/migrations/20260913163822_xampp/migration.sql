-- AlterTable
ALTER TABLE `administrators` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `user_schools` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;
