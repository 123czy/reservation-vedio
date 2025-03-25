/*
  Warnings:

  - Made the column `content` on table `reservation_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `desc` on table `reservation_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `reservation_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `reservation_logs` MODIFY `address` VARCHAR(191) NULL,
    MODIFY `card_id` VARCHAR(191) NULL,
    MODIFY `content` TEXT NOT NULL,
    MODIFY `desc` VARCHAR(191) NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL;
