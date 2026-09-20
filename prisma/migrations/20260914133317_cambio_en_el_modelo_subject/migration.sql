/*
  Warnings:

  - You are about to drop the column `year_id` on the `subjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_year_id_fkey`;

-- DropIndex
DROP INDEX `academic_periods_name_key` ON `academic_periods`;

-- DropIndex
DROP INDEX `subjects_year_id_fkey` ON `subjects`;

-- AlterTable
ALTER TABLE `students` MODIFY `birth_date` DATE NULL,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `year_id`,
    ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `teachers` ALTER COLUMN `updated_at` DROP DEFAULT;
