-- AlterTable
ALTER TABLE `reservation_logs` ADD COLUMN `reservationId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `reservations` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `desc` VARCHAR(191) NULL,
    `content` TEXT NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `link` VARCHAR(191) NULL,
    `max_count` INTEGER NULL,
    `cover_image` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `start_at` DATETIME(3) NULL,
    `end_at` DATETIME(3) NULL,
    `user_id` VARCHAR(191) NULL,

    UNIQUE INDEX `reservations_id_key`(`id`),
    INDEX `reservations_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservation_logs` ADD CONSTRAINT `reservation_logs_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `reservations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
