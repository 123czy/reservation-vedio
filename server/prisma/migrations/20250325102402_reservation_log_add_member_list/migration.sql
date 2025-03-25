/*
  Warnings:

  - You are about to drop the column `mobile` on the `reservation_logs` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `reservation_logs` table. All the data in the column will be lost.
  - Added the required column `member_list` to the `reservation_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation_logs` DROP COLUMN `mobile`,
    DROP COLUMN `name`,
    ADD COLUMN `content` TEXT NULL,
    ADD COLUMN `desc` VARCHAR(191) NULL,
    ADD COLUMN `member_list` JSON NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NULL;
